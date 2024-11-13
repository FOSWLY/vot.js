import { LoggerLevel } from "./logger";

import { Type, Static } from '@sinclair/typebox'


export type ConfigSchema = Static<typeof ConfigSchema>
export const ConfigSchema = Type.Object({
host: Type.String(),
hostVOT: Type.String(),
mediaProxy: Type.String(),
userAgent: Type.String(),
componentVersion: Type.String(),
hmac: Type.String(),
defaultDuration: Type.Number(),
loggerLevel: LoggerLevel,
version: Type.String()
})