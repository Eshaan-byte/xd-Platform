import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Game } from '../models/Game.js';
import { User } from '../models/User.js';
import { CommunityPost } from '../models/CommunityPost.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-platform';
const RAWG_API_KEY = process.env.RAWG_API_KEY || '';

// ── RAWG game slugs to fetch ──────────────────────────────────────────
// These are real RAWG slugs — find any game at https://rawg.io
const RAWG_SLUGS = [
  'grand-theft-auto-v',
  'rocket-league',
  'fortnite',
  'red-dead-redemption-2',
  'alan-wake-2',
  'need-for-speed-unbound',
  'resident-evil-3',
  'chivalry-2',
  'deus-ex-human-revolution-directors-cut',
  'the-witcher-3-wild-hunt',
  'cyberpunk-2077',
  'elden-ring',
  'god-of-war-ragnarok-2',
  'horizon-zero-dawn',
  'the-last-of-us-part-2',
  'minecraft',
  'call-of-duty-modern-warfare-iii',
  'apex-legends',
  'valorant',
  'dark-souls-iii',
  'shadows-die-twice',
  'hades-2018',
  'stardew-valley',
  'marvels-spider-man-remastered',
  'mortal-kombat-1-2023',
  'street-fighter-6',
  'tekken-8',
  'star-wars-jedi-survivor',
  'hogwarts-legacy',
  'baldurs-gate-3',
  'diablo-iv',
  'overwatch-2',
  'destiny-2',
  'monster-hunter-world-2',
  'death-stranding',
  'ghost-of-tsushima',
  'hollow-knight',
  'celeste',
  'it-takes-two',
  'palworld',
  'helldivers-2',
  'lies-of-p',
  'dead-space-5',
  'hitman-3',
  'remnant-ii',
  'black-myth-wukong',
  'assassins-creed-valhalla',
  'god-of-war-2',
];

// ── Tag mapping: RAWG genre → our tags ─────────────────────────────────
const GENRE_TO_TAG: Record<string, string> = {
  action: 'action',
  adventure: 'adventure',
  rpg: 'rpg',
  shooter: 'action',
  strategy: 'simulation',
  puzzle: 'casual',
  racing: 'racing',
  sports: 'sports',
  simulation: 'simulation',
  fighting: 'fighting',
  platformer: 'casual',
  'massively-multiplayer': 'multiplayer',
  indie: 'casual',
  casual: 'casual',
};

// ── Platform mapping: RAWG platform → display name ─────────────────────
function mapPlatform(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('playstation 5')) return 'PS5';
  if (n.includes('playstation 4')) return 'PS4/5';
  if (n.includes('playstation')) return 'PS4/5';
  if (n.includes('xbox series')) return 'Xbox';
  if (n.includes('xbox one')) return 'Xbox';
  if (n.includes('xbox')) return 'Xbox';
  if (n.includes('nintendo switch')) return 'Switch';
  if (n === 'pc') return 'PC';
  return null;
}

// ── Fetch game data from RAWG ──────────────────────────────────────────
async function fetchRawgGame(slug: string, retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const url = `https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`;
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status === 502 || res.status === 503 || res.status === 429) {
      if (attempt < retries) {
        process.stdout.write(` (retry ${attempt})...`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
    }
    console.warn(`  ⚠ RAWG: ${slug} → ${res.status}`);
    return null;
  }
  return null;
}

async function fetchRawgScreenshots(gameId: number) {
  const url = `https://api.rawg.io/api/games/${gameId}/screenshots?key=${RAWG_API_KEY}&page_size=5`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: any = await res.json();
  return (data.results || []).map((s: any) => s.image as string);
}

