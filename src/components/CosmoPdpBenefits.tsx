const ITEMS = [
  {
    src: "/cosmo-pdp/benefit-see-all.png",
    title: "Everything in view",
    caption: "Lay it flat and see every brush, balm, and bauble at once.",
  },
  {
    src: "/cosmo-pdp/benefit-fast.png",
    title: "Pack up in seconds",
    caption: "Cinch the cord and you are out the door—no digging, no dumping.",
  },
  {
    src: "/cosmo-pdp/benefit-washable.png",
    title: "Washable & wipeable",
    caption: "Machine wash when life gets messy; quick wipes in between.",
  },
] as const;

/** Visual benefit strip for Cosmo family PDPs (20″, 22″, Mini). */
export function CosmoPdpBenefits() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {ITEMS.map((item) => (
        <div
          key={item.title}
          className="flex flex-col items-center rounded-2xl border border-border/80 bg-card/60 p-5 text-center shadow-sm backdrop-blur-sm transition-colors hover:border-primary/35 hover:bg-card"
        >
          <div className="mb-4 w-full max-w-[140px] overflow-hidden rounded-2xl border border-border/60 bg-muted/30 shadow-inner">
            <img src={item.src} alt="" className="h-auto w-full object-cover" loading="lazy" />
          </div>
          <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.caption}</p>
        </div>
      ))}
    </div>
  );
}
