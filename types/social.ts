export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
}

export interface FriendOutfit {
  id: string;
  friendId: string;
  image: string;
  cutoutImage?: string; // The outfit cutout/silhouette
  isLiked: boolean;
  likes: number;
  postedAt: string;
  occasion?: string;
  weather?: string;
}

export interface OutfitLike {
  id: string;
  outfitId: string;
  userId: string;
  createdAt: string;
}