import {
  PRESS_ARCHIVE_SECTIONS,
  type PressArticle,
  type PressCategory,
  type PressSection,
} from "@/data/pressArchive";

const ArticleTitle = ({ article }: { article: PressArticle }) => {
  if (article.unavailable || !article.href) {
    return (
      <span className="italic text-muted-foreground">{article.title}</span>
    );
  }

  return (
    <a
      href={article.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {article.title}
    </a>
  );
};

const PressTable = ({ category }: { category: PressCategory }) => (
  <div className="overflow-x-auto rounded-lg border border-border">
    <table className="w-full min-w-[640px] border-collapse text-sm">
      <thead>
        <tr className="border-b border-border bg-muted/50">
          <th className="px-4 py-2.5 text-left font-heading font-semibold text-foreground whitespace-nowrap w-[130px]">
            Date
          </th>
          <th className="px-4 py-2.5 text-left font-heading font-semibold text-foreground w-[180px]">
            Publication
          </th>
          <th className="px-4 py-2.5 text-left font-heading font-semibold text-foreground">
            Article
          </th>
        </tr>
      </thead>
      <tbody>
        {category.articles.map((article, index) => (
          <tr
            key={`${article.date}-${article.publication}-${article.title}-${index}`}
            className={`border-b border-border last:border-b-0 ${
              article.featured ? "bg-primary/5 font-medium" : ""
            }`}
          >
            <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap align-top">
              {article.date}
            </td>
            <td className="px-4 py-2.5 text-foreground align-top">{article.publication}</td>
            <td className="px-4 py-2.5 align-top">
              <ArticleTitle article={article} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PressSectionBlock = ({ section }: { section: PressSection }) => (
  <section className="space-y-6">
    <h2 className="font-heading text-xl font-bold text-primary bg-primary/10 px-4 py-2 rounded-md">
      {section.title}
    </h2>
    {section.categories.map((category) => (
      <div key={category.title} className="space-y-3">
        <h3 className="font-heading text-base font-semibold text-foreground border-l-4 border-primary pl-3 py-1 bg-muted/30">
          {category.title}
        </h3>
        <PressTable category={category} />
      </div>
    ))}
  </section>
);

export const PressArchiveContent = () => (
  <div className="not-prose space-y-10">
    {PRESS_ARCHIVE_SECTIONS.map((section) => (
      <PressSectionBlock key={section.title} section={section} />
    ))}
  </div>
);
