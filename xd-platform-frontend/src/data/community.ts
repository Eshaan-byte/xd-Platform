// src/data/community.ts
export type CommunityPost = {
  id: number;
  slug: string;                 // e.g., "xdgss-makes-gaming-feel-smoother"
  title: string;
  image: string;                // hero image
  thumb?: string;               // small sidebar thumb (optional)
  comments: number;
  likes: number;
  author: string;
  date: string;                 // display-ready
  excerpt?: string;
  content: string[];            // paragraphs for the detail page
  more?: {                      // 2-up “More from the community”
    title: string;
    image: string;
    slug: string;
    comments: number;
    likes: number;
    author: string;
    date: string;
  }[];
  featured?: boolean;           // for the listing page
};

export const communityPosts: CommunityPost[] = [
  {
    id: 1,
    slug: "xdgss-makes-gaming-feel-smoother",
    title:
      "Gotta say, XDGSS makes gaming feel smoother and more fun than anything I’ve tried before.",
    image: "/images/community/featured.svg",
    thumb: "/images/community/featured.svg",
    comments: 12,
    likes: 22,
    author: "John Adam",
    date: "August 23, 2025",
    content: [
      "Gotta say, XDGSS makes gaming feel smoother and more fun than I’ve tried before. This isn’t just incremental—it's a fundamental change to responsiveness and flow.",
      "The secret is the high-definition camera and sensitivity optimization. In games where every millisecond counts, visual feedback and input control is everything.",
      "In GTA-style racing and high-octane action, micro-stutters can cost shots or turns. With XDGSS the camera transitions feel effortless—no tearing, no judder—so your reactions stay fast.",
    ],
    more: [
      {
        title: "Who is Sonicfox?",
        image: "/images/community/card-3.jpg",
        slug: "who-is-sonicfox",
        comments: 12,
        likes: 22,
        author: "John Adam",
        date: "August 23, 2025",
      },
      {
        title: "NFS hacks to kill for!",
        image: "/images/community/card-4.jpg",
        slug: "nfs-hacks-to-kill-for",
        comments: 12,
        likes: 22,
        author: "John Adam",
        date: "August 23, 2025",
      },
    ],
    featured: true,
  },
  // add more posts as needed
];

export const getPostBySlug = (slug: string) =>
  communityPosts.find((p) => p.slug === slug);
