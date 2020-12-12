import { Box, Flex, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useRouter } from "next/router"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() })
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation(),
    router = useRouter()

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
        <Link onClick={() => logout()} isLoading={logoutFetching} mr={10}>
          Logout
        </Link>
      </Flex>
    )
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#1E9935" color="white" p={4}>
      <Box cursor={"pointer"} onClick={() => router.push("/")}>
        RedditCLone
      </Box>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  )
}

export default Navbar
