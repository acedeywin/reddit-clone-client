import { withUrqlClient } from "next-urql"

import { Link, Stack, Heading, Box, Text, Flex, Button } from "@chakra-ui/react"
import Layout from "../components/Layout"
import { usePostsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import NextLink from "next/link"
import React, { useState } from "react"
import { Vote } from "../components/Vote"
import {
  capitalizeFirstLetter,
  convertToRealDate,
} from "../utils/betterUpdateQuery"
import EditDeleteButtons from "../components/EditDeleteButtons"

const Index = () => {
  const [variables, setVariables] = useState({
      limit: 30,
      cursor: null as null | string,
    }),
    [{ data, fetching }] = usePostsQuery({ variables })

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
                  <Text color="#319795">
                    Posted by {capitalizeFirstLetter(p.creator.username)} &nbsp;
                    {convertToRealDate(p.createdAt)}
                  </Text>
                  <Flex>
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <EditDeleteButtons id={p.id} creatorId={p.creator.id} />
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
