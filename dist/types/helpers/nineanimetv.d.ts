export type ServersData = {
    status: boolean;
    html?: string;
};
export type PlayerSources = {
    type: "iframe";
    link: string;
    server: number;
    sources: unknown[];
    tracks: unknown[];
    htmlGuide: string;
};
export type RapidSource = {
    file: string;
    type: string;
};
export type RapidTracks = {
    file: string;
    label: string;
    kind: "captions";
    default: boolean;
};
export type RapidFragment = {
    start: number;
    end: number;
};
export type RapidData = {
    sources: RapidSource[];
    tracks: RapidTracks[];
    encrypted: boolean;
    intro?: RapidFragment;
    outro?: RapidFragment;
    server?: number;
};
//# sourceMappingURL=nineanimetv.d.ts.map