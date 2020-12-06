import React from "react"
import { Form, Formik } from "formik"
import WrapperComponent from "../components/Wrapper"
import InputFieldComponent from "../components/InputFieldComponent"
import { Box, Button } from "@chakra-ui/react"

interface registerProps {}

const RegisterPage: React.FC<registerProps> = props => {
  return (
    <WrapperComponent variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={values => {
          console.log(values)
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

export default RegisterPage
