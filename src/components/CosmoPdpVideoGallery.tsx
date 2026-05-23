import { ProductLifestyleGallery } from "@/components/ProductLifestyleGallery";

export const COSMO_LIFESTYLE_GALLERY = [
  {
    src: "/cosmo-pdp/gallery/01.png",
    alt: "Lay-n-Go Cosmo cosmetic bag in a tiled shower niche with toiletries",
  },
  {
    src: "/cosmo-pdp/gallery/02.png",
    alt: "Pink Lay-n-Go Cosmo open flat on a bathroom vanity with makeup inside",
  },
  {
    src: "/cosmo-pdp/gallery/03.png",
    alt: "Pink Lay-n-Go Cosmo hanging from a hook in a tiled bathroom",
  },
  {
    src: "/cosmo-pdp/gallery/04.png",
    alt: "Close-up of pink Lay-n-Go Cosmo bag with Lay-n-Go branding visible",
  },
  {
    src: "/cosmo-pdp/gallery/05.png",
    alt: "Black Lay-n-Go Cosmo open flat on a marble counter with makeup and brushes",
  },
  {
    src: "/cosmo-pdp/gallery/06.png",
    alt: "Group photo around an open black Lay-n-Go Cosmo filled with cosmetics",
  },
] as const;

export function CosmoPdpVideoGallery() {
  return (
    <ProductLifestyleGallery
      slides={COSMO_LIFESTYLE_GALLERY}
      ariaLabel="Cosmo lifestyle photos"
      className="mt-10 sm:mt-12"
    />
  );
}
