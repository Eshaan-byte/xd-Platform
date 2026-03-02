export type Review = { user: string; date: string; rating: number; text: string };

export type Game = {
  id: number;
  title: string;
  slug: string;            // "gta-v"
  price?: string;
  originalPrice?: string;
  cover: string;           // big hero
  thumb: string;           // small box art
  gallery?: string[];      // additional images
  publisher?: string;
  releaseDate?: string;
  rating?: number;         // 0..5
  platforms?: string[];    // ["PS5","Xbox","PC","Steam"]
  tags?: string[];         // used for "More like this"
  description?: string;     // <-- About section
  reviews?: Review[];
};

export const slugify = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const games: Game[] = [
{
    id: 10,
    title: "GTA V",
    slug: "gta-v",
    price: "$29.99",
    originalPrice: "$59.99",
    cover: "/images/gta/gta-cover.jpg",
    thumb: "/images/gta/gta-thumb-1.jpg",
    gallery: [
        "/images/gta/gta-cover.jpg",
        "/images/gta/gta-thumb-2.jpg",
        "/images/gta/gta-thumb-3.jpg",
        "/images/gta/gta-thumb-4.jpg",
        "/images/gta/gta-thumb-5.jpg",
    ],
    publisher: "Rockstar Games",
    releaseDate: "Sep 17, 2013",
    rating: 5,
    platforms: ["PS4/5", "Xbox", "PC", "Steam"],
    tags: ["action", "open-world"],
    description:
        "Grand Theft Auto V blends open-world freedom with cinematic missions set in Los Santos. Switch among three protagonists, pull off heists, and dive into GTA Online with friends.",
    reviews: [
        { user: "Whitepepperoni", date: "March 10, 2025", rating: 5, text: "Mission design is peak. 60+ hours and still finding new routes." },
        { user: "Alex Moreno", date: "March 8, 2025", rating: 4, text: "Great sandbox and polish. Tutorial pacing could be gentler." },
    ],
},

  {
    id: 11,
    title: "Rocket League",
    slug: "rocket-league",
    price: "$14.99",
    cover: "/images/games/rocket-league.jpg",
    thumb: "/images/games/rocket-league.jpg",
    gallery: ["/images/games/rocket-league.jpg"],
    publisher: "Psyonix",
    releaseDate: "Jul 7, 2015",
    rating: 4,
    platforms: ["PS4/5", "Xbox", "PC", "Steam"],
    tags: ["sports", "multiplayer"],
  },
  // ADD MORE GAMES HERE
];

export const gameBySlug = (slug: string) =>
  games.find((g) => g.slug === slug);
