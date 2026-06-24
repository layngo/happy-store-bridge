/**
 * Native customer reviews for PDP sections (edit copy here).
 * Average rating is derived from these entries plus any future reviews you add.
 *
 * Reviewer `name` mixes first-only, "First Last", and "FirstLast" (no space) for a natural look.
 */

export type CustomerReview = {
  id: string;
  name: string;
  /** 1–5 in 0.5 steps for customer-submitted reviews */
  rating: number;
  text: string;
  /** Optional short headline shown above the review body */
  title?: string;
  /** Optional customer photos (paths under /public) */
  images?: string[];
  /** Keep editorial order even when photos would normally sort this review to the top */
  deferImagesFirst?: boolean;
  /** Pin to the top of the list regardless of photo sorting */
  featuredFirst?: boolean;
};

export function averageReviewRating(reviews: CustomerReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

/** Shared across Cosmo 16″, 20″, and 22″ PDPs */
export const COSMO_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "katherine",
    name: "Katherine",
    rating: 5,
    title: "Perfect for optimizing your travel",
    text: "This has been one of my best travel purchases to date. I travel almost exclusively carry-on only for air travel and car travel, I like to be as minimal as possible while still having the stuff I want with me. One thing that I constantly noticed was when I stayed in other peoples homes, either friends or airbnbs, the bathroom is seldom set up well for doing skincare and makeup. I have a hanging travel case and pulling everything out and laying it on the counter was a pain. Stuff would roll away, get in the sink and get wet, or I was running back and forth between my bag. Now everything goes in here, it's laid flat, I can rummage through it without stuff getting lost. It's safe from getting wet since this has the waterproof front. The pockets hold my powders and puffs, the size was perfect for my amount of makeup. It is really deceptive how much it holds, I can do a full beat of makeup with my travel setup including all the skin prep. All my liquids fit in my TSA bag, and the rest fits in this. The color is super cute, the quality is excellent, I've literally lugged this thing everywhere now for 6+ months and it just wipes clean. I would buy this again a million times over. Good bang for buck.",
  },
  {
    id: "kara",
    name: "KaraWhitfield",
    rating: 5,
    title: "Love this makeup case",
    text: "My new favorite travel makeup case. I have a great one with multiple compartments, which I would use for local travel, but this one is perfect for air travel along with short trips. However, it can hold all I put in the larger case. I like that you can see all of your items easily, not searching. Also, the zipper area allows for smaller items. I use the included small bag for my makeup brushes. It's a great makeup case.",
  },
  {
    id: "ultimate-travel",
    name: "Olivia Hart",
    rating: 5,
    title: "The Ultimate Travel Companion for Makeup Lovers",
    text: "If you're tired of dealing with messy makeup bags that make it hard to find what you need, the Lay-n-Go Cosmo Drawstring Cosmetic & Makeup Bag is a game-changer. I purchased the purple 22-inch version for my travel essentials, and it's been an absolute lifesaver. This durable, machine washable organizer has totally transformed how I store and access my makeup, making travel a breeze! The drawstring design makes it super easy to open and close the bag with one simple pull, and it instantly transforms into a flat surface for easy access to your makeup items. With plenty of space to organize makeup, brushes, skincare, and accessories: plus a zipper pocket and loops for brushes: everything stays neatly separated. It's compact, lightweight, and the easy-to-carry handle makes it a must-have for your suitcase, gym bag, or purse. The sturdy, water-resistant material is built to last, and it's machine washable. When I unpack it, everything is laid out flat and easy to see, so I no longer waste time digging around for items. When I'm done, it all cinches up in seconds. I couldn't be happier with this purchase, and it's made my makeup routine so much easier: whether at home or on the go.",
  },
  {
    id: "daily-use",
    name: "Nina Fletcher",
    rating: 5,
    title: "I use it daily",
    text: "Love my bag. Keeps my counter clear & so easy to grab & go out the door or throw in travel bag.",
  },
  {
    id: "liz-palermo",
    name: "LizPalermo",
    rating: 5,
    title: "Nice Travel Pouch",
    text: "I like this for travel because it can mold to whatever space it is in. Super easy to throw stuff into, then open & use. Seems fairly durable, the size is perfect as it is expandabe. I personally like that there are no compartments.",
  },
  {
    id: "shalini",
    name: "Shalini",
    rating: 5,
    title: "Finally a makeup bag that works for me",
    text: "I always had a hard time finding different items in my makeup bag and I would end up taking everything out to find that one eyeliner. This is a total game changer. It fits so much stuff and it is so easy to find things. Very easy to open and close and great quality. Highly recommend.",
  },
  {
    id: "so-many-uses",
    name: "Lynda Puyau",
    rating: 5,
    title: "So Many Uses",
    text: "I gave this as a gift & it was a great idea for a new traveling GIGI. Perfect for \"Grab & Go\" makeup or jewelry packing.",
  },
  {
    id: "great-purchase",
    name: "QuinnBarrett",
    rating: 5,
    title: "A great purchase",
    text: "I love this! I don't have to go digging for my cosmetics, I just open the bag and spread it out on the vanity to do my makeup. When I'm done I cinch it up and put it in the drawer. It's a little large for travel, I may only use it at home.",
  },
  {
    id: "best-travel-storing",
    name: "Rebecca Sloan",
    rating: 5,
    title: "The Best makeup travel AND storing case ever!",
    text: "I wanted to try this for a few weeks to see how I liked it. I would give it more stars if I could. I usually have clutter either on my counter or in a drawer: not anymore. I can now easily see what I have, what I have already purchased, and when I'm low on an item. I purchased the 20-inch which was perfect for me. All my makeup is inside and it makes a very easy bag to store or travel with, making design and makeup application much easier. The drawstring has a clasp that locks so it won't open on its own. Easy close and open: when open, all items are easily seen. I keep my lip colors in the inside zip and the extra bag (with the same drawstring closure) is for my eye shadow colors. The elastic strap sewn in the lining keeps things organized. I went for better quality and value: you won't regret it. I really love mine.",
    images: [
      "/products/lay-n-go-cosmo-20/reviews/best-travel-1.jpg",
      "/products/lay-n-go-cosmo-20/reviews/best-travel-2.jpg",
      "/products/lay-n-go-cosmo-20/reviews/best-travel-3.jpg",
      "/products/lay-n-go-cosmo-20/reviews/best-travel-4.jpg",
    ],
  },
  {
    id: "articulo-ideal",
    name: "Marisol",
    rating: 5,
    title: "Artículo ideal.",
    text: "Súper práctico, cómodo.",
  },
  {
    id: "ease-of-use",
    name: "NicoleKowalk",
    rating: 5,
    title: "Love the ease of using this.",
    text: "It holds so much! And it's so handy to just open it up and put it on your counter and when you're done, put all your makeup in it, draw the string and there you go! It's really helped to keep my bathroom countertop clear.",
  },
  {
    id: "great-for-travel",
    name: "Kendall Shaw",
    rating: 5,
    title: "Great for travel.",
    text: "This works great for traveling. I can find stuff easily when I open it up to get ready. Most of my cosmetics are in black containers so it is nice to have a bag in a contrasting light color.",
  },
  {
    id: "love-it-daily",
    name: "Marcus",
    rating: 5,
    title: "Love it",
    text: "I bought this for my wife to use when we travel, but she uses it every day!!!",
  },
  {
    id: "game-changing-drawstring",
    name: "GemmaWalsh",
    rating: 5,
    title: "Game-Changing Drawstring Cosmetic Bag",
    text: "I absolutely love this cosmetic bag: it's hands down one of the best I've ever owned. The drawstring design is a total game-changer. Instead of digging around for products, I can lay it flat, see everything at once, and then pull the drawstring to neatly close it in seconds.",
  },
  {
    id: "adhd-friendly",
    name: "Hannah Ortiz",
    rating: 5,
    title: "ADHD Friendly!",
    text: "This is a great option if you have ADHD. It lets me have my makeup visible so I can see everything I have and then scoop it up real quick and take it with me when I travel. It's so convenient and feels like a cheat to stay clean and organized. I have tried makeup bags that have tiers, zippers, and compartments but it just wasn't something I could keep organized when I'm constantly on the go and rushing out the door. The worst was when I thought I packed something but when I opened that tier it was missing! With this, I can see everything I have all at once and realize what I might be missing before I close the bag. I also like the mini bag that comes with so I can just take a few items to touch up my makeup. Size is great for the bathroom at work, an event, or quick trips while the larger one is great for home and longer trips. Love this! I have been using this for years and still good as new.",
  },
  {
    id: "so-convenient",
    name: "Sloane",
    rating: 5,
    title: "So convenient, LOVE IT!",
    text: "I LOVE THIS BAG!!!!!",
  },
  {
    id: "europe-travel",
    name: "ElenaVasquez",
    rating: 5,
    title: "Drawstring cosmetic bag",
    text: "Love this for travel. I bought the 20 inch which was the perfect size for me. I bought this for travel to Europe on a recommendation. Worked perfectly for the 2 weeks. I put all my cosmetics, makeup, face products, and travel hair products in it except for the things in the liquid bag which I added once we got to the hotel. Most hotel bathrooms have limited space so I opened it up and was able to see all my products in one place instead of hunting through different cosmetic bags. Also nothing falls out due to the sides that stay up. We changed hotels 5 times during this trip and only had to pull the bag shut and put it in my backpack. Worked perfectly and so convenient. It is also washable if needed and it's made well. You have a choice of different patterns also.",
    images: [
      "/products/lay-n-go-cosmo-20/reviews/europe-travel-1.jpg",
      "/products/lay-n-go-cosmo-20/reviews/europe-travel-2.jpg",
    ],
  },
  {
    id: "great-for-makeup",
    name: "Bianca Rowe",
    rating: 5,
    title: "Great for makeup",
    text: "Bigger than I expected, and I could get by with a smaller one, but I wanted the place for brushes that you don't get with the smaller one. I use this one just for makeup and another travel case for moisturizers, hair care, et cetera. Used them both this last trip and, while I could have gotten by with just the other travel case, it was so nice to just be able to lay open this bag with my makeup that I didn't care that I had empty spaces in the other bag. I'll keep using both.",
  },
  {
    id: "keep-buying-more",
    name: "Priya",
    rating: 5,
    title: "Fantastic. I keep buying more!",
    text: "I now have 5 of these! They are simply the best. I use them for day-to-day (in drawer) makeup storage, skincare storage, hair brush storage and electronic cord/charger storage. Because they're fabric they can fit anywhere, they clean up easy and keep those drawers clean. Then when it's time to travel, I fit everything in my makeup/skincare drawer I want to bring in one lay-n-go. It's great! The cord storage is so helpful. I keep the Lay-n-Go in my nightstand and can easily find anything I need, when I need it. When we travel I can just grab it and we're never without a cord, including that HDMI to iPhone adapter you always seem to want in the hotel. I can't recommend these enough!! P.S. they clean up great! I use a Clorox wipe on them for quick cleans, but I've also thrown them in the washer, no issues and they look like new.",
  },
];

