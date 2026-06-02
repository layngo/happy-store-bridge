import { StaticPageLayout } from "@/components/StaticPageLayout";
import { PressArchiveContent } from "@/components/PressArchiveContent";
import { PressFeaturedSection } from "@/components/PressFeaturedSection";

const Press = () => (
  <StaticPageLayout title="FEATURED PRESS" contentClassName="max-w-6xl">
    <PressFeaturedSection />
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
