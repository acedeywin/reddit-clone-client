import { dedupExchange, fetchExchange } from "urql"
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql"
import { pipe, tap } from "wonka"
import { Exchange } from "urql"
import Router from "next/router"
import { stringifyVariables } from "@urql/core"

import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { betterUpdateQuery } from "./betterUpdateQuery"

export const errorExchange: Exchange = ({ forward }) => ops$ => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error.message.includes("You are not logged in.")) {
          Router.replace("/login")
        }
      }
    })
  )
}

export type MergeMode = "before" | "after"

export interface PaginationParams {
  cursorArgument?: string
  limitArgument?: string
  mergeMode?: MergeMode
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info,
      allFields = cache.inspectFields(entityKey),
      fieldInfos = allFields.filter(info => info.fieldName === fieldName),
      size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    //for pagination and then combining them into one large result
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`,
      isItInTheCache = cache.resolve(
        cache.resolveFieldByKey(entityKey, fieldKey) as string,
        "posts"
      )

    info.partial = !isItInTheCache
    let hasMore = true

    const results: string[] = []
    fieldInfos.forEach(field => {
      const key: any = cache.resolveFieldByKey(
        entityKey,
        field.fieldKey
      ) as string[]
      const data = cache.resolve(key, "posts") as string[]
      const _hasMore = cache.resolve(key, "hasMore")
      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }
      results.push(...data)
    })

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    }
  }
}

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4500/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            )
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                } else {
                  return {
                    me: result.login.user,
                  }
                }
              }
            )
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                } else {
                  return {
                    me: result.register.user,
                  }
                }
              }
            )
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
})