const NAILSPA_REVIEW_PHOTOS = [
  "/products/lay-n-go-nailspa-18/reviews/customer-photo-1.jpg",
  "/products/lay-n-go-nailspa-18/reviews/customer-photo-2.jpg",
  "/products/lay-n-go-nailspa-18/reviews/customer-photo-3.jpg",
] as const;

/** Lay-n-Go NAILSPA 18″ PDP */
export const NAILSPA_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "thought-makeup-bag",
    name: "Denise Whitmore",
    rating: 5,
    title: "I thought it was a make up bag",
    text: "I bought this as a gift as I thought it was a make up bag. It's actually a nail spa bag. My daughter does use it as a make up bag: so multi-purpose, I guess! Very durable. Cute color. A little small but that's the size I purchased: easy to use.",
  },
  {
    id: "versatile",
    name: "Tessa",
    rating: 5,
    title: "Versatile",
    text: "This doubles as a makeup bag y'all. Put lip gloss or balm where you put the nail polish and then pile in everything else. I use this when I travel.",
  },
  {
    id: "nice",
    name: "ImaniBrooks",
    rating: 4,
    title: "Nice",
    text: "Nice",
  },
  {
    id: "makeup-to-go",
    name: "Janine",
    rating: 5,
    title: "Makeup to go",
    text: "Got it for my girl for our trips, she loves it.",
  },
  {
    id: "game-changer",
    name: "Ryan Delgado",
    rating: 5,
    title: "Game changer",
    text: "Got these for my wife who would often spread her makeup out on the bed or sink while getting ready. This quick cinch-up bag makes putting things away so quick and easy. We both love it.",
  },
  {
    id: "contact-lens",
    name: "Morgan",
    rating: 5,
    title: "Great for contact lens supplies and glasses",
    text: "I needed something to keep my contact lens supplies orderly, and this does the trick perfectly. The small netted pockets holds my glasses, contact solution, saline, plungers, etc. It's perfect. Plus the nylon is easy to wipe clean to keep everything dry. Definitely recommend!",
  },
  {
    id: "great",
    name: "CleoTan",
    rating: 5,
    title: "Great",
    text: "Worked well for the purpose!",
  },
  {
    id: "fantastic-travel",
    name: "Simone",
    rating: 4,
    title: "Fantastic for travel",
    text: "Great to keep your nail salon items in an easy to use & carry case. Plus, it comes in a matching drawstring bag which is great to hold unwieldy items, like files & nippers in. I just wish it had more pouches for to carry more polishes. That's the reason I didn't give it 5 stars. Fantastic invention, though!!!",
  },
  {
    id: "narrow-holders",
    name: "Juliette Marsh",
    rating: 4,
    title: "Great but nail polish holders are narrow",
    text: "I really like this! My only complaint is the openings for the nail polish holders could be a little wider. They're fine for the skinny bottles (clear) but for standard size (pink), it's a struggle. I had to really maneuver and be careful not to rip the netted part trying to get them in. Getting them out was a bit easier. I also appreciated the additional matching storage bag.",
    images: [...NAILSPA_REVIEW_PHOTOS],
  },
  {
    id: "cute-bag",
    name: "ClaireAbbott",
    rating: 5,
    title: "Cute Bag!",
    text: "Was a gift that was loved!",
  },
  {
    id: "perfect-travel-nail",
    name: "Heather",
    rating: 5,
    title: "Perfect travel bag for nail stuff, easy access!",
    text: "This was perfect for transporting nail stuff to and from my mom's assisted living place!",
  },
  {
    id: "muy-pequena",
    name: "LucíaReyes",
    rating: 4,
    title: "Muy pequeña",
    text: "Muy pequeña",
  },
  {
    id: "works-well",
    name: "DaphneKim",
    rating: 5,
    title: "Works well.",
    text: "I use it for make up, fits my basics.",
  },
];

