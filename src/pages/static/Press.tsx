import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressArchiveContent } from "@/components/PressArchiveContent";

const Press = () => (
  <StaticPageLayout title="Press" contentClassName="max-w-6xl">
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
