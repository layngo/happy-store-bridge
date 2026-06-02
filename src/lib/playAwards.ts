export type PlayAwardBadge = {
  src: string;
  alt: string;
};

const BASE = "/play-awards";

/** Award seals shown on Large, Lifestyle, and Lite play mat PDPs. */
export const PLAY_AWARD_BADGES: readonly PlayAwardBadge[] = [
  { src: `${BASE}/wts-toy-review-5-star.png`, alt: "WTS Toy Review Five Star Certified" },
  { src: `${BASE}/nappa-gold.png`, alt: "NAPPA Gold Winner" },
  { src: `${BASE}/cribsies-winner.png`, alt: "The Cribsie Awards Winner" },
  { src: `${BASE}/moms-choice-gold.png`, alt: "Mom's Choice Awards Honoring Excellence" },
  { src: `${BASE}/creative-child-top-choice-2012.png`, alt: "Creative Child Magazine Top Choice Award" },
  { src: `${BASE}/creative-child-product-of-year-2012.png`, alt: "Creative Child Magazine Product of the Year Award" },
  { src: `${BASE}/red-tricycle-totally-awesome-2012.png`, alt: "Red Tricycle 2012 Totally Awesome Awards Winner" },
  { src: `${BASE}/fat-brain-toy-winner.png`, alt: "Fat Brain Toy Award Winner" },
  { src: `${BASE}/toy-insider-summer.png`, alt: "The Toy Insider Top Summer Toys Award Winner" },
  { src: `${BASE}/parents-choice-recommended.png`, alt: "Parents' Choice Foundation Recommended" },
  { src: `${BASE}/toy-man-excellence-2012.png`, alt: "The Toy Man Award of Excellence" },
];