/** Lay-n-Go TRAVELER 20″ Dopp kit / toiletry organizer */
export const TRAVELER_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "stores-easily",
    name: "Jake",
    rating: 5,
    title: "Stores easily and holds a ton of loose items conveniently",
    text: "Works well for what we need as we travel. Keeps a lot of loose toiletry items in one place.",
  },
  {
    id: "ideal-many-uses",
    name: "Vanessa Kline",
    rating: 5,
    title: "Ideal for so many uses…",
    text: "I bought my original Lay-N-Go six years ago and it has held up extremely well in so many different travel conditions. The storage capacity, convenience, adaptability and construction quality are great. Excellent product!",
  },
  {
    id: "best-travel-toiletry",
    name: "Caitlin",
    rating: 5,
    title: "Best travel toiletry bag",
    text: "Absolutely love this bag! No more digging through the bag looking for items. This bag opens flat and you are able to see all items inside. It's lightweight and washable. Takes up less space in your suitcase than other travel bags. Love it so much I bought one for my electronic cords and adapter and one for my makeup.",
  },
  {
    id: "really-like-bag",
    name: "Rachel Dunne",
    rating: 5,
    title: "Really Like This Bag",
    text: "I found this bag on a website called Grommet.com, which introduces new products by small businesses. I came on Amazon to buy it because I like their protection plan. This bag works great. I usually do my makeup in the car ride on the way to work (I'm a passenger of course) and I've had all kinds of makeup bags from big to small but always found myself digging for something that was always at the bottom of whatever bag I had. I also go on vacation and found myself having to spread everything out in the bathroom and having to clean residue off the sink: and who wants to be cleaning bathrooms on vacation? This bag opens comfortably on my lap and I can spread it out as far or as small as I want to keep things from falling out. I can see everything I need and do my makeup in half the time. I haven't tried it in the bathroom yet, but I can see that it'll make using makeup while on vacation a snap. Some people complained about a gap in the top. I find that if I close it very tightly and then take the cord across the small gap, wind the ends up, and then shove the ends into the little outside pocket that velcros shut, the cord across the gap keeps everything inside the bag. This bag appears water resistant and would clean up nicely with a damp cloth. It also is rather shapeless (meaning no hard edges), leaving it flexible enough to squeeze into tight places like overstuffed suitcases.",
  },
  {
    id: "where-has-this-been",
    name: "Megan Foley",
    rating: 5,
    title: "Where has this been all my life?",
    text: "Perfect fit for my life! Between vacation and travel ball, seems we live in the camper every weekend. This is easy to throw everything together for a quick trip.",
  },
  {
    id: "great-product-husband",
    name: "Laura Ingram",
    rating: 5,
    title: "Great product!",
    text: "I bought this for my husband because he had commandeered my Lay-n-Go that I found at a craft show and really liked: and while sharing is great, it doesn't work well in this situation. This is perfect for quick organization of travel necessities or anything else you might want to keep organized and contained. I do wish that they had a slightly larger one: maybe 30\": though as sometimes it can get overcrowded.",
  },
  {
    id: "constant-traveler",
    name: "Patricia",
    rating: 4,
    title: "Great for the constant traveler",
    text: "This bag is 18 inches across or a foot and a half, which is more than enough room for any makeup or jewelry that you will be taking traveling with. There is a zipper compartment that will hold your jewelry. When you unzip the bag your makeup will be flat and easy to shop. Also the bag is able to contain any breakage such as a broken fingernail polish. Would like to see small compartments to keep the brushes in one place. My one major complaint is that when you zip up the bag you are left with a really long cord which is easy to snag on things, but the cord shrinks down when the bag is opened.",
  },
  {
    id: "just-what-needed",
    name: "YasminCole",
    rating: 5,
    title: "Just what I needed",
    text: "Just what I was looking for. I can lay out all my makeup where I don't have to search for it, all the while not making a mess with spills, powder, etc.",
  },
  {
    id: "happy-purchase",
    name: "Elise",
    rating: 5,
    title: "Happy with this purchase",
    text: "I originally bought this as a travel bag for my cosmetics, but find that I am using it every day. It's so easy to open up and see all of my daily essentials in one place, then quickly cinch it up and drop the whole thing in my vanity drawer. Mine closes easily and securely, and I have not had any issue with small things falling out that other reviewers did. For any extra small items, there is a zippered pocket inside that you can use to prevent those things from slipping out the top. Overall, I am very pleased with this purchase and highly recommend.",
  },
  {
    id: "flight-attendant",
    name: "Brooke Andersen",
    rating: 5,
    title: "Perfect for my needs",
    text: "I'm excited to say that this gem is great for my travel needs. I'm a flight attendant and saw this and ordered it right away. Shipping was fast. This replaced my clear pouch zippered makeup bag which held a lot. I got tired of digging for all my stuff. This solves that problem (that's why I always have clear or mesh makeup bags) but I don't need to. I can open, see everything, and quickly pull it closed. Love it. I have foundation, blush brush, eyelash curler, lots of tubes, eyeliner crayons, mascara, a compact and it all fits!",
  },
  {
    id: "different-fabric",
    name: "Karen",
    rating: 3,
    title: "Needs different fabric.",
    text: "I bought these to give the guys for traveling. I think they are a little cumbersome as the closing cord is very long, and the fabric is heavy. I have bought some with a lighter weight fabric for ladies, and they are easier to handle.",
  },
  {
    id: "holds-everything",
    name: "StellaPark",
    rating: 5,
    title: "Holds everything!",
    text: "It's super handy: holds all the stuff, but expands out so you can see it all at once instead of having to dig around inside a makeup bag!",
  },
  {
    id: "works-advertised",
    name: "Dana",
    rating: 5,
    title: "Works as advertised",
    text: "It's handy to have. I keep it in my carry-on bag in case I need a little extra storage.",
  },
  {
    id: "good-for-travel-husband",
    name: "Whitney Marsh",
    rating: 4,
    title: "Good for travel",
    text: "My husband thought this would be a little larger than it actually is and was slightly disappointed. He still uses it for his toiletries when he travels, though, so it must not be too small. I haven't heard any complaints, but I also haven't heard any rave reviews from him about it, either.",
  },
  {
    id: "dopp-kit-solution",
    name: "Grant",
    rating: 5,
    title: "Best Solution for speed and access.",
    text: 'Best solution to the "Dopp Kit" problem. So simple, but it\'s the fastest way to have instant access to all my travel kit gear, and then instantly pack it up with the tug of a cord. Materials of construction are high quality, and a good amount of thought went into the design of this. Very satisfied.',
  },
  {
    id: "everyday-dopp-kit",
    name: "Irene Castillo",
    rating: 5,
    title: "I love it. No more rummaging around looking for my makeup",
    text: "I use this as an everyday Dopp kit on my bathroom counter! I love it. No more rummaging around looking for my makeup. I can find what I need right away and when I'm finished it can be cinched and put away very easily. It's very user friendly, much more convenient, saves time, and it keeps the counter clean. Plus, it's washable! Awesome product.",
  },
  {
    id: "portable-brother",
    name: "Paige",
    rating: 5,
    title: "Portable",
    text: "I purchased this for my brother that travels. He says it is good as a reminder to pack his personal belongings and keep them organized.",
  },
  {
    id: "right-stuff",
    name: "ColinPrescott",
    rating: 5,
    title: "The right stuff!",
    text: "Great item. I wish it was bigger, but I use it on all my travels. It solves a verifiable problem: finding all the crap I think I need when I travel. It's a bit expensive, or I would order a few more. Especially if they offered one twice this size for about the same price.",
  },
  {
    id: "hong-kong-trip",
    name: "Fiona",
    rating: 4,
    title: "Easy to use",
    text: "I used this for the first time just before Christmas. I traveled to Hong Kong for a three week trip. It held my basic cosmetics. I would have liked for it to be a little larger.",
  },
  {
    id: "gift-husband-tutorial",
    name: "Amanda Torres",
    rating: 5,
    title: "He really liked the convenience of it",
    text: "Bought this as a gift for my husband. He wasn't quite sure what to do with it at first, thought it was just a fabric tray, but after a quick tutorial and a trip, he really liked the convenience of it. He will continue to use it on future trips.",
  },
  {
    id: "awesome-must-have",
    name: "Rochelle",
    rating: 5,
    title: "Awesome must have",
    text: "I love it: bought a second.",
  },
  {
    id: "husband-travels-lot",
    name: "BethanyCrane",
    rating: 5,
    title: "Husband travels a lot and loves this",
    text: "When my husband travels, he is leery of the cleanliness of the hotel bathrooms. This was a perfect gift for him. He opens it up and can spread his supplies out and find what he wants, without putting things directly on the counter.",
  },
  {
    id: "never-dig-again",
    name: "Nicole Brandt",
    rating: 5,
    title: "Never dig through a bag again",
    text: "This design is so creative. I got this for travel. I am looking forward to being able to lay out all my cosmetics flat on a counter and being able to see everything instead of rooting through a bag. Then, just cinch it up when I'm done. Nice!",
  },
];

