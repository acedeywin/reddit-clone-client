import { dedupExchange, fetchExchange } from "urql"
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql"
import { pipe, tap } from "wonka"
import { Exchange } from "urql"
import Router from "next/router"
import { gql, stringifyVariables } from "@urql/core"

import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { isServer } from "./isServer"

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

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = ""
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie
  }

  return {
    url: "http://localhost:4500/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
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
            deletePost: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Post",
                id: (args as DeletePostMutationVariables).id,
              })
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              )
              if (data) {
                if (data.voteStatus === value) {
                  return
                }
                const newPoints =
                  data.points + (!data.voteStatus ? 1 : 2) * value

                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value }
                )
              }
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query"),
                fieldInfos = allFields.filter(
                  info => info.fieldName === "posts"
                )
              fieldInfos.forEach(field => {
                cache.invalidate("Query", "posts", field.arguments || {})
              })
            },

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
  }
}
