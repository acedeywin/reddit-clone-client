import { Box, Heading, Stack, Text } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import React from "react"
import EditDeleteButtons from "../../components/EditDeleteButtons"
import Layout from "../../components/Layout"
import {
  capitalizeFirstLetter,
  convertToRealDate,
} from "../../utils/betterUpdateQuery"

import { createUrqlClient } from "../../utils/createUrqlClient"
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl"

const ViewPost = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl()

  switch (true) {
    case fetching:
      return (
        <Layout>
          <div>Loading...</div>
        </Layout>
      )
    case error as any:
      return <div>{error?.message}</div>
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
            <Box>
              <Heading>{data?.post?.title}</Heading>
              <Text color="#319795">
                Posted by &nbsp;
                {capitalizeFirstLetter(data?.post?.creator.username as any)}
                &nbsp; {convertToRealDate(data?.post?.createdAt as any)}
              </Text>
            </Box>
            <Text>{data?.post?.text}</Text>
            <EditDeleteButtons
              id={data?.post?.id}
              creatorId={data?.post?.creator.id}
            />
          </Stack>
        </Layout>
      )
  }
}

export default withUrqlClient(createUrqlClient, { ssr: true })(ViewPost)
