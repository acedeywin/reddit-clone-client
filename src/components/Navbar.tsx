import { Box, Button, Flex, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  let body = null

  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <Flex>
        <NextLink href="/login">
          <Link mr={5}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={10}>Register</Link>
        </NextLink>
      </Flex>
    )
  } else {
    body = (
      <Flex>
        <Box mr={5}>{data.me.username}</Box>
        <Button
          onClick={() => logout()}
          isLoading={logoutFetching}
          variant="link"
          mr={10}
        >
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tomato" color="white" p={4}>
      <Box>Navbar</Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  )
}

export default Navbar
