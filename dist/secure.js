import crypto from "node:crypto";
import config from "./config/config.js";
import Logger from "./utils/logger.js";
const utf8Encoder = new TextEncoder();
async function signHMAC(hashName, hmac, data) {
    const key = await crypto.subtle.importKey("raw", utf8Encoder.encode(hmac), { name: "HMAC", hash: { name: hashName } }, false, ["sign", "verify"]);
    return await crypto.subtle.sign("HMAC", key, data);
}
export async function getSignature(body) {
    const signature = await signHMAC("SHA-256", config.hmac, body);
    return new Uint8Array(signature).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
export function getUUID() {
    const hexDigits = "0123456789ABCDEF";
    let uuid = "";
    for (let i = 0; i < 32; i++) {
        const randomDigit = Math.floor(Math.random() * 16);
        uuid += hexDigits[randomDigit];
    }
    return uuid;
}
export async function getHmacSha1(hmacKey, salt) {
    try {
        const hmacSalt = utf8Encoder.encode(salt);
        const signature = await signHMAC("SHA-1", hmacKey, hmacSalt);
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    }
    catch (err) {
        Logger.error(err);
        return false;
    }
}
