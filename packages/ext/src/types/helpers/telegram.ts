export type PeerId = number;

export type Document = {
  _: "document";
  /**
   * only for gif
   */
  animated?: boolean;
  access_hash: string;
  attributes: unknown[];
  date: number;
  dc_id: number;
  duration: number;
  file_name: string;
  file_reference: number[];
  h: number;
  id: string;
  mime_type: string;
  pFlags: Record<string, unknown>;
  size: number;
  supportsStreaming: boolean;
  thumbs: unknown[];
  type: "video" | "gif";
  w: number;
};

export type MessageMediaDocument = {
  _: "messageMediaDocument";
  pFlags: {
    video?: boolean;
  };
  /**
   * only for video
   */
  alt_documents?: Document[];
  document: Document;
};

export type MessageMediaPhoto = {
  _: "messageMediaPhoto";
  pFlags: Record<string, unknown>;
  photo: unknown;
};

export type PeerChannel = {
  _: "peerChannel";
  channel_id: number;
};

export type PeerUser = {
  _: "peerUser";
  user_id: number;
};

export type Message = {
  _: "message";
  date: number;
  edit_date?: number;
  entities?: unknown[];
  forwards?: number;
  fromId: number;
  grouped_id?: string;
  id: number;
  media: MessageMediaDocument | MessageMediaPhoto;
  message: string;
  mid: number;
  pFlags: {
    post?: boolean;
    edit_hide?: boolean;
  };
  peerId: PeerId;
  peer_id: PeerChannel | PeerUser;
  reactions?: unknown;
  replies?: unknown;
  reply_markup?: unknown;
  totalEntities?: unknown;
  views?: number;
};

export type AppMediaViewerTarget = {
  element: HTMLElement;
  index: number | null;
  message: Message;
  mid: number;
  peerId: PeerId;
};

export type AppPeersManager = {
  // https://github.com/morethanwords/tweb/blob/0a104dc63ec66a74906b6b64a27c229852de227a/src/lib/appManagers/appPeersManager.ts#L28
  isChannel(peerId: PeerId): Promise<boolean>;
  isUser(peerId: PeerId): Promise<boolean>;
  getPeerUsername(peerId: PeerId): Promise<string>;
};

export type AppManagers = {
  appPeersManager: AppPeersManager;
};

export type AppMediaViewer = {
  target: AppMediaViewerTarget;
  live: boolean;
  managers: AppManagers;
};
