import { withUrqlClient } from "next-urql"
import { Link, Stack, Heading, Box, Text, Flex, Button } from "@chakra-ui/react"
import Layout from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link"
import React from "react"

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: { limit: 10, cursor: "" },
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
          {data!.posts.map(p => (
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data ? (
        <Flex>
          <Button isLoading={fetching} colorScheme="teal" m="auto" my={8}>
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