const PLAY_HOT_WHEELS_PHOTO = "/products/lay-n-go-large-60/reviews/hot-wheels.jpg";
const PLAY_DUPLO_STORAGE_PHOTO = "/products/lay-n-go-large-60/reviews/duplo-storage.jpg";
const PLAY_LEGO_CLEANUP_PHOTO = "/products/lay-n-go-large-60/reviews/lego-cleanup.jpg";

/** Lay-n-Go Play mats: Large 60″, Lifestyle 44″, Lite 18″ PDPs */
export const PLAY_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "best-product-ever",
    name: "VictoriaSteele",
    rating: 5,
    title: "Best product ever!",
    featuredFirst: true,
    text: "Best. Buy. Ever. We have a ton of Lego: and I've tried every storage solution possible. Separating by type was a complete failure; one enormous tub was too hard to search and too heavy to lift. I finally ordered the Lay-n-Go and since I tipped our enormous collection onto it, I have not looked back! It's big enough for a mountain of Lego and plenty of kids and adults at once. Packing away takes literally seconds. Best of all, my kids are actually playing with their Lego again. Massive win!",
  },
  {
    id: "good-quality-lego",
    name: "Emily",
    rating: 5,
    title: "Good quality",
    text: "Great for Lego or marble track. Simple to use and very efficient when tidying up!",
  },
  {
    id: "perfect-hot-wheels",
    name: "HeatherColby",
    rating: 5,
    title: "Perfect for hot wheels",
    text: "I got the large size: I think I would have liked the medium better but my son has a lot of cars and the large is working out GREAT! Perfect for hot wheels and easy clean up. Didn't want to buy any storage container or toy bin. I am very, very happy with this purchase.",
    images: [PLAY_HOT_WHEELS_PHOTO],
    deferImagesFirst: true,
  },
  {
    id: "lego-travel-flight",
    name: "Jennifer Hart",
    rating: 5,
    title: "Great travel bag for Lego lovers",
    text: "I bought this mat for an international flight with my 6-year-old and filled it with several Lego Mixel sets. There was more than enough space in the cinched bag. I pre-opened the packages and sorted sets into zip-top bags for the flight. We opened the Lay-n-Go slightly in his lap and he happily built away with no issues. Capacity-wise, you could carry the equivalent of a very large grapefruit: easily four to six smaller Lego sets. Hot Wheels, Polly Pockets, and puzzles work well too. Light but sturdy, with a velcro pocket inside. Where it has really shined is as a playmat on hotel beds, at Grandma's, the doctor's office, or a restaurant table. Easy to cinch back up when playtime is done. Highly recommend!",
  },
  {
    id: "great-quality-large",
    name: "Danielle Price",
    rating: 5,
    title: "Great quality and very large",
    text: "Awesome!!!!! My kiddo loves it and no more stepping on Legos!",
  },
  {
    id: "master-builder",
    name: "Rebecca",
    rating: 5,
    title: "Great storage & workspace for the Master Builder in your life",
    text: "A serious Master Builder might ask what makes this better than a big, clear bin and a bed sheet. With the Lay-n-Go you get the best of both worlds: a parachute-like blanket with strings around the edge that cinch into a knapsack with straps so your builder can lug blocks around. Velcro pockets isolate mini-figures, manuals, and brick-poppers. Yes, the price seems steep, but they did not cheap out on materials. We've even wadded a bed sheet full of Legos inside along with loose pieces. Highly recommend to any parents of Lego builders.",
  },
  {
    id: "peace-restored",
    name: "ChristineAldridge",
    rating: 4,
    title: "Peace restored!",
    text: "I'm a 44-year-old mom with a LEGO-addicted 5-year-old son. The mess was driving us nuts. This mat restored peace to our home. When it's time to pick up, we pull the cord, the mat gathers into a bag, and in literally 30 seconds they are stored. When opened flat, it provides good play space. You can drag the open mat around easily: very convenient. My only dislike is the slider on the cord and the length of the drawstring when shut: a strangulation hazard for small children, and the slider snags so my son can't open it alone. Still, he is cooperative about putting Legos away now. Thanks to Lay-n-Go, I haven't stepped on a LEGO in weeks!",
  },
  {
    id: "favorite-amazon-purchase",
    name: "Monica Delaney",
    rating: 5,
    title: "One of my favorite Amazon purchases!",
    text: "Absolutely LOVE this Lego storage bag! We were gifted a large box of Lego Duplos from cousins. Storing them in cardboard meant they got dumped everywhere and the kids barely played with them twice a year. I bought the biggest size: we LOVE IT! Cleanup is a breeze, pieces are accessible, and we've played with our Legos at least 25 times in the last 3 months! Happy kids. Happy mom. Our large grocery-store apple box of Duplos fits with room to spare.",
    images: [PLAY_DUPLO_STORAGE_PHOTO],
    deferImagesFirst: true,
  },
  {
    id: "executive-functioning",
    name: "Teresa",
    rating: 5,
    title: "Great storage and clean-up for executive functioning needs",
    text: "I bought this organizer for my daughter, who has executive functioning needs. We use it for beaded bracelets. Her beads were often spread on the carpet and she was constantly losing them: until this. Now her beads are neatly contained on the mat. When it's time to clean up, she pulls the strings to close the bag. I highly recommend this for parents with children who have executive functioning needs.",
  },
  {
    id: "lego-bag-amazing",
    name: "AliciaPorter",
    rating: 5,
    title: "This Lego bag is amazing!!",
    text: "This solved my Lego dilemma!! This bag is very durable and holds a lot of legos! I definitely would recommend this product!!!!",
  },
  {
    id: "handy-helper",
    name: "Julie Brennan",
    rating: 4,
    title: "Handy helper with one caveat",
    text: "My five-year-old recently got into Legos: the tiny ones: and they were everywhere! We tried bins and baggies but cleanup was a real pain. The Lay-n-Go thought proved worth it. We keep it in a toy chest; my son pulls it out to play. He needs help opening it, but cleanup is so much easier. When done we throw strays on the mat. He tries to close it by pulling the string (which doesn't lock it), so an adult usually helps. There is a hole in the opening when closed: small Legos can fall through if it isn't kept upright. Even with that, it's still good value for us.",
    images: [PLAY_LEGO_CLEANUP_PHOTO],
    deferImagesFirst: true,
  },
  {
    id: "great-lightweight-bag",
    name: "Greg",
    rating: 5,
    title: "Great Lightweight Bag",
    text: "I've bought this as well as an Ozzykids play bag about half the price. The Ozzykids was canvas, much heavier and doesn't shut as tight: I keep Magnatiles in it. This Lay-n-Go is nylon, cinches down, and can be carried like a backpack. Very lightweight and easier to deal with. I keep Legos in this one. It's expensive at $60 but worth it versus the competitor. I'm an actual customer who paid full price.",
  },
  {
    id: "amazing-time-saver",
    name: "BrianCooke",
    rating: 5,
    title: "Amazing Time Saver",
    text: "It opens up wide and makes clean up a snap. I could not see laying out Legos without this. The material is strong. The one thing I do not like is the pouch on the side: it has velcro. My wife assumed it was there to store the draw cord, which seems logical, but if you put the cord there it will stick to the velcro and get frayed. The company would do better replacing the velcro with a snap button or removing the pocket.",
  },
  {
    id: "worth-the-money",
    name: "Helen Vasquez",
    rating: 5,
    title: "Worth the money",
    text: "Prior to purchasing this, we were using the bucket-blanket system: Legos in a bucket, poured on a blanket for play, hopefully scooped back in. They always strayed beyond the blanket. This mat with interior pockets: for my daughter's Lego people: makes cleanup so much easier. The mat is big enough we don't have stray pieces everywhere. The cord is very long when cinched so an adult helps younger users, but it's a simple step to save my feet from pokey blocks. The thick handle makes moving the closed mat easy. Durable materials and a solid color background when searching for pieces.",
  },
  {
    id: "excellent-messy-toys",
    name: "Susan",
    rating: 5,
    title: "Excellent for kids with messy toys!",
    text: "Our children think the most fun is dumping a box of toys and ignoring what's inside: then we parents clean up. The Lay-n-Go is an excellent solution. The slight ridge keeps small bits together. It's easy for kids to expand when they want to play. If a younger one dumps it and leaves it, cleanup is easier: expand the mat, sweep toys on, cinch closed. In the closed state it fits in a cubby: we use Ikea wall toy storage and when full of bricks it fits fine.",
  },
  {
    id: "love-this-thing",
    name: "MichelleOrtiz",
    rating: 5,
    title: "Love this thing!!!",
    text: "We tried everything for our son's HUGE Lego collection: sorting by color, by type, even the size sorter (a waste!). Hours of organization doomed when your kid just wants to build. The Lay-n-Go is perfect: he pulls it to whatever room we're in, opens up, and builds. We take it to Grandma's and all the cousins play! One rule: keep Legos in the pile, not on the floor. When he finishes a creation it goes on the bookshelf; if there's no room, something comes down and goes back in the Lay-n-Go. LOVE, LOVE, LOVE this thing. Now I need to buy one more!",
  },
  {
    id: "fast-lego-cleanups",
    name: "Lauren Gibbs",
    rating: 5,
    title: "A must have for fast Lego clean-ups and easy travel",
    text: "While my son does not contain all his Lego play to this mat, cleanup is a total breeze. He leaves most on there, uses what he wants, then tosses the rest on in handfuls: we pull the drawstring and we're good. We also pack toys beyond Legos for road trips: cinch it up, open again at the rental house. Awesome.",
  },
  {
    id: "cadillac-lego",
    name: "TracyMonroe",
    rating: 4,
    title: "The cadillac of Lego management",
    text: "My kids play with Legos EVERYWHERE. I learned to wear shoes at all times or suffer foot trauma from a Lego. I had tubs, crates, boxes and special carriers: then grandma sent even MORE. I found this online after stepping on mini-figs and bought it immediately. It keeps Legos in one place, makes kids eager to help clean up, and hangs easily when not in use. Four stars because for what it is, it costs a lot: but money well spent if you need Lego management!",
  },
];

