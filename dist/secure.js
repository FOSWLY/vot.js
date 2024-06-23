import crypto from "node:crypto";
import config from "./config/config";
// yandex signature
export async function getSignature(body) {
    const utf8Encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", utf8Encoder.encode(config.hmac), { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign", "verify"]);
    const signature = await crypto.subtle.sign("HMAC", key, body);
    // Convert the signature to a hex string
    return new Uint8Array(signature).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
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
export async function getHmacSha1(hmacKey, salt) {
    try {
        const utf8Encoder = new TextEncoder();
        let hmacSalt = utf8Encoder.encode(salt);
        const key = await crypto.subtle.importKey("raw", utf8Encoder.encode(hmacKey), { name: "HMAC", hash: { name: "SHA-1" } }, false, ["sign", "verify"]);
        const signature = await crypto.subtle.sign("HMAC", key, hmacSalt);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
