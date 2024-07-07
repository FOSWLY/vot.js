import crypto from "node:crypto";
import config from "./config/config";

const utf8Encoder = new TextEncoder();
type HashName = "SHA-256" | "SHA-1";

async function signHMAC(
  hashName: HashName,
  hmac: string,
  data: crypto.webcrypto.BufferSource,
) {
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
    console.error(err);
    return false;
  }
}
