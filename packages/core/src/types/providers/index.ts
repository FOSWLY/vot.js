import type { VideoService } from "../service";
import type { BaseProvider } from "../../providers/base";

export type VOTProvider<
  T extends string = VideoService,
  P extends BaseProvider<T> = BaseProvider<T>,
> = new (...args: any[]) => P;