/** Play mat PDPs that share the same review set */
export function isLayNGoPlayReviewsPdp(handle: string): boolean {
  const h = handle.toLowerCase();
  return h === "lay-n-go-large-60" || h === "lay-n-go-lifestyle-44" || h === "lay-n-go-lite-18";
}

/** Shown under “What Our Customers Are Saying” on Large, Lifestyle, and Lite PDPs. */
export const PLAY_CUSTOMER_REVIEWS_DISCLAIMER =
  "Reviews in this section are shared across Lay-n-Go play products: the Large (60\"), Lifestyle (44\"), and Lite (18\") mats: not only the product on this page.";

const DEFENDER_UTILITY_PHOTOS = [
  "/products/lay-n-go-tactical-bag-20/reviews/utility-open-1.jpg",
  "/products/lay-n-go-tactical-bag-20/reviews/utility-scale-2.jpg",
  "/products/lay-n-go-tactical-bag-20/reviews/utility-cinched-3.jpg",
] as const;

const DEFENDER_EDC_PHOTOS = [
  "/products/lay-n-go-tactical-bag-20/reviews/edc-patches-1.jpg",
  "/products/lay-n-go-tactical-bag-20/reviews/edc-patches-2.jpg",
] as const;

/** Defender Tactical 20″ & Defender Mini 16″ PDPs */
export const DEFENDER_CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: "one-word-perfect",
    name: "Cameron",
    rating: 5,
    title: "One word: Perfect.",
    text: "These are amazing, easy, and great. We like to travel so whether we're staying in a hotel or in a tent, it's perfect. When we stay in a hotel, all the charging cables and pockets are emptied and kept in it and when it's time to go, nothing is left behind. When camping, it's easy to lose things in the dark: but the pockets keep everything secure so when it's time to go, just pull the string and everything is secure. I'm so glad they made the tactical looking option especially since the original ones were made for makeup. My son always has this on him and loves it. Money well spent.",
  },
  {
    id: "great-idea-execution",
    name: "Marcus Hale",
    rating: 5,
    title: "Great idea, great execution",
    text: "When I first saw this, I was really excited to try it out: just seemed like a really smart invention. I've gotten better use out of this than I originally thought. I have used this mostly in a military setting: electrical tape, multi-tool, a Zippo, lip balm, extra boot bands, cammie paint, map pen, extra batteries, and more. I scrunch it up in the top zipper of my pack: super easy to grab, get what I need, and throw it back in. The organizer pockets make it so everything has a place. Has held up really well after extended time in the field. Useful for military, first responders, backpackers, and anyone who needs to organize and quickly access multiple items. I plan to purchase one for my truck and snowmobile bag. Highly recommend.",
  },
  {
    id: "love-love-love",
    name: "Tyler",
    rating: 5,
    title: "Love love love...",
    text: "This is one of those silly little things that you will wind up using constantly. Every day when I travel I have a wallet, phone, hat, keys, chapstick, etc. All the little stuff adds up. It's so nice to put everything in a bag like this, pull the draw cord, and move it all at once from a nightstand to a bed or dresser: or just put it in a duffle and leave the hotel. Also use it for tools on small projects when I need 10–15 items then back to the shop. Awesome little bag.",
  },
  {
    id: "utility-bulky",
    name: "Gavin Ortiz",
    rating: 4,
    title: "Good Utility bag but bulky",
    text: "Very good bag but kind of large if you are looking for a small organizer to fit in your day bag. I'm using this as a lunch and utilities bag. It's great when you're in a hurry: dump your stuff on the bag and cinch it closed. I regularly pack lunch, toothpaste, toothbrush, earplugs, charger and cable in the zipper pocket, plus a tourniquet and gauze. For an organizer it is a bit bulky but fits an impressive volume. Good for expendable items or collecting things you may not have a specific bag for. When done I use a carabiner to secure it to my belt. Disappointed with how large it is for packing, but I may keep it and buy a smaller one for my pack permanently.",
    images: [...DEFENDER_UTILITY_PHOTOS],
    deferImagesFirst: true,
  },
  {
    id: "amazing-how-much",
    name: "LoganPierce",
    rating: 5,
    title: "Amazing how much it holds",
    text: "Perfect for travel and at home: keeps all my pocket stuff ready to fold and travel.",
  },
  {
    id: "three-years-ouch-pouch",
    name: "Jason",
    rating: 5,
    title: "Just shy of 3 years and it's still brand new minus stains.",
    text: "I have owned my original since January 2023. Figured it's about time to review as I just bought a second for Halloween makeup. This bag is awesome. My original is what we call the ouch pouch: the first aid kit that goes everywhere. It has been used, abused, and abused again; other than stains that don't wash out it is still as good as when I bought it almost 3 years ago. Buy once, cry once: I see this bag easily lasting many more years. My use as a first aid kit contains our normal kit plus advanced diabetic needs and a two-pack of Narcan. Not the most organized but it's the ouch pouch.",
  },
  {
    id: "organizers-companion",
    name: "Blake Finley",
    rating: 5,
    title: "Organizers companion",
    text: "Very fast shipping and it's like all the other reviews describe: will be buying more.",
  },
  {
    id: "fast-quick-access",
    name: "Evan",
    rating: 5,
    title: "Fast",
    text: "Quick access.",
  },
  {
    id: "fly-fishing",
    name: "TravisMcKinney",
    rating: 5,
    title: "FLY FISHING Best thing ever",
    text: "I got this for fly fishing on local trout streams when I don't want my big bag unless I'm away from the car a long time. I put two small fly boxes, a lanyard, small knife, and other little gear for a quick trip. I snap the bag to my fly rod case and I'm out the door: set up at the river's edge and it works great. My brother bought one on sight; a couple friends bought them too. Awesome for fly fishing when you just want a short outing. For an all-day trek up and down the river I use my Fishpond sling. I bought a second for my ultra-lite fly rig: this thing rocks.",
  },
  {
    id: "space-saver-job",
    name: "Damon Reyes",
    rating: 5,
    title: "What a space saver this is",
    text: "I usually have a small amount of equipment I use daily at my job but it's been hard finding something that holds them all while staying compact. Square tactical bags on Amazon weren't the solution. I was doubtful when I saw the style and colors: it looked more like a makeup bag than a durable tac bag. Then I found the OD green version and gave it a shot. Pretty much all my stuff and more fit in it and cleared up a lot of space. Now I just carry this instead of a few small bags.",
  },
  {
    id: "woman-owned-pricing",
    name: "Lauren",
    rating: 4,
    title: "For a Woman Owned Company",
    text: "The product hands down is great. It seems durable so far: we just got it two days ago. I was sadly disappointed in the pricing between the Defender Tactical and the regular Lay-n-Go. Clearly one's marketed to men and the other to women. I bought both, one for myself and the Defender for my husband. The Defender has a feature or two the regular didn't have and yet the men's was still cheaper: I made sure they were both 20-inch diameter. Need I say more?",
  },
  {
    id: "favorite-amazon-travel",
    name: "Noah Sutton",
    rating: 5,
    title: "One of my favorite Amazon purchases",
    text: "This makes packing for travel so much easier. Just open it up, toss your charger, cables, meds, chapstick: whatever: on the bag and pull the drawstring to close. It's a long drawstring so I daisy chain the tail to make it shorter, then toss the whole thing into my backpack. At the hotel, on the plane, or in the car, all your stuff is easily accessible.",
  },
  {
    id: "pricey-durable",
    name: "Colin",
    rating: 5,
    title: "A little pricey for a draw string bag, but feels very durable!",
    text: "Price used to be $20, but inflation must've taken its toll. However quality is there and so far has lasted. Two velcro pockets and a secret zipper pocket. Overall recommend for carrying extra items.",
  },
  {
    id: "take-everywhere-edc",
    name: "Grant Whitfield",
    rating: 5,
    title: "I now take this everywhere",
    text: "Holds a surprising amount of stuff. Two Velcro netted mesh pockets on the inside and a zippered pocket as well (opaque so you don't see through). One Velcro pocket on the outside. Also has a place for attaching Velcro patches. I can now carry a huge amount of things I usually didn't carry with me: bandaids, antibiotic, box cutter, aspirin, charging cables, earbuds, etc. Doesn't look like a purse.",
    images: [...DEFENDER_EDC_PHOTOS],
  },
  {
    id: "perfect-bag-dresser",
    name: "Ian Mercer",
    rating: 5,
    title: "Perfect bag for me",
    text: "This might not be for some but I keep it flat on my dresser and put all I need on it. Next morning I throw a little extra like my phone and AirPods on and pull it closed.",
  },
  {
    id: "defender-tactical-efficient",
    name: "Ruben",
    rating: 5,
    title: "LAY/N/GO DEFENDER TACTICAL.",
    text: "Efficient, compact and fits lots of items: recommend it. Fits lots of items but of course is not for everyone; the ones that like it will know what I'm talking about. And it's the bag, not the person, just saying.",
  },
  {
    id: "bought-on-whim",
    name: "Elliot Chase",
    rating: 5,
    title: "Bought on a whim, love it.",
    text: "Didn't like the velcro on the outer pocket so I took a seam ripper to it and stow the excess string in the pocket. Immediately became my favorite miscellaneous bin for tossing things in my backpack. Creator should consider hunter orange or multicam. Maybe a zipper on the outside pocket. Really cool product.",
  },
  {
    id: "tool-bag-addition",
    name: "Vince",
    rating: 5,
    title: "Great addition to the tool bag",
    text: "Perfect for quick little jobs! Electrical or low voltage trim outs would be great: grab a couple tools and parts you need, throw me in and go! Awesome! Do wish they had a thicker canvas version though!",
  },
  {
    id: "amazing-edc-pouch",
    name: "Connor",
    rating: 5,
    title: "Amazing edc pouch!!",
    text: "I have been into pouches and EDC for a long time and it's good to see something different that works at a fair price! The quality is top notch for the price and works way better than I thought. I'm ordering another one for my hammock gear. Great product!!!",
  },
  {
    id: "wow-strong-materials",
    name: "TreyHammond",
    rating: 5,
    title: "Wow",
    text: "I like the color and the materials used seem strong enough. I don't use it to hang but I can see the benefits of that too. It works great for what I wanted it for.",
  },
  {
    id: "molle-pouch-comparison",
    name: "Landon",
    rating: 5,
    title: "Holds more than a comparably sized MOLLE pouch",
    text: "This thing is really cool. I keep it in my car's console and it holds a wizard's laboratory of tools, lights, medicines and other goodies. Access to everything is pretty immediate, which is great.",
  },
  {
    id: "nice-carry-all",
    name: "PorterGill",
    rating: 5,
    title: "Nice carry all. Bag is stiff, but loosens up",
    text: "Good design. Lays flat and has a really long drawstring. I shortened the string so the lip of the bag turned up. Nothing falls out. The org pockets work well.",
  },
  {
    id: "good-bag-intended-use",
    name: "HarlanMoss",
    rating: 5,
    title: "Lay-n-Go Defender Tactical Gear Accessory, Tool & Utility Storage Bag",
    text: "A good bag for its intended use.",
  },
];

/** Defender Mini 16″ & Defender Tactical 20″ */
export function isLayNGoDefenderReviewsPdp(handle: string): boolean {
  const h = handle.toLowerCase();
  return h === "lay-n-go-tactical-bag-20" || h === "lay-n-go-defender-mini-16";
}
