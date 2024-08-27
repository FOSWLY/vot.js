import { Type, Static, TSchema } from '@sinclair/typebox'


export type ISODate = Static<typeof ISODate>
export const ISODate = Type.String()

export type AtLeast<T extends TSchema, K extends TSchema> = Static<ReturnType<typeof AtLeast<T, K>>>
export const AtLeast = <T extends TSchema, K extends TSchema>(T: T, K: K) => Type.Intersect([
Type.Partial(T),
Type.Pick(T, K)
])