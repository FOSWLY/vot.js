import config from "./data/config";
import Logger from "./utils/logger";
import { SecType, ClientSession, HashName } from "./types/secure";

async function getCrypto() {
  if (typeof window !== "undefined" && window.crypto) {
    return window.crypto;
  }

  return (await import("node:crypto")) as unknown as Crypto;
}

const utf8Encoder = new TextEncoder();

async function signHMAC(hashName: HashName, hmac: string, data: BufferSource) {
  const crypto = await getCrypto();
  const key = await crypto.subtle.importKey(
    "raw",
    utf8Encoder.encode(hmac),
    { name: "HMAC", hash: { name: hashName } },
    false,
    ["sign", "verify"],
  );

  return await crypto.subtle.sign("HMAC", key, data);
}

// yandex signature
export async function getSignature(body: Uint8Array) {
  const signature = await signHMAC("SHA-256", config.hmac, body);

  // Convert the signature to a hex string
  return new Uint8Array(signature).reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}

export async function getSecYaHeaders(
  secType: SecType,
  session: ClientSession,
  body: Uint8Array,
  path: string,
) {
  const { secretKey, uuid } = session;
  const sign = await getSignature(body);

  // https://github.com/FOSWLY/vot.js/issues/36
  const token = `${uuid}:${path}:${config.componentVersion}`;
  const tokenBody = utf8Encoder.encode(token);
  const tokenSign = await getSignature(tokenBody);

  return {
    [`${secType}-Signature`]: sign,
    [`Sec-${secType}-Sk`]: secretKey,
    [`Sec-${secType}-Token`]: `${tokenSign}:${token}`,
  };
}

// yandex uuid
export function getUUID() {
  const hexDigits = "0123456789ABCDEF";
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    const randomDigit = Math.floor(Math.random() * 16);
    uuid += hexDigits[randomDigit];
  }
  return uuid;
}

// hmac sha1 for weverse
export async function getHmacSha1(hmacKey: string, salt: string) {
  try {
    const hmacSalt = utf8Encoder.encode(salt);

    const signature = await signHMAC("SHA-1", hmacKey, hmacSalt);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } catch (err) {
    Logger.error(err);
    return false;
  }
}
