import { FeatureConnector } from "@/components/LayNGoLargePdpPlayStrip";
import { cn } from "@/lib/utils";

const PET_STORY_BASE = "/products/lay-n-go-travel-dog-bed-44";

const STORY_MAT_FLAT = `${PET_STORY_BASE}/story-mat-flat.png`;
const STORY_MAT_LIFESTYLE = `${PET_STORY_BASE}/story-mat-lifestyle.png`;
const STORY_CARRY = `${PET_STORY_BASE}/story-carry.png`;
const STORY_FOLD = `${PET_STORY_BASE}/story-fold.png`;
const STORY_STRAP = `${PET_STORY_BASE}/story-strap.png`;

/** Editorial strip below the Travel Dog Bed buy box: headline, full-bleed pair, then three-step row with Large-style arrows. */
export function LayNGoTravelDogBedPdpStrip() {
  const threeStepImageClassName = cn(
    "h-auto w-full max-w-full object-contain",
    "max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );
  const threeStepImageColClassName = "flex min-h-0 min-w-0 flex-1 basis-0 justify-center";

  return (
    <section
      className="relative left-1/2 -ml-[50vw] w-screen overflow-x-clip bg-white pb-10 pt-6 text-foreground sm:pb-12 sm:pt-8"
      aria-labelledby="lay-n-go-travel-dog-bed-story-heading"
    >
      <h2
        id="lay-n-go-travel-dog-bed-story-heading"
        className="mx-auto max-w-5xl px-4 text-center font-heading text-[clamp(1.85rem,7.5vw,3.65rem)] font-black uppercase leading-[0.92] tracking-tight text-foreground sm:px-4"
      >
        Your whole routine. One pull to pack it up.
      </h2>

      <div className="mt-8 grid w-full grid-cols-2 gap-0 sm:mt-10">
        <img
          src={STORY_MAT_FLAT}
          alt="Lay-n-Go pet mat with brown quilted surface and red lip, organized with collar, leash, rope toy, and accessories"
          className="block h-auto w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <img
          src={STORY_MAT_LIFESTYLE}
          alt="Red Lay-n-Go pet bag with wide strap, front pocket showing logo, phone, and retractable leash"
          className="block h-auto w-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className="mx-auto mt-14 flex w-full max-w-[min(100%,90rem)] flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 pt-12 sm:mt-16 sm:gap-1 sm:px-1 sm:pt-14 md:gap-2 lg:gap-3"
        aria-label="How the Lay-n-Go Travel Dog Bed packs up in three steps"
      >
        <div className={threeStepImageColClassName}>
          <img
            src={STORY_CARRY}
            alt="Person carrying the packed red Lay-n-Go pet bag over the shoulder next to a seated dog"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>

        <FeatureConnector label="Quick folding for easy cleanup" />

        <div className={threeStepImageColClassName}>
          <img
            src={STORY_FOLD}
            alt="Person folding the red Lay-n-Go mat lengthwise while the dog watches"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>

        <FeatureConnector label="Wide strap for easy travel and storage" />

        <div className={threeStepImageColClassName}>
          <img
            src={STORY_STRAP}
            alt="Packed red Lay-n-Go bag showing the wide strap and front pocket with Lay-n-Go logo"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
