import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Flex, IconButton } from "@chakra-ui/react"
import React, { useState } from "react"
import { useVoteMutation } from "../generated/graphql"
import { VoteProps } from "../types/componentTypes"

export const Vote: React.FC<VoteProps> = ({ post }) => {
  const [, vote] = useVoteMutation(),
    [loadingState, setLoadingState] = useState<
      "upvote-loading" | "downvote-loading" | "not-loading"
    >("not-loading")
  return (
    <>
      <Flex
        mr={4}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton
          onClick={async () => {
            if (post.voteStatus === 1) {
              return
            }
            setLoadingState("upvote-loading")
            await vote({
              postId: post.id,
              value: 1,
            })
            setLoadingState("not-loading")
          }}
          isLoading={loadingState === "upvote-loading"}
          backgroundColor={post.voteStatus === 1 ? "#319795" : undefined}
          aria-label="Up Vote"
          size="lg"
          icon={<ChevronUpIcon color="#fcfdfd" w={6} h={6} />}
        />
        {post.points}
        <IconButton
          onClick={async () => {
            if (post.voteStatus === -1) {
              return
            }
            setLoadingState("downvote-loading")
            await vote({
              postId: post.id,
              value: -1,
            })
            setLoadingState("not-loading")
          }}
          isLoading={loadingState === "downvote-loading"}
          backgroundColor={post.voteStatus === -1 ? "#e41111" : undefined}
          aria-label="Down Vote"
          size="lg"
          icon={<ChevronDownIcon color="#fcfdfd" w={6} h={6} />}
        />
      </Flex>
    </>
  )
}
