import type { FetchFunction } from "../client";
import type { ServiceConf } from "../service";
export type BaseHelperOpts<T = ServiceConf> = {
  fetchFn?: FetchFunction;
  extraInfo?: boolean;
  referer?: string;
  origin?: string;
  service?: T;
};
//# sourceMappingURL=base.d.ts.map