// ── Fetch price from CheapShark ────────────────────────────────────────
async function fetchCheapSharkPrice(title: string): Promise<{ price: string; originalPrice?: string } | null> {
  try {
    const url = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(title)}&limit=1&exact=0`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: any = await res.json();
    if (!data || data.length === 0) return null;
    const game = data[0];
    const cheapest = parseFloat(game.cheapest);
    if (cheapest === 0) return { price: 'Free' };
    return {
      price: `$${cheapest.toFixed(2)}`,
      originalPrice: game.cheapestDealID ? undefined : undefined,
    };
  } catch {
    return null;
  }
}

// ── Format release date ────────────────────────────────────────────────
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ── Build game object from API data ────────────────────────────────────
async function buildGameFromRawg(slug: string) {
  const rawg = await fetchRawgGame(slug);
  if (!rawg) return null;

  const screenshots = await fetchRawgScreenshots(rawg.id);
  const priceData = await fetchCheapSharkPrice(rawg.name);

  // Map genres to our tags
  const tags = [...new Set(
    (rawg.genres || [])
      .map((g: any) => GENRE_TO_TAG[g.slug] || g.slug)
      .filter(Boolean)
  )];

  // Check if it's open-world (from tags in RAWG)
  const rawgTags = (rawg.tags || []).map((t: any) => t.slug);
  if (rawgTags.includes('open-world') && !tags.includes('open-world')) {
    tags.push('open-world');
  }
  if (rawgTags.includes('multiplayer') && !tags.includes('multiplayer')) {
    tags.push('multiplayer');
  }

  // Map platforms
  const platforms = [...new Set(
    (rawg.platforms || [])
      .map((p: any) => mapPlatform(p.platform.name))
      .filter(Boolean) as string[]
  )];

  // Publisher
  const publisher = rawg.publishers?.[0]?.name || rawg.developers?.[0]?.name || 'Unknown';

  // Our slug (use RAWG slug but cleaned up)
  const ourSlug = rawg.slug;

  // Cover image from RAWG CDN
  const cover = rawg.background_image || '';
  const additionalImage = rawg.background_image_additional || '';

  // Build gallery: cover + additional + screenshots
  const gallery = [cover, ...(additionalImage ? [additionalImage] : []), ...screenshots].filter(Boolean).slice(0, 5);

  // Rating: RAWG rating is 0-5, round to nearest int
  const rating = Math.round(rawg.rating || 0);

  return {
    title: rawg.name,
    slug: ourSlug,
    price: priceData?.price || '$59.99',
    originalPrice: priceData?.originalPrice,
    cover,
    thumb: gallery[1] || cover, // use second image as thumb for variety
    thumbnail: gallery[1] || cover,
    gallery,
    publisher,
    releaseDate: formatDate(rawg.released),
    rating: Math.min(rating, 5),
    platforms,
    tags: tags.slice(0, 4), // limit tags
    description: rawg.description_raw?.slice(0, 500) || `${rawg.name} — an amazing game.`,
  };
}

// ── Community posts (keep hardcoded — these are platform-specific) ──────
const communityPosts = [
  {
    slug: 'xdgss-makes-gaming-feel-smoother',
    title: 'Gotta say, XDGSS makes gaming feel smoother and more fun than anything I\'ve tried before.',
    image: '/images/community/featured.svg',
    thumb: '/images/community/featured.svg',
    comments: 12,
    likes: 22,
    author: 'John Adam',
    date: 'August 23, 2025',
    content: [
      'Gotta say, XDGSS makes gaming feel smoother and more fun than I\'ve tried before. This isn\'t just incremental\u2014it\'s a fundamental change to responsiveness and flow.',
      'The secret is the high-definition camera and sensitivity optimization. In games where every millisecond counts, visual feedback and input control is everything.',
      'In GTA-style racing and high-octane action, micro-stutters can cost shots or turns. With XDGSS the camera transitions feel effortless\u2014no tearing, no judder\u2014so your reactions stay fast.',
    ],
    more: [
      {
        title: 'Who is Sonicfox?',
        image: '/images/community/card-3.jpg',
        slug: 'who-is-sonicfox',
        comments: 12,
        likes: 22,
        author: 'John Adam',
        date: 'August 23, 2025',
      },
      {
        title: 'NFS hacks to kill for!',
        image: '/images/community/card-4.jpg',
        slug: 'nfs-hacks-to-kill-for',
        comments: 12,
        likes: 22,
        author: 'John Adam',
        date: 'August 23, 2025',
      },
    ],
    featured: true,
  },
  {
    slug: 'who-is-sonicfox',
    title: 'Who is Sonicfox?',
    image: '/images/community/card-3.jpg',
    thumb: '/images/community/card-3.jpg',
    comments: 12,
    likes: 22,
    author: 'John Adam',
    date: 'August 23, 2025',
    content: [
      'SonicFox is one of the most decorated fighting game players in esports history, dominating titles like Mortal Kombat, Dragon Ball FighterZ, and Skullgirls.',
      'Known for their incredible adaptability and technical skill, SonicFox has won multiple EVO championships and is a fan favorite in the FGC community.',
    ],
    featured: false,
  },
  {
    slug: 'nfs-hacks-to-kill-for',
    title: 'NFS hacks to kill for!',
    image: '/images/community/card-4.jpg',
    thumb: '/images/community/card-4.jpg',
    comments: 12,
    likes: 22,
    author: 'John Adam',
    date: 'August 23, 2025',
    content: [
      'Need for Speed Unbound has some of the most satisfying driving mechanics in the series. Here are some tips to dominate the streets.',
      'Master the drift boost mechanic \u2014 chain drifts around corners to build up your boost meter and unleash it on straightaways.',
      'Use the alley shortcuts in Lakeshore City to cut through traffic and lose the cops faster. Knowing the map is half the battle.',
    ],
    featured: false,
  },
];

// ── Main seed function ─────────────────────────────────────────────────
async function seed(): Promise<void> {
  if (!RAWG_API_KEY) {
    console.error('❌ RAWG_API_KEY is required. Get a free key at https://rawg.io/apidocs');
    console.error('   Add RAWG_API_KEY=your_key to your .env file');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Game.deleteMany({}),
      User.deleteMany({}),
      CommunityPost.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Fetch and seed games from RAWG + CheapShark
    console.log(`\nFetching ${RAWG_SLUGS.length} games from RAWG API...`);
    const games: any[] = [];
    for (const slug of RAWG_SLUGS) {
      process.stdout.write(`  Fetching: ${slug}...`);
      const game = await buildGameFromRawg(slug);
      if (game) {
        games.push(game);
        console.log(` ✓ ${game.title} (${game.price})`);
      } else {
        console.log(` ✗ skipped`);
      }
      // Rate limit: be polite to RAWG API
      await new Promise((r) => setTimeout(r, 500));
    }

    await Game.insertMany(games);
    console.log(`\nSeeded ${games.length} games with real images & data`);

    // Seed community posts
    await CommunityPost.insertMany(communityPosts);
    console.log(`Seeded ${communityPosts.length} community posts`);

    // Seed test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await User.create({
      email: 'test@xd.com',
      password: hashedPassword,
      username: 'TestUser',
      role: 'user',
    });

    // Seed admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      email: 'admin@xd.com',
      password: adminPassword,
      username: 'Admin',
      role: 'admin',
    });

    console.log('Seeded 2 users (test@xd.com / password123, admin@xd.com / admin123)');
    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
