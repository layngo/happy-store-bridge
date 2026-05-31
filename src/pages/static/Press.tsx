import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressArchiveContent } from "@/components/PressArchiveContent";
import { PRESS_ARCHIVE_SUBTITLE } from "@/data/pressArchive";

const Press = () => (
  <StaticPageLayout title="Complete Press Archive" contentClassName="max-w-6xl">
    {PRESS_ARCHIVE_SUBTITLE ? (
      <p className="text-muted-foreground italic">{PRESS_ARCHIVE_SUBTITLE}</p>
    ) : null}

    <PressArchiveContent />

    <p className="not-prose pt-6 text-sm text-muted-foreground">
      For press inquiries:{" "}
      <a href="mailto:info@layngo.com" className="text-primary hover:underline">
        info@layngo.com
      </a>
    </p>
  </StaticPageLayout>
);

export default Press;
