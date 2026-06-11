import { FeatureConnector } from "@/components/LayNGoLargePdpPlayStrip";
import { cn } from "@/lib/utils";

const PET_STORY_BASE = "/products/lay-n-go-travel-dog-bed-44";

const STORY_MAT_FLAT = `${PET_STORY_BASE}/story-mat-flat.png`;
const STORY_MAT_LIFESTYLE = `${PET_STORY_BASE}/story-mat-lifestyle.png`;
const STORY_CARRY = `${PET_STORY_BASE}/story-carry.png`;
const STORY_FOLD = `${PET_STORY_BASE}/story-fold.png`;
const STORY_STRAP = `${PET_STORY_BASE}/story-strap.png`;

const DOG_BED_STORY_STEPS = [
  {
    src: STORY_FOLD,
    alt: "Person folding the red Lay-n-Go mat lengthwise while the dog watches",
    label: "Quick folding for easy cleanup",
  },
  {
    src: STORY_STRAP,
    alt: "Packed red Lay-n-Go bag showing the wide strap and front pocket with Lay-n-Go logo",
    label: "Wide strap for easy travel and storage",
  },
  {
    src: STORY_CARRY,
    alt: "Person carrying the packed red Lay-n-Go pet bag over the shoulder next to a seated dog",
    label: "Carry it anywhere you go",
  },
] as const;

function DogBedMobileDownArrow() {
  return (
    <svg
      className="mx-auto block h-14 w-11 shrink-0 text-neutral-900 sm:h-16 sm:w-12"
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 6 C24 22 24 38 24 50"
        stroke="currentColor"
        strokeWidth="2.35"
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <path d="M15 44 L24 60 L33 44" fill="currentColor" />
    </svg>
  );
}

function DogBedMobileStoryStep({
  src,
  alt,
  label,
  imgClassName,
}: {
  src: string;
  alt: string;
  label: string;
  imgClassName: string;
}) {
  return (
    <figure className="relative mx-auto w-full max-w-[min(100%,42rem)]">
      <img src={src} alt={alt} className={cn("block w-full object-contain", imgClassName)} loading="lazy" decoding="async" />
      <figcaption className="mt-2 px-2 sm:px-3">
        <p className="text-center font-heading text-[0.62rem] font-bold uppercase leading-tight tracking-wide text-neutral-900 sm:text-xs">
          {label}
        </p>
      </figcaption>
    </figure>
  );
}

/** Editorial strip below the Travel Dog Bed buy box: headline, full-bleed pair, then three-step row with Large-style arrows. */
export function LayNGoTravelDogBedPdpStrip() {
  const threeStepImageClassName = cn(
    "h-auto w-full max-w-full object-contain",
    "max-h-[min(34vh,220px)] sm:max-h-[min(42vh,300px)] md:max-h-[min(48vh,380px)] lg:max-h-[460px]",
  );
  const mobileApexImg = cn(threeStepImageClassName, "max-h-[min(50vh,340px)] sm:max-h-[min(56vh,420px)]");
  const mobileBaseImg = cn(threeStepImageClassName, "max-h-[min(42vh,280px)] sm:max-h-[min(50vh,380px)]");
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

      <div className="mt-8 grid w-full grid-cols-2 gap-0 sm:mt-10">
        <img
          src={STORY_MAT_FLAT}
          alt="Lay-n-Go pet mat with brown quilted surface and red lip, organized with collar, leash, rope toy, and accessories"
          className="block h-auto w-full max-w-none object-cover object-left"
          loading="lazy"
          decoding="async"
        />
        <img
          src={STORY_MAT_LIFESTYLE}
          alt="Red Lay-n-Go pet bag with wide strap, front pocket showing logo, phone, and retractable leash"
          className="block h-auto w-full max-w-none object-cover object-right"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className="relative mx-auto mt-14 max-w-[min(100%,90rem)] pt-12 sm:mt-16 sm:pt-14"
        aria-label="How the Lay-n-Go Travel Dog Bed packs up in three steps"
      >
        {/* Mobile: stacked steps with labels and down arrows */}
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-1 py-1 sm:gap-5 md:hidden">
          {DOG_BED_STORY_STEPS.map((step, index) => (
            <div key={step.src} className="contents">
              {index > 0 ? <DogBedMobileDownArrow /> : null}
              <DogBedMobileStoryStep
                src={step.src}
                alt={step.alt}
                label={step.label}
                imgClassName={index === 0 ? mobileApexImg : mobileBaseImg}
              />
            </div>
          ))}
        </div>

        {/* Desktop: horizontal strip */}
        <div className="mx-auto hidden w-full max-w-full flex-row flex-nowrap items-center justify-center gap-0.5 overflow-x-hidden px-0.5 md:flex sm:gap-1 sm:px-1 md:gap-2 lg:gap-3">
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
      </div>
    </section>
  );
}
