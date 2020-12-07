import { Box, Button, Flex, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useMeQuery } from "../generated/graphql"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()

  let body

  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <Flex bg="tomato" color="white" p={4}>
        <Box>Navbar</Box>
        <Box ml={"auto"}>
          <NextLink href="/login">
            <Link mr={5}>Login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link mr={10}>Register</Link>
          </NextLink>
        </Box>
      </Flex>
    )
  } else {
    body = (
      <Flex bg="tomato" color="white" p={4}>
        <Box>Navbar</Box>
        <Box ml={"auto"} mr={5}>
          {data.me.username}
        </Box>
        <Button variant="link" mr={10}>
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tomato" color="white" p={4}>
      <Box>Navbar</Box>
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link mr={5}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={10}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  )
}

export default Navbar
