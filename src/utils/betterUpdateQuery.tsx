import { Cache, QueryInput } from "@urql/exchange-graphcache"

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

export const capitalizeFirstLetter = (letter: string) => {
  if (typeof letter !== "string") return ""
  return letter.charAt(0).toUpperCase() + letter.slice(1)
}

export const convertToRealDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(parseInt(date)))
}
