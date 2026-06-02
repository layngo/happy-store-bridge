export type PlayAwardBadge = {
  src: string;
  alt: string;
};

const BASE = "/play-awards";
const AWARD_ASSET_V = "4";

/** Award seals shown on Large, Lifestyle, and Lite play mat PDPs. */
const awardSrc = (file: string) => `${BASE}/${file}?v=${AWARD_ASSET_V}`;

export const PLAY_AWARD_BADGES: readonly PlayAwardBadge[] = [
  { src: awardSrc("wts-toy-review-5-star.png"), alt: "WTS Toy Review Five Star Certified" },
  { src: awardSrc("nappa-gold.png"), alt: "NAPPA Gold Winner" },
  { src: awardSrc("cribsies-winner.png"), alt: "The Cribsie Awards Winner" },
  { src: awardSrc("moms-choice-gold.png"), alt: "Mom's Choice Awards Honoring Excellence" },
  { src: awardSrc("creative-child-top-choice-2012.png"), alt: "Creative Child Magazine Top Choice Award" },
  { src: awardSrc("creative-child-product-of-year-2012.png"), alt: "Creative Child Magazine Product of the Year Award" },
  { src: awardSrc("red-tricycle-totally-awesome-2012.png"), alt: "Red Tricycle 2012 Totally Awesome Awards Winner" },
  { src: awardSrc("fat-brain-toy-winner.png"), alt: "Fat Brain Toy Award Winner" },
  { src: awardSrc("toy-insider-summer.png"), alt: "The Toy Insider Top Summer Toys Award Winner" },
  { src: awardSrc("parents-choice-recommended.png"), alt: "Parents' Choice Foundation Recommended" },
  { src: awardSrc("toy-man-excellence-2012.png"), alt: "The Toy Man Award of Excellence" },
];
