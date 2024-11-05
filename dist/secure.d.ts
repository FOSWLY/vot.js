import { ClientSession } from "./types/client.js";
import { SecType } from "./types/yandex.js";
export declare function getSignature(body: Uint8Array): Promise<string>;
export declare function getSecYaHeaders(secType: SecType, session: ClientSession, body: Uint8Array, path: string): Promise<{
    [x: string]: string;
}>;
export declare function getUUID(): string;
export declare function getHmacSha1(hmacKey: string, salt: string): Promise<string | false>;
//# sourceMappingURL=secure.d.ts.map