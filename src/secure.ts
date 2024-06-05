import crypto from "node:crypto";
import config from "./config/config";

// yandex signature
export async function getSignature(body: Uint8Array) {
  const utf8Encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    utf8Encoder.encode(config.hmac),
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, body);

  // Convert the signature to a hex string
  return new Uint8Array(signature).reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}

// yandex uuid
export function getUUID(isLower: boolean) {
  const randomBytes = crypto.getRandomValues(new Uint8Array(31));
  let byteIndex = 0;
  const uuid = (([1e7] as unknown as string) + 1e3 + 4e3 + 8e3 + 1e11).replace(
    /[018]/g,
    (match: any) =>
      (match ^ (randomBytes[byteIndex++] & (15 >> (match / 4)))).toString(16),
  );
  return isLower ? uuid : uuid.toUpperCase();
}

// hmac sha1 for weverse
export async function getHmacSha1(hmacKey: string, salt: string) {
  try {
    const utf8Encoder = new TextEncoder();
    let hmacSalt = utf8Encoder.encode(salt);
    const key = await crypto.subtle.importKey(
      "raw",
      utf8Encoder.encode(hmacKey),
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign", "verify"],
    );
    const signature = await crypto.subtle.sign("HMAC", key, hmacSalt);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  } catch (err) {
    console.error(err);
    return false;
  }
}
