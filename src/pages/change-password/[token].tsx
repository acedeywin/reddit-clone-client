import { Box, Button, Link } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import { NextPage } from "next"
import NextLink from "next/link"
import React from "react"
import InputFieldComponent from "../../components/InputFieldComponent"
import WrapperComponent from "../../components/Wrapper"
import { useChangePasswordMutation } from "../../generated/graphql"
import { toErrorMap } from "../../utils/toErrorMap"
import { useRouter } from "next/router"
import { useState } from "react"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../../utils/createUrqlClient"

// https://aqueous-beyond-88273.herokuapp.com/

const ChangePassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation(),
    router = useRouter(),
    [tokenError, setTokenError] = useState("")
  return (
    <WrapperComponent variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          })
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ("token" in errorMap) {
              setTokenError(errorMap.token)
            }
            setErrors(errorMap)
          } else if (response.data?.changePassword.user) {
            router.push("/")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputFieldComponent
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>

            {tokenError ? (
              <Box>
                <Box color="#D12323">{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Reset password</Link>
                </NextLink>
              </Box>
            ) : null}

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </WrapperComponent>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
