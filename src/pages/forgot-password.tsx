import React, { useState } from "react"
import { Form, Formik } from "formik"
import WrapperComponent from "../components/Wrapper"
import InputFieldComponent from "../components/InputFieldComponent"
import { Box, Button } from "@chakra-ui/react"
import { useForgotPasswordMutation } from "../generated/graphql"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

const ForgotPassword: React.FC<{}> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation(),
    [complete, setComplete] = useState(false)

  return (
    <WrapperComponent variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async values => {
          await forgotPassword(values)
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              Sent! You will receive a password reset email if the email exist.
            </Box>
          ) : (
            <Form>
              <InputFieldComponent
                name="email"
                placeholder="Input your email address"
                label="Email"
              />

              <Box mt={4}>
                <Button
                  type="submit"
                  colorScheme="teal"
                  isLoading={isSubmitting}
                >
                  Continue
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </WrapperComponent>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
