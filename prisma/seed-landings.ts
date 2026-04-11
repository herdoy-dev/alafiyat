import "dotenv/config";
import prisma from "../lib/prisma";
import {
  EMPTY_LANDING_CONTENT,
  type LandingContent,
  type LandingTemplate,
} from "../schemas/landing";

type LandingSeed = {
  slug: string;
  title: string;
  template: LandingTemplate;
  videoUrl?: string;
  content: LandingContent;
};

function trustBadges() {
  return [
    "Cash on delivery",
    "Free shipping over ৳2,000",
    "7-day easy returns",
    "Bangladesh nationwide",
  ];
}

function commonFaq() {
  return [
    {
      q: "How long does delivery take?",
      a: "Inside Dhaka 1–2 days, outside Dhaka 3–5 days. We dispatch with Pathao and Steadfast couriers.",
    },
    {
      q: "Can I pay cash on delivery?",
      a: "Yes — Cash on delivery is available everywhere in Bangladesh.",
    },
    {
      q: "Is it returnable?",
      a: "Absolutely. You have 7 days from delivery to return it for any reason.",
    },
    {
      q: "How do I track my order?",
      a: "We send a courier tracking link by SMS within 24 hours of dispatch.",
    },
  ];
}

const SEEDS: LandingSeed[] = [
  {
    slug: "demo-classic",
    title: "Classic — editorial showcase",
    template: "classic",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Limited drop · Spring 2026",
        headline: "Crafted for everyday devotion",
        subheadline:
          "Hand-picked by our team. Built to last for years, not seasons.",
        ctaLabel: "Order yours",
        badge: "Best seller",
      },
      benefits: [
        {
          icon: "",
          title: "Premium materials",
          body: "We source the best raw materials so every piece feels exceptional.",
        },
        {
          icon: "",
          title: "Tested by experts",
          body: "Quality-checked and approved before it ever reaches your door.",
        },
        {
          icon: "",
          title: "Loved by 10,000+",
          body: "Trusted by thousands of customers across Bangladesh.",
        },
      ],
      highlights: [
        {
          title: "Made the slow way",
          body: "Each unit is finished by hand, taking the time to get every detail right. No corner cutting, no rushing.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
        },
        {
          title: "Designed for your day",
          body: "Built around how you actually live — comfortable, practical, and quietly beautiful in every situation.",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      ],
      testimonials: [
        {
          name: "Tasnim R.",
          location: "Dhaka",
          quote:
            "Honestly the quality blew me away. Way better than what I expected for the price.",
          rating: 5,
        },
        {
          name: "Sajid K.",
          location: "Chittagong",
          quote:
            "Delivery was fast and the packaging was beautiful. Will definitely order again.",
          rating: 5,
        },
        {
          name: "Mim H.",
          location: "Sylhet",
          quote:
            "It became my daily essential within a week. Highly recommend.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Ready to make it yours?",
        subheadline:
          "Place your order in under a minute. Cash on delivery available.",
        ctaLabel: "Order now",
      },
      orderForm: {
        title: "Order in a minute",
        subtitle: "We confirm by phone before dispatching.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-bold",
    title: "Bold — high-impact ad page",
    template: "bold",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Viral right now",
        headline: "The one thing everyone is talking about",
        subheadline:
          "It sold out twice last month. Now it's back, and faster than ever.",
        ctaLabel: "Grab yours →",
        badge: "Trending",
      },
      benefits: [
        {
          icon: "",
          title: "10× faster",
          body: "Engineered to outperform anything else in its class.",
        },
        {
          icon: "",
          title: "Built tough",
          body: "Survives drops, spills, and your worst day.",
        },
        {
          icon: "",
          title: "Loved by influencers",
          body: "Featured in over 200 reels this month alone.",
        },
      ],
      highlights: [
        {
          title: "Every detail engineered for impact",
          body: "We didn't cut corners. Every component was chosen to deliver the strongest, most reliable result possible.",
          image:
            "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900",
        },
        {
          title: "Numbers that hit different",
          body: "Don't take our word for it. Test results show our product outperforms competitors by 3× in every category.",
          image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
        "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=600",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
      ],
      testimonials: [
        {
          name: "Rafiq A.",
          location: "Dhaka",
          quote:
            "I bought it after seeing a Facebook ad. Best impulse buy of the year.",
          rating: 5,
        },
        {
          name: "Nadia I.",
          location: "Khulna",
          quote: "It exceeded every expectation. Send to your friends too!",
          rating: 5,
        },
        {
          name: "Imran F.",
          location: "Rajshahi",
          quote:
            "Worth every taka. Quality is insane, and the delivery was super quick.",
          rating: 4,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Don't miss this drop",
        subheadline:
          "Stock is moving fast. Place your order while it's still available.",
        ctaLabel: "Order now",
      },
      orderForm: {
        title: "Lock in yours",
        subtitle: "Secure your unit in 60 seconds.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-minimal",
    title: "Minimal — quiet luxury",
    template: "minimal",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Made simple",
        headline: "Less, but better",
        subheadline:
          "One product. One purpose. Thoughtfully designed for the long run.",
        ctaLabel: "Order",
        badge: "",
      },
      benefits: [
        {
          icon: "",
          title: "Considered design",
          body: "Every line, every curve, chosen on purpose.",
        },
        {
          icon: "",
          title: "Honest materials",
          body: "Nothing hidden. What you see is what you get.",
        },
        {
          icon: "",
          title: "Made to last",
          body: "Built for years of daily use, not weeks.",
        },
      ],
      highlights: [
        {
          title: "Quiet by design",
          body: "We removed everything that didn't need to be there. What remains is essential — and unforgettable.",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      ],
      testimonials: [
        {
          name: "Anika S.",
          location: "Dhaka",
          quote:
            "It's the quiet things that you keep coming back to. This is one of them.",
          rating: 5,
        },
        {
          name: "Hasan M.",
          location: "Cumilla",
          quote: "Simple, beautiful, and exactly what I was looking for.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "One product. One choice.",
        subheadline: "Order yours below.",
        ctaLabel: "Order",
      },
      orderForm: {
        title: "Place your order",
        subtitle: "",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-vibrant",
    title: "Vibrant — playful FB-ad page",
    template: "vibrant",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Hot right now 🔥",
        headline: "Say hello to your new favorite thing",
        subheadline:
          "Trusted by thousands. Shipped daily across Bangladesh. Cash on delivery available.",
        ctaLabel: "Yes, I want one!",
        badge: "Free shipping",
      },
      benefits: [
        {
          icon: "",
          title: "So easy to use 😍",
          body: "No instructions needed. You'll figure it out in seconds.",
        },
        {
          icon: "",
          title: "Looks gorgeous ✨",
          body: "It's the gift you'd actually want to receive.",
        },
        {
          icon: "",
          title: "Loved by everyone 💖",
          body: "Over 10,000 happy customers can't be wrong.",
        },
      ],
      highlights: [
        {
          title: "Made for real life ☀️",
          body: "We built this for the way you actually live — busy days, big nights, and everything in between.",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
        },
        {
          title: "Delivered with love 💌",
          body: "Beautifully packed, gift-ready, and at your door faster than you'd expect.",
          image:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      ],
      testimonials: [
        {
          name: "Jannat A.",
          location: "Dhaka",
          quote: "Omg I love it so much, ordering another one as a gift! 💕",
          rating: 5,
        },
        {
          name: "Tareq B.",
          location: "Bogura",
          quote: "Quality is top tier. Worth way more than what I paid.",
          rating: 5,
        },
        {
          name: "Sumi N.",
          location: "Narayanganj",
          quote: "Came in 2 days, packed beautifully. So happy I ordered!",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Your turn 🎉",
        subheadline:
          "Tap the form, fill in your details, and we'll handle the rest.",
        ctaLabel: "Order now",
      },
      orderForm: {
        title: "One last step!",
        subtitle: "We'll call to confirm before dispatch.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-luxury",
    title: "Luxury — premium gift edition",
    template: "luxury",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "The Reserve Collection",
        headline: "An object of quiet beauty",
        subheadline:
          "Considered, crafted, and built to be passed down. Reserved for those who appreciate the difference.",
        ctaLabel: "Reserve yours",
        badge: "Limited",
      },
      benefits: [
        {
          icon: "",
          title: "Heritage craft",
          body: "Made by artisans using techniques refined over generations.",
        },
        {
          icon: "",
          title: "Numbered edition",
          body: "Only 200 pieces will ever be produced. Each is individually numbered.",
        },
        {
          icon: "",
          title: "Lifetime warranty",
          body: "We stand behind every piece for as long as you own it.",
        },
      ],
      highlights: [
        {
          title: "A piece worth keeping",
          body: "We designed it not to be replaced — but to age beautifully alongside you. Every mark, a memory.",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
        },
        {
          title: "The maker's hand",
          body: "Behind every detail is a craftsperson who has spent years refining their work. You can feel it.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
      ],
      testimonials: [
        {
          name: "Ms. Farzana",
          location: "Gulshan",
          quote:
            "Exceptional craftsmanship. It feels like an heirloom from the moment you unbox it.",
          rating: 5,
        },
        {
          name: "Mr. Rahman",
          location: "Banani",
          quote:
            "Worth every taka. The kind of quality you don't find anymore.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Reserve your piece",
        subheadline:
          "Limited to 200 pieces. We confirm each order personally before dispatch.",
        ctaLabel: "Reserve yours",
      },
      orderForm: {
        title: "Reserve",
        subtitle: "An advisor will contact you within 24 hours.",
      },
      trustBadges: [
        "Numbered edition",
        "Lifetime warranty",
        "Cash on delivery",
        "White-glove dispatch",
      ],
    },
  },
  {
    slug: "demo-editorial",
    title: "Editorial — magazine feature",
    template: "editorial",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Vol. 01 · The Feature",
        headline: "The object of the year",
        subheadline:
          "A design that stops conversations. An object that starts them. We spent six months with it to understand why.",
        ctaLabel: "Order now",
        badge: "Editor's pick",
      },
      benefits: [
        {
          icon: "",
          title: "Considered from every angle",
          body: "We studied how it sits, how it feels, how it ages. Nothing was left to chance.",
        },
        {
          icon: "",
          title: "Engineered to outlast trends",
          body: "Built with materials chosen for their longevity, not their unit economics.",
        },
        {
          icon: "",
          title: "A quiet revolution",
          body: "It doesn't shout. It just performs — every single day, for years.",
        },
      ],
      highlights: [
        {
          title: "The making of",
          body: "Every piece spends three weeks in production before it ships. Hand-finished, individually inspected, and signed off by the craftsperson who built it.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
        },
        {
          title: "The reception",
          body: "Reviewers called it inevitable. Buyers called it the one they'd keep forever. We call it the standard we want everything to meet.",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      ],
      testimonials: [
        {
          name: "Farah K.",
          location: "Dhaka",
          quote:
            "I bought it skeptical. Six months later it's the thing I recommend to everyone I know.",
          rating: 5,
        },
        {
          name: "Rafi M.",
          location: "Chittagong",
          quote:
            "Worth every taka. I've never been this sure about a purchase.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Read by many. Owned by few.",
        subheadline:
          "Join the quiet minority who refuse to compromise. Place your order below.",
        ctaLabel: "Reserve yours",
      },
      orderForm: {
        title: "Place your order",
        subtitle: "We confirm by phone before dispatching.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-tech",
    title: "Tech — dark futuristic",
    template: "tech",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "SYSTEM v2.0.1",
        headline: "Built for the next decade",
        subheadline:
          "Hardware precision meets thoughtful software. Ships with a 2-year warranty and lifetime firmware updates.",
        ctaLabel: "Execute order",
        badge: "In stock",
      },
      benefits: [
        {
          icon: "",
          title: "10× faster boot",
          body: "From cold start to usable in under 1.2 seconds. We benchmarked every component.",
        },
        {
          icon: "",
          title: "Zero-config pairing",
          body: "Works out of the box with any device. No drivers, no apps, no setup screens.",
        },
        {
          icon: "",
          title: "Military-grade durability",
          body: "IP67 rated. Tested to survive drops, spills, dust, and daily abuse.",
        },
      ],
      highlights: [
        {
          title: "Engineered at the silicon level",
          body: "Custom chipset co-designed with our manufacturing partner. Every transistor placed for performance and power efficiency.",
          image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900",
        },
        {
          title: "Benchmarks that hold up",
          body: "Outperforms the nearest competitor by 3× in sustained workloads. Independent lab results published on our site.",
          image:
            "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      ],
      testimonials: [
        {
          name: "Tanvir H.",
          location: "Dhaka",
          quote:
            "Does exactly what it says on the tin. Fast, quiet, and it just works.",
          rating: 5,
        },
        {
          name: "Imran S.",
          location: "Sylhet",
          quote:
            "I've been running mine daily for 3 months. Zero issues. Solid build.",
          rating: 5,
        },
        {
          name: "Nadia R.",
          location: "Khulna",
          quote:
            "The firmware updates keep adding features. Feels like I got more than I paid for.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Ready to deploy",
        subheadline:
          "Limited units in stock. Ships within 24 hours of payment confirmation.",
        ctaLabel: "Deploy order",
      },
      orderForm: {
        title: "Initialize order",
        subtitle: "Confirmation via SMS within 30 minutes.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-nature",
    title: "Nature — organic and earthy",
    template: "nature",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Rooted in quality",
        headline: "From earth, to home",
        subheadline:
          "Made with natural materials and a gentle hand. Designed to age beautifully with you.",
        ctaLabel: "Bring it home",
        badge: "Eco-friendly",
      },
      benefits: [
        {
          icon: "",
          title: "Natural materials",
          body: "Sourced responsibly from suppliers who share our values. No shortcuts, no synthetics.",
        },
        {
          icon: "",
          title: "Gently made",
          body: "Crafted in small batches by people who take pride in their work.",
        },
        {
          icon: "",
          title: "Kind to everything",
          body: "Safe for your home, your family, and the planet. That's the whole point.",
        },
      ],
      highlights: [
        {
          title: "Grown, not manufactured",
          body: "Our materials come from farms that practice regenerative agriculture. The soil is better after we harvest than before.",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
        },
        {
          title: "Slow by design",
          body: "We can't rush this. Some things take time, and the result is worth the wait. Thank you for being patient with us.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
      ],
      testimonials: [
        {
          name: "Rubina A.",
          location: "Sylhet",
          quote:
            "It smells like the forest. It feels like home. I love everything about it.",
          rating: 5,
        },
        {
          name: "Priya D.",
          location: "Dhaka",
          quote:
            "You can tell it was made with care. That matters to me.",
          rating: 5,
        },
        {
          name: "Hasan R.",
          location: "Rajshahi",
          quote:
            "Sustainable AND beautiful. Finally, a product that does both.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Plant the seed",
        subheadline:
          "Place your order below. We'll send it to you with love, carefully packed.",
        ctaLabel: "Order with love",
      },
      orderForm: {
        title: "Yours to keep",
        subtitle: "We'll confirm by phone before dispatch.",
      },
      trustBadges: [
        "Natural materials",
        "Cash on delivery",
        "Free shipping over ৳2,000",
        "Kind to the planet",
      ],
    },
  },
  {
    slug: "demo-retro",
    title: "Retro — 80s neon energy",
    template: "retro",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "LIMITED EDITION",
        headline: "Back to the good stuff",
        subheadline:
          "We brought back the vibe. Loud, proud, and built different. Only 500 units made.",
        ctaLabel: "Grab one",
        badge: "HOT",
      },
      benefits: [
        {
          icon: "",
          title: "Built like a tank",
          body: "They used to make things to last. We still do.",
        },
        {
          icon: "",
          title: "Loud on purpose",
          body: "If you want quiet, buy something else. This one's here to be noticed.",
        },
        {
          icon: "",
          title: "Collector grade",
          body: "Numbered, individually packaged, and instantly recognizable.",
        },
      ],
      highlights: [
        {
          title: "The comeback nobody saw coming",
          body: "We thought this style was gone forever. Then we tried to design something new and realized — the original was just better. So we brought it back.",
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900",
        },
        {
          title: "Fits in anywhere but stands out everywhere",
          body: "Pairs with everything. Takes the spotlight effortlessly. You'll know it when you see it.",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      ],
      testimonials: [
        {
          name: "Shakib A.",
          location: "Dhaka",
          quote:
            "This is SO MY VIBE. Cannot believe I own this. 10/10 would recommend.",
          rating: 5,
        },
        {
          name: "Mim N.",
          location: "Chittagong",
          quote: "Turned every head at the party. Worth every taka.",
          rating: 5,
        },
        {
          name: "Tareq B.",
          location: "Bogura",
          quote:
            "Already ordered a second one. They're going fast — don't sleep on this!",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Don't miss the drop",
        subheadline:
          "Only 500 units. Once they're gone, they're gone. Grab yours now.",
        ctaLabel: "Order now",
      },
      orderForm: {
        title: "Lock it in",
        subtitle: "Limited stock. Confirmation by phone within an hour.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-split",
    title: "Split — fashion editorial",
    template: "split",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Spring / Summer 26",
        headline: "A new silhouette",
        subheadline:
          "Cut with intention. Finished by hand. Designed to move with you.",
        ctaLabel: "Shop now",
        badge: "New arrival",
      },
      benefits: [
        {
          icon: "",
          title: "Perfect drape",
          body: "Every seam finished by hand for a silhouette that moves the way you do.",
        },
        {
          icon: "",
          title: "All-day comfort",
          body: "Soft enough to sleep in. Structured enough to show up in.",
        },
        {
          icon: "",
          title: "Made to last",
          body: "Twice the stitches, half the shrinkage. Wash it and wear it for years.",
        },
      ],
      highlights: [
        {
          title: "Cut by hand",
          body: "Every pattern piece is hand-cut by artisans with 20+ years of experience. Machines can't match the precision of someone who's spent their life perfecting this craft.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900",
        },
        {
          title: "Built to move",
          body: "We tested this in real life. Walking, sitting, reaching, dancing. It moves with you, never against you.",
          image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      ],
      testimonials: [
        {
          name: "Maya R.",
          location: "Dhaka",
          quote:
            "The fit is everything. I've tried dozens and this one just works.",
          rating: 5,
        },
        {
          name: "Samir K.",
          location: "Chittagong",
          quote: "Quality you can feel the moment you put it on.",
          rating: 5,
        },
        {
          name: "Anika S.",
          location: "Sylhet",
          quote: "Finally, something that fits right and lasts. Ordering more.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Yours, made to last",
        subheadline:
          "Select your size and we'll ship within 48 hours. Free exchanges within 7 days.",
        ctaLabel: "Place order",
      },
      orderForm: {
        title: "Order",
        subtitle: "Confirmation via phone within 24 hours.",
      },
      trustBadges: trustBadges(),
    },
  },
  {
    slug: "demo-urban",
    title: "Urban — streetwear drop",
    template: "urban",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    content: {
      ...EMPTY_LANDING_CONTENT,
      hero: {
        eyebrow: "Volume 01 / Drop 001",
        headline: "Fresh off the blocks",
        subheadline:
          "Limited run. Once they're gone, they're gone. No restocks. No second chances.",
        ctaLabel: "Cop now",
        badge: "Limited",
      },
      benefits: [
        {
          icon: "",
          title: "Street-tested",
          body: "Worn by the people who actually know. Put through real use before it ever dropped.",
        },
        {
          icon: "",
          title: "Numbered edition",
          body: "500 units. Each one numbered. Your piece of the drop, forever.",
        },
        {
          icon: "",
          title: "No restocks",
          body: "When it sells out, it's done. That's the deal. No sequels, no reissues.",
        },
      ],
      highlights: [
        {
          title: "Designed in the streets",
          body: "We built this with the community that wears it. Every detail came from feedback, criticism, and late-night sketch sessions with the kids who actually know what's up.",
          image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
        },
        {
          title: "Built to be seen",
          body: "Nothing quiet about this one. It demands attention and rewards the people who spotted it first.",
          image:
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900",
        },
      ],
      gallery: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
      ],
      testimonials: [
        {
          name: "Shohan M.",
          location: "Dhaka",
          quote: "Been waiting for this drop for months. Worth every second.",
          rating: 5,
        },
        {
          name: "Rakib H.",
          location: "Narayanganj",
          quote:
            "Quality is fire. Got compliments from everyone I know. Copping the next drop for sure.",
          rating: 5,
        },
        {
          name: "Jui A.",
          location: "Gazipur",
          quote: "No cap, this is the best thing I've ordered this year.",
          rating: 5,
        },
      ],
      faq: commonFaq(),
      finalCta: {
        headline: "Cop it before it's gone",
        subheadline:
          "500 units. When they're gone, they're gone. Place your order below.",
        ctaLabel: "Cop now",
      },
      orderForm: {
        title: "Secure yours",
        subtitle: "First come, first served. No refunds on limited drops.",
      },
      trustBadges: [
        "Numbered edition",
        "No restocks",
        "Cash on delivery",
        "Ships within 48h",
      ],
    },
  },
];

async function main() {
  // Pick the most recent product to attach all 5 demo landings to
  const product = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (!product) {
    console.error(
      "No products in database. Create at least one product before seeding landings."
    );
    process.exit(1);
  }

  console.log(`Using product: ${product.name} (${product.id})`);

  for (const seed of SEEDS) {
    const data = {
      slug: seed.slug,
      title: seed.title,
      productId: product.id,
      template: seed.template,
      status: "published",
      videoUrl: seed.videoUrl ?? null,
      content: seed.content,
    };

    const existing = await prisma.landing.findUnique({
      where: { slug: seed.slug },
    });

    if (existing) {
      await prisma.landing.update({
        where: { slug: seed.slug },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      });
      console.log(`✓ Updated /l/${seed.slug}`);
    } else {
      await prisma.landing.create({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: data as any,
      });
      console.log(`✓ Created /l/${seed.slug}`);
    }
  }

  console.log(`\nDone. ${SEEDS.length} landings seeded.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
