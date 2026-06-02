import { PLAY_AWARD_BADGES } from "@/lib/playAwards";
import { cn } from "@/lib/utils";

/** Symmetrical award badge grid for play mat PDPs (between gallery and FAQ). */
export function LayNGoPlayAwardsSection() {
  return (
    <section className="mx-auto mt-14 w-full max-w-5xl sm:mt-16" aria-labelledby="lay-n-go-play-awards-heading">
      <h2
        id="lay-n-go-play-awards-heading"
        className="text-center font-heading text-2xl font-bold uppercase tracking-[0.12em] text-foreground sm:text-3xl"
      >
        OUR AWARDS
      </h2>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:mt-10 sm:gap-8">
        {PLAY_AWARD_BADGES.map((badge) => (
          <li
            key={badge.src}
            className="flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32 md:h-36 md:w-36"
          >
            <img
              src={badge.src}
              alt={badge.alt}
              loading="lazy"
              decoding="async"
              className={cn("max-h-full max-w-full object-contain", badge.imgClassName)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
