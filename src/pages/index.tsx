import { withUrqlClient } from "next-urql"
import { Link, Stack, Heading, Box, Text, Flex, Button } from "@chakra-ui/react"
import Layout from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link"
import React, { useState } from "react"

const Index = () => {
  const [variables, setVariables] = useState({ limit: 30, cursor: "" }),
    [{ data, fetching }] = usePostsQuery({
      variables,
    })

  if (!fetching && !data) {
    return (
      <div>
        Not to displace due to an error. Check your console for more info.
      </div>
    )
  }

  return (
    <Layout variant={"regular"}>
      <Flex>
        <Heading>RedditClone</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create Post</Link>
        </NextLink>
      </Flex>
      <br />
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={3}>
          {data!.posts.posts.map(p => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
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
