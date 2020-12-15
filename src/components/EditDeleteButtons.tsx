import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { Box, IconButton, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react"
import { useDeletePostMutation, useMeQuery } from "../generated/graphql"

interface EditDeleteButtonsProps {
  id: number | any
  creatorId: number | any
}

const EditDeleteButtons: React.FC<EditDeleteButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation(),
    [{ data: meData }] = useMeQuery()
  return (
    <Box>
      {meData?.me?.id !== creatorId ? null : (
        <Box>
          <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <IconButton
              as={Link}
              aria-label="Edit Post"
              size="sm"
              mr={2}
              icon={<EditIcon color="#319795" />}
            />
          </NextLink>
          <IconButton
            onClick={() => {
              deletePost({ id })
            }}
            aria-label="Delete Post"
            size="sm"
            icon={<DeleteIcon color="#e41111" />}
          />
        </Box>
      )}
    </Box>
  )
}

export default EditDeleteButtons
