export type APIResponse = {
  encrypted: true;
  timestamp: number;
  url: string;
};

export type SignResponse = {
  token?: string;
  ex?: number | string;
};
