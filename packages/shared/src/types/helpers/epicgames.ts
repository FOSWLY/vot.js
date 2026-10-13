export type VideoCaption = {
  srclang: string;
  type: "captions";
  src: string;
};

export type VideoSources =
  | VideoCaption
  | {
      src: string;
      type: "quicksilver";
    };

export type VideoBlock = {
  type: "video";
  video_id: string;
  provider: string;
  caption: string;
  autoplay: boolean;
};

export type Link = {
  url: string;
  name: string;
  category: "useful_links";
};

export type LinkGroupBlock = {
  type: "link_group";
  links: Link[];
};

export type Post = {
  // not complete, only the necessary types
  id: number;
  hash_id: string;
  slug: string;
  title: string;
  description: string;
  locale: string; // en-us
  blocks: [VideoBlock, LinkGroupBlock]; // now useless
  status: "published";
};
