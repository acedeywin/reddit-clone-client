import React from "react"
import { Form, Formik } from "formik"
import WrapperComponent from "../components/Wrapper"
import InputFieldComponent from "../components/InputFieldComponent"
import { Box, Button } from "@chakra-ui/react"
import { useRegisterMutation } from "../generated/graphql"
import { toErrorMap } from "../utils/toErrorMap"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient"

interface registerProps {}

const RegisterPage: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation(),
    router = useRouter()

  return (
    <WrapperComponent variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values })
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors))
          } else if (response.data?.register.user) {
            router.push("/create-post")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFieldComponent
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputFieldComponent
                name="email"
                placeholder="email"
                label="Email"
              />
            </Box>
            <Box mt={4}>
              <InputFieldComponent
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </WrapperComponent>
  )
}

export default withUrqlClient(createUrqlClient)(RegisterPage)
