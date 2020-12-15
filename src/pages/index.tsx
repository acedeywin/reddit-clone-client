import { withUrqlClient } from "next-urql"
import { DeleteIcon } from "@chakra-ui/icons"
import {
  Link,
  Stack,
  Heading,
  Box,
  Text,
  Flex,
  Button,
  IconButton,
} from "@chakra-ui/react"
import Layout from "../components/Layout"
import { useDeletePostMutation, usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link"
import React, { useState } from "react"
import { Vote } from "../components/Vote"
import { toErrorMap } from "../utils/toErrorMap"

const Index = () => {
  const [variables, setVariables] = useState({
      limit: 30,
      cursor: null as null | string,
    }),
    [{ data, fetching }] = usePostsQuery({
      variables,
    }),
    [, deletePost] = useDeletePostMutation()

  if (!fetching && !data) {
    return (
      <div>
        Nothing to displace due to an error. Check your console for more info.
      </div>
    )
  }

  return (
    <Layout variant={"regular"}>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={3}>
          {data!.posts.posts.map(p =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <Vote post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by {p.creator.username}</Text>
                  <Flex>
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <IconButton
                      onClick={() => {
                        deletePost({ id: p.id })
                      }}
                      aria-label="Delete Post"
                      size="sm"
                      icon={<DeleteIcon color="#e41111" />}
                    />
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }}
            isLoading={fetching}
            colorScheme="teal"
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
