import { Heading, Stack, Text } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import Layout from "../../components/Layout"
import { usePostQuery } from "../../generated/graphql"
import { createUrqlClient } from "../../utils/createUrqlClient"

const Post = ({}) => {
  const router = useRouter(),
    intId =
      typeof router.query.id === "string" ? parseInt(router.query.id) : -1,
    [{ data, fetching }] = usePostQuery({
      pause: intId === -1,
      variables: {
        id: intId,
      },
    })

  switch (true) {
    case fetching:
      return (
        <Layout>
          <div>Loading...</div>
        </Layout>
      )
    case !data?.post:
      return (
        <Layout>
          <Stack spacing={3} p={5} mt={20}>
            <Heading>Could not find the post you are look for</Heading>
          </Stack>
        </Layout>
      )
    default:
      return (
        <Layout>
          <Stack spacing={3} p={5} shadow="md">
            <Heading>{data?.post?.title}</Heading>
            <Text>{data?.post?.text}</Text>
          </Stack>
        </Layout>
      )
  }
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
