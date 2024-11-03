import { Type, Static } from '@sinclair/typebox'


export enum EnumLoggerLevel { DEBUG, INFO, WARN, ERROR, SILENCE }

export type LoggerLevel = Static<typeof LoggerLevel>
export const LoggerLevel = Type.Enum(EnumLoggerLevel)