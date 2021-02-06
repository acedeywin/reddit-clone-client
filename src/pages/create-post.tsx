import { Box, Button } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import React from "react"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"

import InputFieldComponent from "../components/InputFieldComponent"
import { useCreatePostMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import Layout from "../components/Layout"
import { userAuth } from "../utils/userAuth"

const CreatePost: React.FC<{}> = ({}) => {
  const [, createPost] = useCreatePostMutation(),
    router = useRouter()

  userAuth()

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async values => {
          const { error } = await createPost({ input: values })
          if (!error) {
            router.push("/home")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFieldComponent
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box mt={4}>
              <InputFieldComponent
                textarea
                name="text"
                placeholder="text"
                label="Text"
              />
            </Box>

            <Box color="#ffffff">
              <Button
                mt={4}
                mr={4}
                type="submit"
                backgroundColor="#319795"
                isLoading={isSubmitting}
              >
                Create Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreatePost)
