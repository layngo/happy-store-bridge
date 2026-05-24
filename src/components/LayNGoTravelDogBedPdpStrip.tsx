import { FeatureConnector } from "@/components/LayNGoLargePdpPlayStrip";
import { cn } from "@/lib/utils";

const PET_STORY_BASE = "/products/lay-n-go-travel-dog-bed-44";

const STORY_MAT_FLAT = `${PET_STORY_BASE}/story-mat-flat.png`;
const STORY_MAT_LIFESTYLE = `${PET_STORY_BASE}/story-mat-lifestyle.png`;
const STORY_CARRY = `${PET_STORY_BASE}/story-carry.png`;
const STORY_FOLD = `${PET_STORY_BASE}/story-fold.png`;
const STORY_STRAP = `${PET_STORY_BASE}/story-strap.png`;
const PAW_TRAIL = `${PET_STORY_BASE}/paw-trail.png`;

/** Editorial strip below the Travel Dog Bed buy box: headline, full-bleed pair, then three-step row with Large-style arrows. */
export function LayNGoTravelDogBedPdpStrip() {
  const threeStepImageClassName = cn(
    "h-auto w-full max-w-full object-contain",
    "max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );
  const threeStepImageColClassName = "flex min-h-0 min-w-0 flex-1 basis-0 justify-center";

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip bg-white pb-10 pt-6 text-foreground sm:pb-12 sm:pt-8"
      aria-labelledby="lay-n-go-travel-dog-bed-story-heading"
    >
      <h2
        id="lay-n-go-travel-dog-bed-story-heading"
        className="mx-auto max-w-[min(100%,34rem)] px-4 text-center font-heading text-[clamp(1.35rem,5.5vw,3.15rem)] font-black uppercase leading-[1.1] tracking-tight text-foreground sm:max-w-[min(100%,42rem)] sm:px-5 sm:text-[clamp(1.55rem,4.8vw,3.5rem)] md:max-w-[min(100%,56rem)] md:text-[clamp(1.7rem,4.2vw,3.85rem)]"
      >
        <span className="inline-block whitespace-nowrap">The last dog bed you&apos;ll</span>
        <br />
        ever need to carry
      </h2>

      {/*
        Single compositing stage (no grid columns — they split the paw trail at 50%).
        Stack: paw trail → product PNGs on top where they overlap.
      */}
      <div className="relative mx-auto mt-8 w-full max-w-[min(100%,72rem)] px-4 sm:mt-10 sm:px-8">
        <div className="relative w-full min-h-[min(72vw,22rem)] sm:min-h-[24rem] md:min-h-[28rem]">
          <img
            src={PAW_TRAIL}
            alt=""
            width={1024}
            height={681}
            className="pointer-events-none absolute left-1/2 top-[38%] z-[1] h-auto w-[min(100%,52rem)] max-w-none -translate-x-1/2 object-contain opacity-[0.92] sm:top-[40%]"
            loading="lazy"
            decoding="async"
          />

          <img
            src={STORY_MAT_FLAT}
            alt="Lay-n-Go pet mat with brown quilted surface and red lip, organized with collar, leash, rope toy, and accessories"
            className="pointer-events-none absolute left-0 top-0 z-[2] block h-auto w-[min(44%,20rem)] max-w-none object-contain object-left"
            loading="lazy"
            decoding="async"
          />

          <img
            src={STORY_MAT_LIFESTYLE}
            alt="Red Lay-n-Go pet bag with wide strap, front pocket showing logo, phone, and retractable leash"
            className="pointer-events-none absolute right-0 top-0 z-[2] block h-auto w-[min(44%,20rem)] max-w-none object-contain object-right"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div
        className="relative mx-auto mt-6 flex w-full max-w-[min(100%,90rem)] flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 sm:mt-8 sm:gap-1 sm:px-1 md:gap-2 lg:gap-3"
        aria-label="How the Lay-n-Go Travel Dog Bed packs up in three steps"
      >
        <div className={threeStepImageColClassName}>
          <img
            src={STORY_FOLD}
            alt="Person folding the red Lay-n-Go mat lengthwise while the dog watches"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>

        <FeatureConnector label="Quick folding for easy cleanup" />

        <div className={threeStepImageColClassName}>
          <img
            src={STORY_STRAP}
            alt="Packed red Lay-n-Go bag showing the wide strap and front pocket with Lay-n-Go logo"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>

        <FeatureConnector label="Wide strap for easy travel and storage" />

        <div className={threeStepImageColClassName}>
          <img
            src={STORY_CARRY}
            alt="Person carrying the packed red Lay-n-Go pet bag over the shoulder next to a seated dog"
            className={threeStepImageClassName}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
