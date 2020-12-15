import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useRouter } from "next/router"
import { capitalizeFirstLetter } from "../utils/betterUpdateQuery"

const Navbar: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() })
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation(),
    router = useRouter()

  let body = null

  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <Flex align="center">
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
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={10} color="#319795">
            Create Post
          </Button>
        </NextLink>
        <Box mr={5}>
          {" "}
          Welcome back &nbsp; {capitalizeFirstLetter(data.me.username)}
        </Box>
        <Link onClick={() => logout()} isLoading={logoutFetching} mr={10}>
          Logout
        </Link>
      </Flex>
    )
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="#319795"
      color="white"
      p={4}
      align="center"
    >
      <Heading cursor={"pointer"} onClick={() => router.push("/")}>
        RedditCLone
      </Heading>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  )
}

export default Navbar
