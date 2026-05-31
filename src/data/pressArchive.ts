/** Lay-n-Go complete press archive — generated from legacy press pages. */

export type PressArticle = {
  date: string;
  publication: string;
  title: string;
  href?: string;
  featured?: boolean;
  unavailable?: boolean;
};

export type PressCategory = {
  title: string;
  articles: readonly PressArticle[];
};

export type PressSection = {
  title: string;
  categories: readonly PressCategory[];
};

export const PRESS_ARCHIVE_SUBTITLE = "Sources: layngo.com/pages/press & layngo.com/pages/press-subpage \u2014 All broken http://http:// or http://https:// links have been corrected.";

export const PRESS_ARCHIVE_SECTIONS: readonly PressSection[] = [
  {
    "title": "📰 MAIN PRESS PAGE — Featured Articles (2013–2024)",
    "categories": [
      {
        "title": "🌍 Travel & Lifestyle",
        "articles": [
          {
            "date": "Oct 29, 2024",
            "publication": "Condé Nast Traveler",
            "title": "53 Best Travel Gifts for Every Globetrotter on Your List",
            "featured": true,
            "href": "https://www.cntraveler.com/gallery/the-best-travel-gifts"
          },
          {
            "date": "Jul 13, 2022",
            "publication": "Condé Nast Traveler",
            "title": "17 Picks From Condé Nast Traveler Editors (Amazon Prime Day 2022)",
            "featured": true,
            "href": "https://www.cntraveler.com/story/editors-picks-amazon-prime-day-deals-2022-1"
          },
          {
            "date": "Feb, 2019",
            "publication": "GoNomad",
            "title": "Great New Travel Gadgets and Gear",
            "featured": false,
            "href": "https://www.gonomad.com/132265-look-what-we-found-great-new-travel-gadgets-and-gear"
          },
          {
            "date": "Nov 22, 2013",
            "publication": "TODAY / Bobbie Thomas",
            "title": "Bobbie Shares 3 Gifts to Give Your Girlfriend",
            "featured": false,
            "href": "https://www.today.com/style/bobbies-buzz-3-great-gifts-girlfriends-2D11638370"
          }
        ]
      },
      {
        "title": "🛍 Gifts & Product Roundups",
        "articles": [
          {
            "date": "Aug 19, 2022",
            "publication": "Oprah Daily",
            "title": "The 18 Best Toiletry Bags That'll Help You Stay Organized in Style",
            "featured": true,
            "href": "https://www.oprahdaily.com/style/g40902767/best-toiletry-bags/"
          },
          {
            "date": "Apr 26, 2019",
            "publication": "Good Housekeeping",
            "title": "16 Best Dog Beds to Buy in 2019",
            "featured": false,
            "href": "https://www.goodhousekeeping.com/life/pets/g27129347/best-dog-beds/"
          },
          {
            "date": "Jan 27, 2019",
            "publication": "Grazia ME",
            "title": "Lay-n-Go… Potentially Life-Changing",
            "featured": false,
            "href": "https://www.graziame.com/style/beauty/are-perfumed-lipsticks-the-next-big-thing"
          },
          {
            "date": "People.com",
            "publication": "People",
            "title": "You've Never Seen a Makeup Bag That Keeps Your Products This Organized",
            "featured": false,
            "href": "https://people.com/style/youve-never-seen-a-makeup-bag-that-keeps-your-products-this-organized/"
          },
          {
            "date": "Various",
            "publication": "Parents",
            "title": "Entrepreneurial Moms Share: How to Start Your Own Business",
            "featured": false,
            "href": "https://www.parents.com/parenting/work/entrepreneurial-moms/#page=2"
          },
          {
            "date": "Various",
            "publication": "Lifehacker",
            "title": "Lay-n-Go Traveler Makes Finding Small Items in Your Bag Easy",
            "featured": false,
            "href": "https://lifehacker.com/lay-n-go-traveler-makes-finding-small-items-in-your-bag-1496408342"
          },
          {
            "date": "Various",
            "publication": "RedTri",
            "title": "Ways to Organize Your LEGOs",
            "featured": false,
            "href": "https://redtri.com/ways-to-organize-your-legos/?utm_source=FB&utm_medium=NATL&utm_campaign=FB-NATL"
          },
          {
            "date": "Various",
            "publication": "Consumer Reports",
            "title": "Consumer Reports on Lay-n-Go",
            "featured": false,
            "href": "https://drive.google.com/open?id=0B5JfADpkYhTKTzZUUDVkUkhkRXM"
          },
          {
            "date": "Various",
            "publication": "BuzzFeed",
            "title": "42 Storage Ideas That Will Organize Your Entire House",
            "featured": false,
            "href": "https://www.buzzfeed.com/jessicaprobus/store-it-good#.bma95m3qjl"
          },
          {
            "date": "Various",
            "publication": "Elvis Duran / iHeart",
            "title": "What's Trending – December 11th",
            "featured": false,
            "href": "https://elvisduran.iheart.com/articles/whats-trending-461825/whats-trending-december-11th-13055859/"
          },
          {
            "date": "Various",
            "publication": "Gizmodo AU",
            "title": "The Perfect Toiletry Bag for Those Morally Opposed to Organization",
            "featured": false,
            "href": "https://www.gizmodo.com.au/2013/12/the-perfect-toiletry-bag-for-those-morally-opposed-to-organization/"
          }
        ]
      },
      {
        "title": "🏆 Business & Entrepreneurship",
        "articles": [
          {
            "date": "Aug 16, 2022",
            "publication": "Inc. Magazine",
            "title": "Lay-n-Go Named to the Inc. 5000! (2022)",
            "featured": true,
            "href": "https://www.inc.com/inc5000"
          },
          {
            "date": "May 3, 2024",
            "publication": "The Female Founder Show / ASBN",
            "title": "Amy Fazackerley Reveals How She Conquers Business Challenges While Nurturing Family Life",
            "featured": true,
            "href": "https://www.asbn.com/small-business-shows/female-founder-bridget-fitzpatrick/amy-fazackerley-reveals-how-she-conquers-business-challenges-while-nurturing-family-life/"
          },
          {
            "date": "Mar 11, 2020",
            "publication": "Women Who Own It",
            "title": "\"Women Who Own It\" – Amy Fazackerley of Lay-n-Go",
            "featured": false,
            "href": "https://www.womenownedlogo.com/women-who-own-it-/amy-fazackerley-of-lay-n-go"
          },
          {
            "date": "Feb 25, 2019",
            "publication": "U.S. Chamber of Commerce / CO—",
            "title": "'Product is King' – Business Lessons from the Founder of Lay-n-Go",
            "featured": false,
            "href": "https://www.uschamber.com/co/good-company/growth-studio/business-advice-lay-n-go"
          },
          {
            "date": "Mar 7, 2019",
            "publication": "Good Morning America",
            "title": "GMA Celebrating Women-Owned Businesses (Tory Johnson Deals & Steals)",
            "featured": false,
            "href": "https://www.goodmorningamerica.com/shop/story/gma-deals-steals-celebrating-women-owned-businesses-womens-61485650"
          },
          {
            "date": "May 1, 2019",
            "publication": "Good Morning America",
            "title": "Tory Johnson's Special Edition of \"Spring Fling\" (Facebook video)",
            "featured": false,
            "href": "https://www.facebook.com/GoodMorningAmerica/videos/371328786814526/"
          }
        ]
      },
      {
        "title": "📅 2017–2018 Articles",
        "articles": [
          {
            "date": "Dec 19, 2018",
            "publication": "Spa Week Blog",
            "title": "Spa Week's Last Minute Gift Guide",
            "featured": false,
            "href": "https://blog.spaweek.com/2018/12/19/spa-weeks-last-minute-gift-guide/"
          },
          {
            "date": "Nov 29, 2018",
            "publication": "Beauty News NYC",
            "title": "Travel Must-Haves for the Holiday Season",
            "featured": false,
            "href": "https://www.beautynewsnyc.com/metro-mama-metro-baby/mama-must-haves-for-the-holiday-season/"
          },
          {
            "date": "Oct 16, 2018",
            "publication": "Glitter Mag Rocks",
            "title": "Keep Your Beauty Faves Organized with Lay-n-Go",
            "featured": false,
            "href": "http://glittermagrocks.com/connect/2018/10/16/keep-your-beauty-faves-organized-with-lay-n-go/"
          },
          {
            "date": "Sep 3, 2018",
            "publication": "Hobbies on a Budget",
            "title": "How to Find New Luggage",
            "featured": false,
            "href": "https://hobbiesonabudget.com/luggage-options/"
          },
          {
            "date": "Aug 17, 2018",
            "publication": "Mac Observer",
            "title": "8 Back to School Tech Products For Your Kids",
            "featured": false,
            "href": "https://www.macobserver.com/tips/quick-tip/8-back-to-school-tech-products/"
          },
          {
            "date": "Jul 12, 2018",
            "publication": "ABC15 / Sonoran Living",
            "title": "Susan and Terri Try Out Fun New Products",
            "featured": false,
            "href": "https://www.abc15.com/lifestyle/sonoran-living/susan-and-terri-try-out-fun-new-products"
          },
          {
            "date": "Jun 8, 2018",
            "publication": "Pittsburgh Better Times",
            "title": "2018 Dads and Grads Gift Guide",
            "featured": false,
            "href": "https://www.pittsburghbettertimes.com/2018-dads-and-grads-gift-guide/"
          },
          {
            "date": "Dec 12, 2017",
            "publication": "BuzzFeed / QVC",
            "title": "14 Insanely Innovative Gifts That Will Blow Your Mind",
            "featured": false,
            "href": "https://www.buzzfeed.com/qvc/insanely-innovative-gifts-that-will-blow-your-mind?utm_term=.wkD872zaQ6#.cx9me2qQDz"
          },
          {
            "date": "Mar 13, 2017",
            "publication": "Wicked Good Travel Tips",
            "title": "Have kids…. Need Toys That Travel!",
            "featured": false,
            "href": "http://www.wickedgoodtraveltips.com/2017/03/have-kids-need-toys-that-travel/"
          },
          {
            "date": "Mar, 2017",
            "publication": "Wiki Ezvid",
            "title": "10 Best Makeup Bags by Wiki Ezvid",
            "featured": false,
            "href": "https://wiki.ezvid.com/best-makeup-bags"
          }
        ]
      },
      {
        "title": "📅 2015–2016 Articles",
        "articles": [
          {
            "date": "Nov 19, 2015",
            "publication": "Wanderlittles",
            "title": "To Grandmother's House We Go",
            "featured": false,
            "href": "http://www.wanderlittles.com/blog/to-grandmothers-house-we-go-day-2-lay-n-go-lite-mat"
          },
          {
            "date": "Nov 6, 2015",
            "publication": "GeekDad",
            "title": "Easily Carry Stuff Around with Lay-n-Go",
            "featured": false,
            "href": "http://geekdad.com/2015/11/lay-n-go/"
          },
          {
            "date": "Oct 3, 2015",
            "publication": "Bella Vida by Letty",
            "title": "Best Travel Packing Organizers",
            "featured": false,
            "href": "http://www.bellavidabyletty.com/best-travel-packing-organizers/"
          },
          {
            "date": "Sep 25, 2015",
            "publication": "YouTube",
            "title": "Beauty Minute: Lay-n-Go COSMO (video)",
            "featured": false,
            "href": "https://www.youtube.com/watch?v=DK3Tb7YKe0A"
          },
          {
            "date": "Sep 5, 2015",
            "publication": "BuzzFeed",
            "title": "42 Storage Ideas That Will Organize Your Entire House",
            "featured": false,
            "href": "http://www.buzzfeed.com/jessicaprobus/store-it-good#.bma95m3qjl"
          },
          {
            "date": "Aug 11, 2015",
            "publication": "Smarter Travel",
            "title": "How to Store and Organize Your Travel Stuff at Home",
            "featured": false,
            "href": "http://www.smartertravel.com/photo-galleries/editorial/how-to-store-and-organize-your-travel-stuff-at-home.html?id=1079"
          },
          {
            "date": "Jul 14, 2015",
            "publication": "Mommy's Block Party",
            "title": "Hit the Bricks with Lay-n-Go",
            "featured": false,
            "href": "http://www.mommysblockparty.co/2015/07/hit-bricks-with-lay-n-go-portable-brick.html"
          },
          {
            "date": "Jul 14, 2015",
            "publication": "Parents",
            "title": "Entrepreneurial Moms Share: How to Start Your Own Business",
            "featured": false,
            "href": "http://www.parents.com/parenting/work/entrepreneurial-moms/#page=2"
          },
          {
            "date": "Apr 27, 2015",
            "publication": "Rave and Review",
            "title": "Clean-up in Seconds with Lay-n-Go",
            "featured": false,
            "href": "http://www.raveandreview.com/2015/04/clean-up-in-seconds-with-lay-n-go-a-totable-mat-for-everyone-in-the-family.html"
          },
          {
            "date": "Apr 22, 2015",
            "publication": "Casa and Company",
            "title": "10 Gifts for the Organized Mom",
            "featured": false,
            "href": "http://www.casaandcompany.com/living/10-gifts-for-the-organized-mom/"
          },
          {
            "date": "Apr 14, 2015",
            "publication": "Color for Chocolate",
            "title": "12 Summer Roadtrip Must Haves",
            "featured": false,
            "href": "http://colorforchocolate.com/12-summer-roadtrip-must-haves/"
          },
          {
            "date": "Feb 8, 2015",
            "publication": "Toy Directory Monthly",
            "title": "TD Monthly Award for the Lay-n-Go LITE",
            "featured": false,
            "href": "http://www.toydirectory.com/monthly/new_product.asp?id=33578"
          },
          {
            "date": "Feb 2, 2015",
            "publication": "Quartz (QZ.com)",
            "title": "How LEGO Freaks Stack and Store Their LEGO",
            "featured": false,
            "href": "http://qz.com/328444/how-lego-freaks-stack-and-store-their-legos/"
          },
          {
            "date": "Jan 17, 2015",
            "publication": "Trazee Travel",
            "title": "Clean-up Your Make-up on Vacation with Lay-n-Go",
            "featured": false,
            "href": "http://www.trazeetravel.com/products/clean-makeup-vacation-lay-n-go-cosmo.php"
          },
          {
            "date": "Jan 10, 2015",
            "publication": "Just Real Moms (Brasil)",
            "title": "Lay-n-Go Review on JustRealMoms.com.br",
            "featured": false,
            "href": "http://www.justrealmoms.com.br/chega-de-brinquedos-espalhados/"
          },
          {
            "date": "Jan 9, 2015",
            "publication": "Certified Fabulous",
            "title": "Best Way for You and Your Beauty Essentials to Travel",
            "featured": false,
            "href": "http://www.certifiedfabulous.com/beauty-product-reviews/the-best-way-for-you-and-your-beauty-essentials-to-travel"
          }
        ]
      }
    ]
  },
  {
    "title": "📰 PRESS SUBPAGE — Articles 2011–2014",
    "categories": [
      {
        "title": "⭐ Featured Press Highlights (2011–2014)",
        "articles": [
          {
            "date": "Mar 24, 2014",
            "publication": "Consumer Reports",
            "title": "Consumer Reports on Lay-n-Go LARGE",
            "featured": true,
            "href": "https://drive.google.com/open?id=0B5JfADpkYhTKTzZUUDVkUkhkRXM"
          },
          {
            "date": "Jan 7, 2014",
            "publication": "Lifehacker",
            "title": "Lay-n-Go TRAVELER Makes Finding Small Items in Your Bag Easy",
            "featured": true,
            "href": "https://lifehacker.com/lay-n-go-traveler-makes-finding-small-items-in-your-bag-1496408342"
          },
          {
            "date": "Dec 6, 2013",
            "publication": "Gizmodo AU",
            "title": "Lay-n-Go TRAVELER Review — The Perfect Toiletry Bag",
            "featured": true,
            "href": "https://www.gizmodo.com.au/2013/12/the-perfect-toiletry-bag-for-those-morally-opposed-to-organization/"
          },
          {
            "date": "Dec 1, 2013",
            "publication": "werd.com",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": true,
            "href": "https://www.werd.com/23195/lay-n-go-traveler/"
          },
          {
            "date": "Nov 23, 2013",
            "publication": "TODAY Show (Hoda & Kathie Lee)",
            "title": "Lay-n-Go on the Today Show with Hoda and Kathie Lee",
            "featured": true,
            "href": "https://www.today.com/style/bobbies-buzz-3-great-gifts-girlfriends-2D11638370"
          },
          {
            "date": "Jun 29, 2013",
            "publication": "Real Simple",
            "title": "6 Clever Items to Simplify Your Life",
            "featured": true,
            "href": "https://www.realsimple.com/work-life/life-strategies/problem-solvers-00100000104943/page3.html"
          },
          {
            "date": "Apr 1, 2013",
            "publication": "RedTri",
            "title": "Adios Lego Chaos… 9 Cool Ways to Organize Your Bricks",
            "featured": true,
            "href": "https://redtri.com/ways-to-organize-your-legos/"
          },
          {
            "date": "Nov 7, 2012",
            "publication": "Cincinnati Family Magazine",
            "title": "Contain Yourself",
            "featured": true,
            "href": "http://cincinnatifamilymagazine.com/uncategorized/contain-yourself"
          },
          {
            "date": "Jun 29, 2012",
            "publication": "Familylicious",
            "title": "Best Thing Since Sliced Bread",
            "featured": true,
            "href": "http://familylicious.com/lay-n-go-review/"
          },
          {
            "date": "Mar 28, 2012",
            "publication": "The Toy Insider",
            "title": "Lay N Go: Simplifying On The Go Play & Clean Up",
            "featured": true,
            "href": "http://www.thetoyinsider.com/?p=4092#comment-12055"
          },
          {
            "date": "Mar 9, 2012",
            "publication": "Simple Mom",
            "title": "Kids' Stuff Organized: Before and After Photos",
            "featured": true,
            "href": "http://simplemom.net/organizing-kids-stuff/"
          },
          {
            "date": "Feb 4, 2012",
            "publication": "Smart Mom Picks",
            "title": "Lay-n-Go Activity Mat is Every Mom's Lifesaver!",
            "featured": true,
            "href": "http://www.smartmompicks.com/lay-n-go-activity-mat-is-every-moms-lifesaver/comment-page-1/"
          },
          {
            "date": "Mar, 2012",
            "publication": "Metro Family Magazine",
            "title": "Problem Solvers – Helpful Family Products (link broken)",
            "featured": true,
            "unavailable": true
          },
          {
            "date": "Nov 17, 2011",
            "publication": "Families.com",
            "title": "Must Have Item: Lay-n-Go",
            "featured": true,
            "href": "https://pre-school.families.com/blog/must-have-item-lay-n-go"
          },
          {
            "date": "May 18, 2012",
            "publication": "Unknown",
            "title": "Little Jet Setters – Travel MUST HAVES for Kids (no link on site)",
            "featured": true,
            "unavailable": true
          },
          {
            "date": "Jun 15, 2011",
            "publication": "Unknown",
            "title": "The Lay-n-Go LITE (no link on site)",
            "featured": true,
            "unavailable": true
          }
        ]
      },
      {
        "title": "📅 2014 Articles",
        "articles": [
          {
            "date": "Dec 15, 2014",
            "publication": "Makobiscribe",
            "title": "Unisex Christmas Gifts Under $50 from Lay-n-Go",
            "featured": false,
            "href": "http://makobiscribe.com/unisex-christmas-gifts-under-50/"
          },
          {
            "date": "Dec 11, 2014",
            "publication": "Elvis Duran Show",
            "title": "Layngo Cosmo on TheElvisDuranShow",
            "featured": false,
            "href": "http://www.elvisduran.com/articles/whats-trending-461825/whats-trending-december-11th-13055859/"
          },
          {
            "date": "Nov 29, 2014",
            "publication": "A Yellow Brick Blog",
            "title": "Lay-n-Go COSMO Review",
            "featured": false,
            "href": "http://www.ayellowbrickblog.com/2014/11/beautycrowdcom.html"
          },
          {
            "date": "Nov 12, 2014",
            "publication": "The Black Pearl Blog",
            "title": "Lay-n-Go COSMO Review",
            "featured": false,
            "href": "http://www.theblackpearlblog.com/2014/11/beauty-crowd.html"
          },
          {
            "date": "Oct 24, 2014",
            "publication": "BuzzFeed",
            "title": "49 Clever Storage Solutions For Living with Kids",
            "featured": false,
            "href": "https://www.buzzfeed.com/morganshanahan/clever-storage-solutions-for-living-with-kids"
          },
          {
            "date": "Oct 19, 2014",
            "publication": "Dad N Charge",
            "title": "If You Have Legos, You Need Lay-n-Go",
            "featured": false,
            "href": "http://www.dadncharge.com/2014/10/if-you-have-legos-you-need-layngo.html?m=1"
          },
          {
            "date": "Oct 8, 2014",
            "publication": "Unknown",
            "title": "12 Clever Ways to Organize Your LEGOs (broken anchor on site)",
            "featured": false,
            "unavailable": true
          },
          {
            "date": "Oct 6, 2014",
            "publication": "Get Fit with Hope (blogspot)",
            "title": "Hope's Beauty Buzz",
            "featured": false,
            "href": "http://getfitwithhope.blogspot.com/2014/10/hopes-beauty-buzz.html"
          },
          {
            "date": "Oct 6, 2014",
            "publication": "The Fit Foodee (blogspot)",
            "title": "Hope's Beauty Buzz",
            "featured": false,
            "href": "http://thefitfoodee.blogspot.com/2014/10/hopes-beauty-buzz.html"
          },
          {
            "date": "Aug 31, 2014",
            "publication": "Coupon WAHM",
            "title": "Organize Your Legos and More with Lay-n-Go",
            "featured": false,
            "href": "http://www.couponwahm.com/organize-your-legos-and-more-with-the-layngo-reviews/"
          },
          {
            "date": "Aug, 2014",
            "publication": "SilverKris",
            "title": "Lay-n-Go COSMO on Silverkris.com",
            "featured": false,
            "href": "http://www.silverkris.com/stories/travel-organisers"
          },
          {
            "date": "Aug 20, 2014",
            "publication": "A Sweet Potato Pie",
            "title": "Lay-n-Go Review",
            "featured": false,
            "href": "http://asweetpotatopie.com/2014/08/20/lay-n-go-review/"
          },
          {
            "date": "Jul 16, 2014",
            "publication": "Non-Perfect Parenting",
            "title": "Lay-n-Go… Play For Hours… Clean-up in Seconds!",
            "featured": false,
            "href": "http://nonperfectparenting.com/5/post/2014/07/lay-n-goplay-for-hourscleanup-in-seconds.html"
          },
          {
            "date": "Jul 12, 2014",
            "publication": "The Mommy Nest",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.themommynest.com/blog/entry/lay-n-go-lite-review"
          },
          {
            "date": "Jun 15, 2014",
            "publication": "Lashes Lace & Lipstick (blogspot)",
            "title": "Awesome Product Alert: LAY/N/GO COSMO BAG",
            "featured": false,
            "href": "http://lasheslaceandlipstick.blogspot.com/2014/06/awesome-product-alert-layngo-cosmo-bag.html"
          },
          {
            "date": "Jun 3, 2014",
            "publication": "Hobbies on a Budget",
            "title": "Take Your Toys Everywhere – Lay-n-Go Lite",
            "featured": false,
            "href": "http://hobbiesonabudget.com/2014/06/03/take-toys-anywhere-lay-n-go-lite/"
          },
          {
            "date": "Jun 3, 2014",
            "publication": "The Gadgeteer",
            "title": "Toys, Cosmetic, Tools – They're All in The Bag!",
            "featured": false,
            "href": "http://the-gadgeteer.com/2014/06/03/toys-cosmetics-tools-theyre-all-in-the-bag/"
          },
          {
            "date": "May 31, 2014",
            "publication": "Momma Chronicles",
            "title": "Lay-n-Go LITE – Play & Go Quietly",
            "featured": false,
            "href": "http://www.mommachronicles.com/2014/05/lay-n-go-lite-play-go-quietly/"
          },
          {
            "date": "May 27, 2014",
            "publication": "Inspired by Savannah",
            "title": "Mom Invented Lay-n-Go LITE Makes Toy Clean Up a Breeze",
            "featured": false,
            "href": "http://www.inspiredbysavannah.com/2014/05/mom-invented-lay-n-go-lite-makes-toy.html"
          },
          {
            "date": "May 1, 2014",
            "publication": "Genia Be Me",
            "title": "Lay-n-Go COSMO Review",
            "featured": false,
            "href": "http://www.geniabeme.com/2014/05/lay-n-go-cosmo-review.html"
          },
          {
            "date": "Apr 23, 2014",
            "publication": "Top Notch Material",
            "title": "Lay-n-Go LITE Giveaway",
            "featured": false,
            "href": "http://www.topnotchmaterial.com/2014/04/lay-n-go-lite-giveaway.html"
          },
          {
            "date": "Apr 21, 2014",
            "publication": "Good Ideas for You",
            "title": "Brilliant Product – Lay-n-Go COSMO Cosmetic Bag",
            "featured": false,
            "href": "http://goodideasforyou.com/mix-a-match/3903-brilliant-product-lay-n-go-cosmo-cosmetics-bag.html"
          },
          {
            "date": "Apr 10, 2014",
            "publication": "Tenth and Fourth",
            "title": "Tipster: Lay-n-go",
            "featured": false,
            "href": "http://tenthandfourth.com/home-goods/tipster-lay-n-go/"
          },
          {
            "date": "Apr 9, 2014",
            "publication": "Gaby no Canada (Portugal)",
            "title": "Lay-n-Go COSMO Review (Portuguese)",
            "featured": false,
            "href": "http://gabynocanada.com/2014/04/09/praticidade-na-hora-de-arrumar-a-mala/"
          },
          {
            "date": "Mar 31, 2014",
            "publication": "PM Girl (France)",
            "title": "Lay-n-Go en français (French)",
            "featured": false,
            "href": "http://www.pmgirl.net/wonder-poupette-m16/lay-n-go-la-vraie-bonne-idee-pour-ranger-les-jouets/"
          },
          {
            "date": "Mar 14, 2014",
            "publication": "The Unemployed Mom",
            "title": "Effortless LEGO Cleanup & Storage",
            "featured": false,
            "href": "http://theunemployedmom.com/2014/03/14/effortless-lego-cleanup-storage-with-lay-n-go-large-giveaway/"
          },
          {
            "date": "Feb, 2014",
            "publication": "Round the Table Magazine",
            "title": "Round the Table Magazine",
            "featured": false,
            "href": "http://edition.pagesuite-professional.co.uk/launch.aspx?pbid=4f1eacca-06b3-4733-b368-631bd792059a"
          },
          {
            "date": "Jan 8, 2014",
            "publication": "Boing Boing",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": false,
            "href": "http://boingboing.net/2014/01/08/drawstring-travel-pouch-that-o.html"
          },
          {
            "date": "Jan 7, 2014",
            "publication": "Gear Hungry",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": false,
            "href": "http://gearhungry.com/2014/01/lay-n-go-traveler.html"
          },
          {
            "date": "Jan 7, 2014",
            "publication": "Tools and Toys",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": false,
            "href": "http://toolsandtoys.net/lay-n-go-traveler/"
          },
          {
            "date": "Jan 5, 2014",
            "publication": "The Gear Post",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": false,
            "href": "http://thegearpost.com/gear/lay-n-go-traveler/"
          },
          {
            "date": "Jan 2, 2014",
            "publication": "The Real Frugal Divas",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.therealfrugaldivas.com/lay-n-go-lite-pish-posh-baby-review"
          },
          {
            "date": "Jan 2, 2014",
            "publication": "Today's Hype",
            "title": "Lay-n-Go TRAVELER Review",
            "featured": false,
            "href": "http://www.todayshype.com/2014/01/lay-n-go-traveler-washbag.html"
          },
          {
            "date": "Jan 2, 2014",
            "publication": "Oh Gizmo",
            "title": "Lay-n-Go TRAVELER Makes Packing and Unpacking Easier",
            "featured": false,
            "href": "http://www.ohgizmo.com/2014/01/02/lay-n-go-traveler-makes-packing-and-unpacking-easier/"
          }
        ]
      },
      {
        "title": "📅 2013 Articles",
        "articles": [
          {
            "date": "Dec 27, 2013",
            "publication": "Mom PopSugar",
            "title": "Lay-n-Go LARGE",
            "featured": false,
            "href": "http://moms.popsugar.com/photo-gallery/27334358/Lay-n-Go-Bags"
          },
          {
            "date": "Dec 23, 2013",
            "publication": "Cheapflights",
            "title": "Nifty Gifts for the Traveler in Your Life",
            "featured": false,
            "href": "http://www.cheapflights.com/news/nifty-gifts-for-the-traveler-in-your-life/"
          },
          {
            "date": "Dec 17, 2013",
            "publication": "Terminal de Embarque (Brazil)",
            "title": "Lay-n-Go on Terminaldeembarque.com (Portuguese)",
            "featured": false,
            "href": "http://terminaldeembarque.com/2013/12/17/a-praticidade-dos-sacos-de-viagem-da-lay-n-go/"
          },
          {
            "date": "Dec 17, 2013",
            "publication": "This Girl Travels",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.thisgirltravels.com/2013/12/17/join-us-talk-women-travel-2014/"
          },
          {
            "date": "Dec 16, 2013",
            "publication": "International Fly Guy",
            "title": "Fly Guy's Guide 2 Travel Gifts",
            "featured": false,
            "href": "http://internationalflyguy.com/2013/12/16/2559/"
          },
          {
            "date": "Dec 12, 2013",
            "publication": "Mandatory",
            "title": "Mandatory's 2013 Holiday Gift Guide",
            "featured": false,
            "href": "http://www.mandatory.com/2013/12/12/mandatorys-2013-holiday-gift-guide/11"
          },
          {
            "date": "Dec 10, 2013",
            "publication": "Five Sons on the Fly",
            "title": "Lego on the Go",
            "featured": false,
            "href": "http://fivesonthefly.com/tag/lay-n-go-mat/"
          },
          {
            "date": "Dec 9, 2013",
            "publication": "StyleXStyle",
            "title": "Team Picks",
            "featured": false,
            "href": "http://www.stylexstyle.com/editorial/lifestyle/team-picks-whats-hot-our-list-right-now-5"
          },
          {
            "date": "Dec 7, 2013",
            "publication": "Vaga Gear",
            "title": "Lay-n-Go TRAVELER",
            "featured": false,
            "href": "http://vagagear.com/lay-n-go-traveler-bag/"
          },
          {
            "date": "Dec 7, 2013",
            "publication": "Trend Hunter",
            "title": "Lay-n-Go TRAVELER",
            "featured": false,
            "href": "http://www.trendhunter.com/trends/lay-n-go"
          },
          {
            "date": "Dec 5, 2013",
            "publication": "Shanamama",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.shanamama.com/lay-n-go-lite-review-giveaway"
          },
          {
            "date": "Dec 5, 2013",
            "publication": "Gizmodo",
            "title": "The Perfect Toiletry Bag (…) Morally Opposed to Organization",
            "featured": false,
            "href": "http://gizmodo.com/the-perfect-toiletry-bag-for-those-morally-opposed-to-o-1476647606/all"
          },
          {
            "date": "Dec 3, 2013",
            "publication": "Before It's News",
            "title": "Lay-n-Go LITE Review & Giveaway",
            "featured": false,
            "href": "http://beforeitsnews.com/travel/2013/12/review-giveaway-lay-n-go-lite-2459260.html"
          },
          {
            "date": "Dec 2, 2013",
            "publication": "Clever Girl Organizing",
            "title": "Gifts for the Organized Traveler",
            "featured": false,
            "href": "http://www.clevergirlorganizing.com/tag/lay-n-go/"
          },
          {
            "date": "Dec 2, 2013",
            "publication": "Aviation Interviews",
            "title": "Travel Gift Guide",
            "featured": false,
            "href": "https://www.aviationinterviews.com/flight-attendant-life/2013/12/02/travel-gift-guide/"
          },
          {
            "date": "Nov 29, 2013",
            "publication": "Jenny on the Spot",
            "title": "Handy Dandy Lay-n-Go COSMO",
            "featured": false,
            "href": "http://www.jennyonthespot.com/just-jenny/you-like-handy-dandy-meet-my-friend-the-lay-n-go/"
          },
          {
            "date": "Nov 27, 2013",
            "publication": "Wandering Tastes",
            "title": "Great for Traveling with Little Pieces",
            "featured": false,
            "href": "http://wanderingtastes.com/2012/11/27/lay-n-go-great-for-traveling-with-little-pieces/"
          },
          {
            "date": "Nov 26, 2013",
            "publication": "A Personal Organizer",
            "title": "Organizing Tools Make Great Gifts",
            "featured": false,
            "href": "http://www.apersonalorganizer.com/lay-n-go-giveaway"
          },
          {
            "date": "Nov 25, 2013",
            "publication": "Groovy Finds (Squidoo)",
            "title": "Lay-n-Go COSMO Review",
            "featured": false,
            "href": "http://groovyfinds.squidoo.com/lay-n-go-cosmo-cosmetic-bag"
          },
          {
            "date": "Oct 14, 2013",
            "publication": "Simple Solutions Design",
            "title": "Lego Organizing",
            "featured": false,
            "href": "http://www.simplesolutionsdesign.com/2013/10/lego-organizing.html"
          },
          {
            "date": "Oct 9, 2013",
            "publication": "Clutter Interrupted",
            "title": "9 Organizing Products for Kid's Spaces",
            "featured": false,
            "href": "http://clutterinterrupted.com/9-organizing-products-for-kids-spaces/"
          },
          {
            "date": "Sep 21, 2013",
            "publication": "I Love My Kids Blog",
            "title": "Lay-n-Go COSMO Makes Storing and Transporting Make-up Easy",
            "featured": false,
            "href": "http://ilovemykidsblog.net/2013/09/lay-n-go-cosmo-makes-storing-and-transporting-make-up-easy.html"
          },
          {
            "date": "Aug 29, 2013",
            "publication": "Pink Fard (Italy)",
            "title": "Lay-n-Go COSMO Review (Italian)",
            "featured": false,
            "href": "http://pinkfard.blogspot.com/2013/08/beauty-crowd-layngo-cosmo.html"
          },
          {
            "date": "Jul 23, 2013",
            "publication": "Modern Mom",
            "title": "Lay-n-Go LARGE Review",
            "featured": false,
            "href": "http://www.modernmom.com/5f9ee40c-3b50-11e3-8c7c-bc764e04a41e.html"
          },
          {
            "date": "Jul 5, 2013",
            "publication": "I Am Your Father (Germany)",
            "title": "Lay-n-Go Review (German)",
            "featured": false,
            "href": "http://www.iamyourfather.de/lay-n-go-schnell-mal-aufraeumen"
          },
          {
            "date": "Jun 20, 2013",
            "publication": "Baby Gizmo",
            "title": "Lay-n-Go LARGE Review",
            "featured": false,
            "href": "http://blog.babygizmo.com/2013/06/lay-n-go-product-review/"
          },
          {
            "date": "May 16, 2013",
            "publication": "Families Go Travel",
            "title": "10 Clever Items for Babies and Preschoolers",
            "featured": false,
            "href": "http://www.familiesgotravel.com/planning/10-clever-travel-items-for-a-babies-and-preschoolers/"
          },
          {
            "date": "May 11, 2013",
            "publication": "Tips from Town",
            "title": "Kids Toy Storage",
            "featured": false,
            "href": "http://www.tipsfromtown.com/kids-toy-storage/"
          },
          {
            "date": "May 1, 2013",
            "publication": "Moody Mama Says",
            "title": "Hottest Toys of 2013",
            "featured": false,
            "href": "http://www.moodymamasays.com/2013-hottest-toys"
          },
          {
            "date": "Apr 2, 2013",
            "publication": "It's On My To Do List (WordPress)",
            "title": "Mama Must Have – Lay-n-Go Play Mat",
            "featured": false,
            "href": "http://itsonmytodolist.wordpress.com/2013/04/02/mama-must-have-the-lay-n-go-play-mat/"
          },
          {
            "date": "Mar 31, 2013",
            "publication": "Blogging Mom of 4",
            "title": "Lay-n-Go LARGE Review",
            "featured": false,
            "href": "http://bloggingmomof4.com/lay-n-go/"
          },
          {
            "date": "Jan 21, 2013",
            "publication": "YouTube",
            "title": "Awesome Lego Storage: Your Creative Friends (video)",
            "featured": false,
            "href": "https://www.youtube.com/watch?v=zug_y-_Bc6Q"
          },
          {
            "date": "Jan 15, 2013",
            "publication": "Why We Love Green",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.whywelovegreen.com/2013/01/layngo-travel-mini-activity-mat-review.html"
          },
          {
            "date": "Jan 15, 2013",
            "publication": "Bambino Goodies (UK)",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://www.bambinogoodies.co.uk/lay-n-go/"
          },
          {
            "date": "Jan 7, 2013",
            "publication": "My Guide to Homemade (blogspot)",
            "title": "Lay-n-Go LITE Review",
            "featured": false,
            "href": "http://myguidetohomemade.blogspot.com/2013/01/lego.html"
          },
          {
            "date": "Jan 4, 2013",
            "publication": "Mom Does Reviews",
            "title": "Mom's Dream Come True",
            "featured": false,
            "href": "http://momdoesreviews.com/2013/01/04/lay-n-go-giveaway-ends-110-at-1159p/layngo/"
          },
          {
            "date": "Jan, 2013",
            "publication": "About.com (Toys)",
            "title": "Lay-n-Go LIFESTYLE Review",
            "featured": false,
            "href": "http://toys.about.com/od/healthandsafety/fl/Lay-n-Go-Lifestyle-Review.htm"
          }
        ]
      },
      {
        "title": "📅 2012 Articles",
        "articles": [
          {
            "date": "Dec 31, 2012",
            "publication": "Baby Recs",
            "title": "Lay-n-Go Lite Review",
            "featured": false,
            "href": "http://babyrecs.com/2012/12/31/lay-n-go/"
          },
          {
            "date": "Dec 31, 2012",
            "publication": "Cuzin Logic",
            "title": "Lay-n-Go Lite Activity Mat and Toy Storage",
            "featured": false,
            "href": "http://cuzinlogic.com/2012/12/lay-n-go-lite-activity-mat/"
          },
          {
            "date": "Dec 20, 2012",
            "publication": "Thanks Mail Carrier",
            "title": "Lay-n-Go Lite Review",
            "featured": false,
            "href": "http://www.thanksmailcarrier.com/2012/12/lay-n-go-lite-from-pishposhbaby-review.html"
          },
          {
            "date": "Dec 12, 2012",
            "publication": "Our Piece of Earth",
            "title": "Lay-n-Go Activity Mat Lite Review",
            "featured": false,
            "href": "http://www.ourpieceofearth.com/lay-n-go-activity-mat-lite-review/"
          },
          {
            "date": "Dec 10, 2012",
            "publication": "Desert Chica Ramblings",
            "title": "Lay-n-Go Lite Review",
            "featured": false,
            "href": "http://desertchicaramblings.com/2012/12/lay-n-go-lite-review/"
          },
          {
            "date": "Dec 10, 2012",
            "publication": "Fun Seeking Family",
            "title": "Lay-n-Go Review",
            "featured": false,
            "href": "http://www.funseekingfamily.com/2012/12/10/291/"
          },
          {
            "date": "Dec 10, 2012",
            "publication": "Just Add Cloth",
            "title": "Lay-n-Go Lite Activity Mat for Kids on the Go!",
            "featured": false,
            "href": "http://www.justaddcloth.com/2012/12/the-lay-n-go-lite-activity-play-mat-for-kids-on-the-go/"
          },
          {
            "date": "Dec 5, 2012",
            "publication": "Luxury Travel Mom",
            "title": "Best Makeup Bag for The Frequent Traveler",
            "featured": false,
            "href": "http://www.luxurytravelmom.com/best-make-up-bag-for-the-frequent-traveler/"
          },
          {
            "date": "Dec 4, 2012",
            "publication": "Zephyr Hill Blog",
            "title": "Lay-n-Go Lite Activity Mat Review",
            "featured": false,
            "href": "http://www.zephyrhillblog.com/2012/12/layngo-lite-activity-mat-review/"
          },
          {
            "date": "Dec 4, 2012",
            "publication": "Cloth Diaper Revival",
            "title": "Lay-n-Go Lite Activity Mat Review",
            "featured": false,
            "href": "http://www.clothdiaperrevival.com/2012/12/lay-n-go-lite-mat.html"
          },
          {
            "date": "Dec 3, 2012",
            "publication": "A Lucky Ladybug",
            "title": "Lay-n-Go Lite Travel Mat Review",
            "featured": false,
            "href": "http://www.aluckyladybug.com/2012/12/pish-posh-baby-layngo-activity-mat-lite.html"
          },
          {
            "date": "Dec 1, 2012",
            "publication": "Mr. Dad",
            "title": "Seal of Approval Winners",
            "featured": false,
            "href": "http://www.mrdad.com/reviews/soa-winners/seal-winners-1212/"
          },
          {
            "date": "Nov 29, 2012",
            "publication": "Jenny on the Spot",
            "title": "You Like Handy-Dandy? Meet my Friend… The Lay-n-Go!",
            "featured": false,
            "href": "http://www.jennyonthespot.com/just-jenny/you-like-handy-dandy-meet-my-friend-the-lay-n-go/"
          },
          {
            "date": "Nov 29, 2012",
            "publication": "The Knitwit by Shair",
            "title": "A Blue Christmas: Lay-n-Go Large Review",
            "featured": false,
            "href": "http://theknitwitbyshair.com/2012/11/a-blue-christmas-lay-n-go-play-mats.html"
          },
          {
            "date": "Nov 27, 2012",
            "publication": "Rockstar Mom LV",
            "title": "Surviving Holiday Travel",
            "featured": false,
            "href": "http://www.rockstarmomlv.com/surviving-holiday-travel/"
          },
          {
            "date": "Nov 26, 2012",
            "publication": "Familylicious",
            "title": "Packing Makeup For Travel",
            "featured": false,
            "href": "http://familylicious.com/lay-n-go-review/"
          },
          {
            "date": "Nov 23, 2012",
            "publication": "Sweep Tight",
            "title": "Quick Storage for Makeup and Toys with Lay-n-Go",
            "featured": false,
            "href": "http://sweeptight.com/2012/11/quick-storage-for-makeup.html"
          },
          {
            "date": "Nov 23, 2012",
            "publication": "My Life a Work in Progress",
            "title": "Review: Lay-n-Go Activity Mat Lite",
            "featured": false,
            "href": "http://mylifeaworkinprogress.com/review-layngo-activity-mat-lite-from-pish-posh-baby/"
          },
          {
            "date": "Nov 23, 2012",
            "publication": "Homemaking Hacks",
            "title": "Lay-n-Go Lite and Cosmo Review",
            "featured": false,
            "href": "http://homemakinghacks.com/2012/11/lay-n-go-review.html"
          },
          {
            "date": "Nov 21, 2012",
            "publication": "Good N Crazy",
            "title": "GoodNCrazy Weekly Picks",
            "featured": false,
            "href": "http://goodncrazy.com/new-kids-app-journal-10-cosmo-bag-mg/"
          },
          {
            "date": "Nov 19, 2012",
            "publication": "Paperblog",
            "title": "Lay-n-Go Cosmo Mat – Great Makeup Invention",
            "featured": false,
            "href": "http://en.paperblog.com/lay-n-go-cosmo-mat-great-makeup-invention-356929/"
          },
          {
            "date": "Nov 19, 2012",
            "publication": "Homemaking Hacks",
            "title": "Lay-n-Go Cosmo: Wrap it up With a Bow!",
            "featured": false,
            "href": "http://homemakinghacks.com/2012/11/lay-n-go-review.html"
          },
          {
            "date": "Aug 19, 2012",
            "publication": "Mommy Kudos",
            "title": "Lego Cleanup Genius! Loving the Lay-n-Go!",
            "featured": false,
            "href": "http://www.mommykudos.com/2012/04/lego-cleanup-genius-loving-the-lay-n-go/"
          },
          {
            "date": "Jul 15, 2012",
            "publication": "Resourceful Blogger",
            "title": "Lay-n-Go Lite Activity Mat Review",
            "featured": false,
            "href": "http://www.resourcefulblogger.com/lay-n-go-lite-activity-mat-review/"
          },
          {
            "date": "Jun 22, 2012",
            "publication": "Makobiscribe",
            "title": "How To Keep Your Makeup Organized",
            "featured": false,
            "href": "http://makobiscribe.com/2012/06/how-to-keep-your-make-up-organized-from-lay-n-go-review.html"
          },
          {
            "date": "Jun 20, 2012",
            "publication": "Organizing Made Fun",
            "title": "Lay-n-Go Cosmo Giveaway",
            "featured": false,
            "href": "http://organizingmadefun.blogspot.com/2012/06/giveaway-lay-n-go-cosmo.html"
          },
          {
            "date": "Jun 16, 2012",
            "publication": "Play on Words",
            "title": "Best Finds to Build Language",
            "featured": false,
            "href": "http://playonwords.com/blog/2012/06/16/astra-marketplace-2012-best-new-finds-to-build-language/"
          },
          {
            "date": "Jun 9, 2012",
            "publication": "Joey Fortman",
            "title": "REAL MOM – This is a lifesaver!",
            "featured": false,
            "href": "http://www.joeyfortman.com/real-mom-holiday-picks/2012/6/9/lay-n-go-lite.html"
          },
          {
            "date": "Jun 5, 2012",
            "publication": "Trendy Mommies",
            "title": "Activity Mat, Make-Up Case, Carryall in One?",
            "featured": false,
            "href": "http://www.trendymommies.com/2012/06/05/activity-mat-make-up-case-carryall-in-one-layngo/"
          },
          {
            "date": "May 10, 2012",
            "publication": "The Dirty T-Shirt",
            "title": "Lay-n-Go COSMO Review",
            "featured": false,
            "href": "http://thedirtytshirt.com/lay-n-go-cosmo-review/"
          },
          {
            "date": "May 8, 2012",
            "publication": "Making the World Cuter",
            "title": "Lay-n-Go Lite Review",
            "featured": false,
            "href": "http://makingtheworldcuter.com/2012/11/lay-n-go-lite-giveaway/"
          },
          {
            "date": "May 4, 2012",
            "publication": "Mommy Living the Life of Riley",
            "title": "A Toy Carryall That Makes Cleanup, Storage and Travel a Breeze!",
            "featured": false,
            "href": "http://www.mommylivingthelifeofriley.com/product-reviews/lay-n-go-lite-toy-carryall-cleanup-storage-travel-breeze/"
          },
          {
            "date": "May 1, 2012",
            "publication": "Baby Center",
            "title": "6 Travel Must-Haves",
            "featured": false,
            "href": "http://blogs.babycenter.com/products_and_prizes/6-travel-must-haves-win/"
          },
          {
            "date": "Apr 23, 2012",
            "publication": "Mom Generations",
            "title": "Daily Diary: Mom Survival? Lay-n-Go",
            "featured": false,
            "href": "http://momgenerations.com/2012/04/daily-diary-mom-survival-lay-n-go/"
          },
          {
            "date": "Apr 16, 2012",
            "publication": "Milk and Cookies Blog",
            "title": "Teaching with Lego",
            "featured": false,
            "href": "http://milkandcookiesblog.com/teaching-with-legos-day-1/"
          },
          {
            "date": "Apr 3, 2012",
            "publication": "Superstar Babies",
            "title": "Play for Hours, Cleanup in Seconds with the Lay-n-Go!",
            "featured": false,
            "href": "http://superstarbabies.com/play-for-hours-cleanup-in-seconds-with-the-lay-n-go"
          },
          {
            "date": "Apr 2, 2012",
            "publication": "Mommy Kudos",
            "title": "Lego Cleanup Genius! Loving the Lay-N-Go!",
            "featured": false,
            "href": "http://www.mommykudos.com/2012/04/lego-cleanup-genius-loving-the-lay-n-go/"
          },
          {
            "date": "Mar 30, 2012",
            "publication": "Geek Alerts",
            "title": "Lay-n-Go LITE Construction Set Carrier",
            "featured": false,
            "href": "http://www.geekalerts.com/lay-n-go-construction-set-carrier/"
          },
          {
            "date": "Mar 29, 2012",
            "publication": "Mom's Minivan",
            "title": "101 Car Travel Games and Ideas for Kids",
            "featured": false,
            "href": "http://www.momsminivan.com/blog/2012/03/lay-n-go.html"
          },
          {
            "date": "Mar 26, 2012",
            "publication": "Cool Things",
            "title": "Lay-n-Go Is A Combo Playmat And Bag For Holding Small Toys",
            "featured": false,
            "href": "http://www.coolthings.com/lay-n-go-construction-set-carrier/"
          },
          {
            "date": "Mar 22, 2012",
            "publication": "Launch Grow Joy",
            "title": "Entrepreneur Success: How A Mompreneur Landed on TV – Twice",
            "featured": false,
            "href": "http://launchgrowjoy.com/mompreneur/#"
          },
          {
            "date": "Mar 18, 2012",
            "publication": "The Mommyhood Chronicles",
            "title": "Lay-N-Go Activity Mat – Perfect for those who need toys cleaned up easier!",
            "featured": false,
            "href": "http://www.the-mommyhood-chronicles.com/2012/03/lay-n-go-activity-mat-perfect-for-those-who-need-toys-cleaned-up-easier/"
          },
          {
            "date": "Mar 14, 2012",
            "publication": "Mommies Favourites (blogspot)",
            "title": "Looks Good – Lay-n-Go Review",
            "featured": false,
            "href": "http://mommiesfavourites.blogspot.com/2012/03/looks-good-lay-n-go.html"
          },
          {
            "date": "Mar 11, 2012",
            "publication": "Babble",
            "title": "10 Fun Ideas for LEGO Storage and Play",
            "featured": false,
            "href": "https://www.babble.com/kid/10-fun-ideas-for-lego-storage-and-play/"
          },
          {
            "date": "Mar 6, 2012",
            "publication": "Mama NYC",
            "title": "Lay-n-Go Activity Mat: On-the-Go and Easy Travel with Toys!",
            "featured": false,
            "href": "http://mamanyc.net/2012/03/lay-n-go-activity-mat-travel-with-toys-review/"
          },
          {
            "date": "Mar 2, 2012",
            "publication": "Patch / Greater Alexandria",
            "title": "Fort Hunt Couple Finds Success in Lay-n-Go",
            "featured": false,
            "href": "http://patch.com/virginia/greateralexandria/fort-hunt-couple-finds-success-in-lay-n-go-video"
          },
          {
            "date": "Mar 1, 2012",
            "publication": "The Funky Monkey",
            "title": "WARNING: Reading about this product will leave you desperately wanting one",
            "featured": false,
            "href": "http://www.thefunky-monkey.com/2012/03/lay-n-go-play-for-hourscleanup-in.html"
          },
          {
            "date": "Feb 29, 2012",
            "publication": "Traveling Mom",
            "title": "6 Travel Tips to Keep Kids Happy on Long Trips",
            "featured": false,
            "href": "http://www.travelingmom.com/tipsproducts/tips/4636-how-to-keep-kids-happy-on-long-trips.html"
          },
          {
            "date": "Feb 27, 2012",
            "publication": "Org Junkie",
            "title": "When Kid's Play Spaces Take over YOUR Spaces!",
            "featured": false,
            "href": "http://orgjunkie.com/2012/02/when-kids-play-spaces-take-over-your-spaces.html#comment-72197"
          },
          {
            "date": "Feb 23, 2012",
            "publication": "Modern Mom",
            "title": "Lay-n-Go on Modernmom.com",
            "featured": false,
            "href": "http://www.modernmom.com/must-haves/lay-n-go"
          },
          {
            "date": "Feb 23, 2012",
            "publication": "Macaroni Kid (NRV)",
            "title": "The Greatest Product: Lay-n-Go",
            "featured": false,
            "href": "http://nrv.macaronikid.com/article/249190/the-greatest-product-lay-n-go"
          },
          {
            "date": "Feb 20, 2012",
            "publication": "The Chatty Momma",
            "title": "1 Step Toy Cleanup – Lay-n-Go",
            "featured": false,
            "href": "http://www.thechattymomma.com/2012/02/1-step-toy-cleanup-lay-n-go-review.html"
          },
          {
            "date": "Feb 13, 2012",
            "publication": "Family Corner",
            "title": "Lay-n-Go Activity Pad",
            "featured": false,
            "href": "http://www.familycorner.com/forums/childrens-products/29667-lay-n-go-activity-pad.html"
          },
          {
            "date": "Feb 8, 2012",
            "publication": "Cocktails with Mom",
            "title": "Lay-n-Go Review: Invented by a Mompreneur",
            "featured": false,
            "href": "http://cocktailswithmom.com/2012/02/lay-n-go-review-invented-by-a-momprenuer/"
          },
          {
            "date": "Feb 2, 2012",
            "publication": "Simply Stacie",
            "title": "Lay-n-Go Product Review",
            "featured": false,
            "href": "http://www.simplystacie.net/2012/02/lay-n-go-review/"
          },
          {
            "date": "Jan 30, 2012",
            "publication": "247 Moms",
            "title": "Lay-n-Go LITE Product Focus",
            "featured": false,
            "href": "http://247moms.com/2012/01/win-lay-n-go-lite/"
          },
          {
            "date": "Jan 19, 2012",
            "publication": "The Giggle Guide",
            "title": "Lay-n-Go Helps Tidy Up in a Snap",
            "featured": false,
            "href": "http://thegiggleguide.com/grapevine/2012-01/lay-n-go-helps-tidy-snap"
          }
        ]
      },
      {
        "title": "📅 2011 Articles",
        "articles": [
          {
            "date": "Dec 1, 2011",
            "publication": "Macaroni Kid (Snoqualmie)",
            "title": "Lay-N-Go: Play for Hours, Clean Up in Seconds!",
            "featured": false,
            "href": "http://snoqualmievalley.macaronikid.com/article/212566/lay-n-go-play-for-hours-clean-up-in-seconds"
          },
          {
            "date": "Nov 29, 2011",
            "publication": "In the Know Mom",
            "title": "Containing the Playtime Mess { Lay-n-Go }",
            "featured": false,
            "href": "http://intheknowmom.net/?p=16168"
          },
          {
            "date": "Sep 28, 2011",
            "publication": "Org Junkie",
            "title": "Lay-n-Go Luggage Review and Lay-n-Go Lite Give-Away!",
            "featured": false,
            "href": "http://orgjunkie.com/2011/10/product-of-the-week-lay-n-go-lego-play-mat-clean-up-helper-and-storage-all-in-one.html"
          },
          {
            "date": "Sep 28, 2011",
            "publication": "Mommy Ramblings",
            "title": "Lay-n-Go and Lay-n-Go LITE Review!!!",
            "featured": false,
            "href": "http://www.mommyramblings.org/2011/09/28/lay-n-go-luggage-review-and-lay-n-go-lite-give-away/"
          },
          {
            "date": "Sep 9, 2011",
            "publication": "The Bragging Mommy",
            "title": "The Easy Way to Clean Up Toys ~ Lay-n-Go Mat Review",
            "featured": false,
            "href": "http://www.thebraggingmommy.com/2011/09/09/the-easy-way-to-clean-up-toys-lay-n-go-mat-review/"
          }
        ]
      }
    ]
  }
] as const;
