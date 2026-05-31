#!/usr/bin/env python3
"""Parse scripts/press-archive-source.html into src/data/pressArchive.ts."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "press-archive-source.html"
OUTPUT = ROOT / "src" / "data" / "pressArchive.ts"


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


class PressArchiveParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.subtitle = ""
        self.sections: list[dict] = []
        self._capture_subtitle = False
        self._subtitle_parts: list[str] = []
        self._in_section = False
        self._current_section: dict | None = None
        self._current_category: dict | None = None
        self._in_table = False
        self._in_row = False
        self._in_header_row = False
        self._row_cells: list[str] = []
        self._cell_parts: list[str] = []
        self._in_cell = False
        self._row_classes: set[str] = set()
        self._article_link: str | None = None
        self._article_title_parts: list[str] = []
        self._no_link = False
        self._in_no_link = False
        self._in_link = False
        self._pending_h3: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_dict = {k: (v or "") for k, v in attrs}
        classes = set(attr_dict.get("class", "").split())

        if tag == "p" and "subtitle" in classes:
            self._capture_subtitle = True
            self._subtitle_parts = []
            return

        if tag == "div" and "section" in classes:
            self._in_section = True
            self._current_section = {"title": "", "categories": []}
            return

        if self._in_section and tag == "h2" and not self._current_section["title"]:
            self._pending_h3 = "__h2__"
            return

        if self._in_section and tag == "h3":
            if self._current_category is not None and self._current_section is not None:
                self._current_section["categories"].append(self._current_category)
            self._current_category = {"title": "", "articles": []}
            self._pending_h3 = "__h3__"
            return

        if self._in_section and tag == "table":
            self._in_table = True
            return

        if self._in_table and tag == "tr":
            self._in_row = True
            self._row_cells = []
            self._row_classes = classes
            self._in_header_row = "th" in {t for t, _ in attrs}  # unused fallback
            return

        if self._in_row and tag == "th":
            self._in_header_row = True
            return

        if self._in_row and tag == "td":
            self._in_cell = True
            self._cell_parts = []
            self._article_link = None
            self._no_link = False
            return

        if self._in_cell and tag == "a":
            self._in_link = True
            href = attr_dict.get("href", "")
            if href:
                self._article_link = href
            return

        if self._in_cell and tag == "span" and "no-link" in classes:
            self._in_no_link = True
            self._no_link = True
            return

    def handle_endtag(self, tag: str) -> None:
        if tag == "p" and self._capture_subtitle:
            self._capture_subtitle = False
            self.subtitle = normalize_text("".join(self._subtitle_parts))
            return

        if tag == "div" and self._in_section and self._current_section is not None:
            if self._current_category is not None:
                self._current_section["categories"].append(self._current_category)
                self._current_category = None
            self.sections.append(self._current_section)
            self._current_section = None
            self._in_section = False
            return

        if tag == "h2" and self._pending_h3 == "__h2__":
            if self._current_section is not None:
                self._current_section["title"] = normalize_text(self._current_section["title"])
            self._pending_h3 = None
            return

        if tag == "h3" and self._pending_h3 == "__h3__":
            if self._current_category is not None:
                self._current_category["title"] = normalize_text(self._current_category["title"])
            self._pending_h3 = None
            return

        if tag == "table":
            self._in_table = False
            return

        if tag == "tr" and self._in_row:
            if not self._in_header_row and len(self._row_cells) >= 3:
                date_cell, publication_cell, title_cell = (
                    self._row_cells[0],
                    self._row_cells[1],
                    self._row_cells[2],
                )
                article: dict = {
                    "date": date_cell["title"],
                    "publication": publication_cell["title"],
                    "title": title_cell["title"],
                    "featured": "featured" in self._row_classes,
                }
                if title_cell.get("href"):
                    article["href"] = title_cell["href"]
                if title_cell.get("unavailable"):
                    article["unavailable"] = True
                if self._current_category is not None:
                    self._current_category["articles"].append(article)
            self._in_row = False
            self._in_header_row = False
            self._row_cells = []
            return

        if tag == "td" and self._in_cell:
            cell = {
                "title": normalize_text("".join(self._cell_parts)),
                "href": self._article_link,
                "unavailable": self._no_link,
            }
            self._row_cells.append(cell)
            self._in_cell = False
            self._in_link = False
            self._in_no_link = False
            return

        if tag == "a":
            self._in_link = False
            return

        if tag == "span":
            self._in_no_link = False
            return

    def handle_data(self, data: str) -> None:
        if self._capture_subtitle:
            self._subtitle_parts.append(data)
            return

        if self._pending_h3 == "__h2__" and self._current_section is not None:
            self._current_section["title"] = normalize_text(
                self._current_section.get("title", "") + data
            )
            return

        if self._pending_h3 == "__h3__":
            if self._current_category is not None:
                self._current_category["title"] = normalize_text(
                    self._current_category["title"] + data
                )
            return

        if self._in_cell:
            self._cell_parts.append(data)

    def handle_entityref(self, name: str) -> None:
        entity = {"amp": "&", "lt": "<", "gt": ">", "quot": '"', "apos": "'"}
        self.handle_data(entity.get(name, f"&{name};"))

    def handle_charref(self, name: str) -> None:
        try:
            if name.startswith("x"):
                char = chr(int(name[1:], 16))
            else:
                char = chr(int(name))
        except ValueError:
            char = f"&#{name};"
        self.handle_data(char)


def parse_html(html: str) -> tuple[str, list[dict]]:
    parser = PressArchiveParser()
    parser.feed(html)
    if parser._current_section is not None:
        if parser._current_category is not None:
            parser._current_section["categories"].append(parser._current_category)
        parser.sections.append(parser._current_section)

    sections = []
    for section in parser.sections:
        title = section["title"]
        # Strip leading emoji/symbols from section titles for cleaner display
        categories = section["categories"]
        sections.append({"title": title, "categories": categories})

    return parser.subtitle, sections


def generate_ts(subtitle: str, sections: list[dict]) -> str:
    lines = [
        "/** Lay-n-Go complete press archive — generated from legacy press pages. */",
        "",
        "export type PressArticle = {",
        "  date: string;",
        "  publication: string;",
        "  title: string;",
        "  href?: string;",
        "  featured?: boolean;",
        "  unavailable?: boolean;",
        "};",
        "",
        "export type PressCategory = {",
        "  title: string;",
        "  articles: readonly PressArticle[];",
        "};",
        "",
        "export type PressSection = {",
        "  title: string;",
        "  categories: readonly PressCategory[];",
        "};",
        "",
        f"export const PRESS_ARCHIVE_SUBTITLE = {json.dumps(subtitle)};",
        "",
        f"export const PRESS_ARCHIVE_SECTIONS: readonly PressSection[] = {json.dumps(sections, indent=2, ensure_ascii=False)} as const;",
        "",
    ]
    return "\n".join(lines)


def main() -> None:
    html = SOURCE.read_text(encoding="utf-8")
    subtitle, sections = parse_html(html)
    OUTPUT.write_text(generate_ts(subtitle, sections), encoding="utf-8")

    article_count = sum(
        len(cat["articles"])
        for section in sections
        for cat in section["categories"]
    )
    print(f"Wrote {len(sections)} sections, {article_count} articles")
    print(f"Output: {OUTPUT}")


if __name__ == "__main__":
    main()
