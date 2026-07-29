import { config } from "@vot.js/shared";
import { ClientResponse } from "../types/client";
import { YandexProviderOpts } from "../types/providers/yandex";
import { VideoService } from "../types/service";
import { YandexProvider } from "./yandex";

export class VOTWorkerProvider<
  V extends string = VideoService,
> extends YandexProvider<V> {
  constructor(opts: YandexProviderOpts = {}) {
    opts.host = opts.host ?? config.hostWorker;
    super(opts);
  }

  override async request<T = ArrayBuffer>(
    path: string,
    body: Uint8Array,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          ...headers,
        },
        body: Array.from(body),
      }),
      {
        "Content-Type": "application/json",
      },
      method,
    );

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.arrayBuffer()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  override async requestJSON<T = unknown>(
    path: string,
    body: unknown = null,
    headers: Record<string, string> = {},
    method = "POST",
  ): Promise<ClientResponse<T>> {
    const options = this.getOpts(
      JSON.stringify({
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        body,
      }),
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method,
    );

    try {
      const res = await this.fetch(
        `${this.schema}://${this.host}${path}`,
        options,
      );
      const data = (await res.json()) as T;

      return {
        success: res.status === 200,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }
}
