export type VideoCaption = {
    signed_url: string;
    locale: string;
};
export type VideoBlock = {
    type: "video";
    video_id: string;
    provider: string;
    caption: string;
    autoplay: boolean;
    video_url: string;
    video_captions: VideoCaption[];
    video_thumbnail_large_url: string;
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
    id: number;
    hash_id: string;
    slug: string;
    title: string;
    description: string;
    locale: string;
    blocks: [VideoBlock, LinkGroupBlock];
    status: "published";
};
//# sourceMappingURL=epicgames.d.ts.map