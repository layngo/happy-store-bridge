import { FeatureConnector } from "@/components/LayNGoLargePdpPlayStrip";
import { cn } from "@/lib/utils";

const PET_STORY_BASE = "/products/lay-n-go-travel-dog-bed-44";

const STORY_MAT_FLAT = `${PET_STORY_BASE}/story-mat-flat.png`;
const STORY_MAT_LIFESTYLE = `${PET_STORY_BASE}/story-mat-lifestyle.png`;
const STORY_CARRY = `${PET_STORY_BASE}/story-carry.png`;
const STORY_FOLD = `${PET_STORY_BASE}/story-fold.png`;
const STORY_STRAP = `${PET_STORY_BASE}/story-strap.png`;
/** Transparent diagonal trail (built from `paw-print.png`). */
const PAW_TRAIL = `${PET_STORY_BASE}/paw-trail.png`;

const STORY_PRODUCT_CLASS =
  "relative z-10 block h-auto w-[min(88%,22rem)] max-w-none object-contain sm:w-[min(84%,20rem)]";

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

      <div className="relative mx-auto mt-8 w-full max-w-[min(100%,72rem)] overflow-visible px-3 sm:mt-10 sm:px-6 md:px-8">
        <div className="relative min-h-[min(95vw,26rem)] w-full sm:min-h-[28rem] md:min-h-[30rem]">
          <img
            src={PAW_TRAIL}
            alt=""
            width={1200}
            height={420}
            className="pointer-events-none absolute inset-x-[2%] bottom-[6%] top-[34%] z-0 mx-auto h-full w-[96%] max-w-[60rem] object-contain object-center sm:top-[36%] md:top-[38%]"
            loading="lazy"
            decoding="async"
          />

          <div className="relative grid w-full grid-cols-2 items-start gap-x-2">
            <div className="flex justify-start pt-[min(20vw,6.5rem)] sm:pt-24 md:pt-28">
              <img
                src={STORY_MAT_FLAT}
                alt="Lay-n-Go pet mat with brown quilted surface and red lip, organized with collar, leash, rope toy, and accessories"
                className={cn(STORY_PRODUCT_CLASS, "object-left")}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex justify-end">
              <img
                src={STORY_MAT_LIFESTYLE}
                alt="Red Lay-n-Go pet bag with wide strap, front pocket showing logo, phone, and retractable leash"
                className={cn(STORY_PRODUCT_CLASS, "object-right")}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative mx-auto mt-10 flex w-full max-w-[min(100%,90rem)] flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 sm:mt-12 sm:gap-1 sm:px-1 md:gap-2 lg:gap-3"
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
