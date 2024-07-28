import { Type, Static } from '@sinclair/typebox'


export type ISODate = Static<typeof ISODate>
export const ISODate = Type.String()