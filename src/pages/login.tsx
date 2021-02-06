import React from "react"
import { Form, Formik } from "formik"
import WrapperComponent from "../components/Wrapper"
import InputFieldComponent from "../components/InputFieldComponent"
import { Box, Button, Flex, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import { useLoginMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

const LoginPage: React.FC<{}> = ({}) => {
  const [, login] = useLoginMutation(),
    router = useRouter()

  return (
    <WrapperComponent variant={"small"}>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values)
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next)
            } else {
              router.push("/home")
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFieldComponent
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box mt={4}>
              <InputFieldComponent
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml={"auto"}>Forgot password?</Link>
              </NextLink>
            </Flex>

            <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </WrapperComponent>
  )
}

export default withUrqlClient(createUrqlClient)(LoginPage)
