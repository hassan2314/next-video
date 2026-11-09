export const DEMO_CHANNEL_ID = "demo-channel";

/** Obviously fake account created by `npm run seed`. Not a real secret. */
export const DEMO_ACCOUNT = {
  email: "demo@nextvideo.example",
  password: "demopassword",
  name: "Open Movie Channel",
  image: "/demo/avatar.svg",
};

export const DEMO_OWNER = {
  _id: DEMO_CHANNEL_ID,
  name: DEMO_ACCOUNT.name,
  image: DEMO_ACCOUNT.image,
  email: DEMO_ACCOUNT.email,
};

export type DemoClip = {
  id: string;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  createdAt: string;
  views: number;
};

/**
 * Freely licensed sample clips. Remote files stay on their original hosts.
 * Posters in /public/demo are single frames extracted from those same clips.
 */
export const DEMO_CLIPS: DemoClip[] = [
  {
    id: "demo-flower",
    title: "Wildflowers",
    description:
      "Sample clip of wildflowers. CC0, from the MDN interactive-examples media set (media/cc0-videos/flower.mp4).",
    video:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    thumbnail: "/demo/flower.jpg",
    createdAt: "2020-08-01T00:00:00.000Z",
    views: 0,
  },
  {
    id: "demo-blue-flowers",
    title: "Blue Flowers",
    description:
      "Sample clip. CC0 (public domain dedication) by Zuzanna Musial, via Wikimedia Commons: File:Close-up_View_Of_Blue_Flowers.webm.",
    video:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Close-up_View_Of_Blue_Flowers.webm",
    thumbnail: "/demo/blue-flowers.jpg",
    createdAt: "2021-06-12T00:00:00.000Z",
    views: 0,
  },
  {
    id: "demo-flower-moon",
    title: "Flower Moon",
    description:
      "Sample clip of the May 2024 flower moon. CC0 by Roesalow, via Wikimedia Commons: File:Flower_Moon_May_2nd_2024.webm.",
    video:
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/Flower_Moon_May_2nd_2024.webm",
    thumbnail: "/demo/flower-moon.jpg",
    createdAt: "2024-05-02T00:00:00.000Z",
    views: 0,
  },
  {
    id: "demo-sintel",
    title: "Sintel trailer",
    description:
      "Official trailer for Sintel, a Blender Foundation open movie. Creative Commons Attribution 3.0. Source: download.blender.org. © copyright Blender Foundation | sintel.org.",
    video: "https://download.blender.org/durian/trailer/sintel_trailer-480p.mp4",
    thumbnail: "/demo/sintel.jpg",
    createdAt: "2010-09-30T00:00:00.000Z",
    views: 0,
  },
  {
    id: "demo-big-buck-bunny",
    title: "Big Buck Bunny",
    description:
      "Ten-second excerpt of Big Buck Bunny, a Blender Foundation open movie. Creative Commons Attribution 3.0. © copyright Blender Foundation | peach.blender.org.",
    video:
      "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
    thumbnail: "/demo/big-buck-bunny.jpg",
    createdAt: "2008-05-20T00:00:00.000Z",
    views: 0,
  },
];

export type PublicVideo = {
  _id: string;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  views: number;
  createdAt: string;
  owner: typeof DEMO_OWNER;
  likes: string[];
  dislikes: string[];
  controls: boolean;
};

const viewCounts = new Map<string, number>();
const reactions = new Map<
  string,
  { likes: Set<string>; dislikes: Set<string> }
>();
const demoSubscribers = new Set<string>();

export function isDemoClipId(id: string) {
  return DEMO_CLIPS.some((clip) => clip.id === id);
}

export function isDemoChannelId(id: string) {
  return id === DEMO_CHANNEL_ID;
}

function reactionState(id: string) {
  let state = reactions.get(id);
  if (!state) {
    state = { likes: new Set(), dislikes: new Set() };
    reactions.set(id, state);
  }
  return state;
}

export function currentDemoViews(id: string) {
  const clip = DEMO_CLIPS.find((item) => item.id === id);
  if (!clip) return 0;
  return viewCounts.get(id) ?? clip.views;
}

export function bumpDemoViews(id: string) {
  if (!isDemoClipId(id)) return null;
  const next = currentDemoViews(id) + 1;
  viewCounts.set(id, next);
  return next;
}

export function getDemoVideo(id: string): PublicVideo | null {
  const clip = DEMO_CLIPS.find((item) => item.id === id);
  if (!clip) return null;
  const state = reactions.get(id);
  return {
    _id: clip.id,
    title: clip.title,
    description: clip.description,
    video: clip.video,
    thumbnail: clip.thumbnail,
    views: currentDemoViews(id),
    createdAt: clip.createdAt,
    owner: DEMO_OWNER,
    likes: state ? Array.from(state.likes) : [],
    dislikes: state ? Array.from(state.dislikes) : [],
    controls: true,
  };
}

export function getDemoVideos(): PublicVideo[] {
  return DEMO_CLIPS.map((clip) => getDemoVideo(clip.id)!);
}

export function toggleDemoLike(id: string, userId: string) {
  const state = reactionState(id);
  const hasLiked = state.likes.has(userId);
  if (hasLiked) {
    state.likes.delete(userId);
  } else {
    state.likes.add(userId);
    state.dislikes.delete(userId);
  }
  return {
    liked: !hasLiked,
    disliked: false,
    likesCount: state.likes.size,
    dislikesCount: state.dislikes.size,
  };
}

export function toggleDemoDislike(id: string, userId: string) {
  const state = reactionState(id);
  const hasDisliked = state.dislikes.has(userId);
  if (hasDisliked) {
    state.dislikes.delete(userId);
  } else {
    state.dislikes.add(userId);
    state.likes.delete(userId);
  }
  return {
    disliked: !hasDisliked,
    liked: false,
    likesCount: state.likes.size,
    dislikesCount: state.dislikes.size,
  };
}

export function demoSubscriberCount() {
  return demoSubscribers.size;
}

export function isDemoSubscribed(userId: string) {
  return demoSubscribers.has(userId);
}

export function toggleDemoSubscription(userId: string) {
  if (demoSubscribers.has(userId)) {
    demoSubscribers.delete(userId);
  } else {
    demoSubscribers.add(userId);
  }
  return {
    subscribed: demoSubscribers.has(userId),
    subscribersCount: demoSubscribers.size,
  };
}
