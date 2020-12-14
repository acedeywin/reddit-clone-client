import { Stack, Flex, Box, Heading, Text } from "@chakra-ui/react"
import React from "react"
import { usePostsQuery } from "../generated/graphql"
import { VoteProps } from "../types/componentTypes"
import { Vote } from "./Vote"

const Data: React.FC<VoteProps> = ({}) => {
  const [{ data }] = usePostsQuery({})
  return (
    <Stack spacing={3}>
      {data!.posts.posts.map(p => (
        <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
          <Vote post={p} />
          <Box>
            <Heading fontSize="xl">{p.title}</Heading>
            <Text>posted by {p.creator.username}</Text>
            <Text mt={4}>{p.textSnippet}</Text>
          </Box>
        </Flex>
      ))}
    </Stack>
  )
}

export default Data
