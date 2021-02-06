import { withUrqlClient } from "next-urql"
import { Box, Button, Stack, Heading } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import React from "react"
import { createUrqlClient } from "../../../utils/createUrqlClient"
import InputFieldComponent from "../../../components/InputFieldComponent"
import Layout from "../../../components/Layout"
import {
  useGetIntId,
  useGetPostFromUrl,
} from "../../../utils/useGetPostFromUrl"
import { useUpdatePostMutation } from "../../../generated/graphql"
import { useRouter } from "next/router"

const EditPost = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl(),
    [, updatePost] = useUpdatePostMutation(),
    intId = useGetIntId(),
    router = useRouter()

  switch (true) {
    case fetching:
      return (
        <Layout>
          <div>Loading...</div>
        </Layout>
      )
    case error as any:
      return <div>{error?.message}</div>
    case !data?.post:
      return (
        <Layout>
          <Stack spacing={3} p={5} mt={20}>
            <Heading>Could not find the post you are look for</Heading>
          </Stack>
        </Layout>
      )
    default:
      return (
        <Layout variant="small">
          <Formik
            initialValues={{ title: data?.post?.title, text: data?.post?.text }}
            onSubmit={async values => {
              await updatePost({ id: intId, ...(values as any) })
              router.back()
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
                    Update Post
                  </Button>
                  <Button
                    onClick={() => router.push("/")}
                    mt={4}
                    type="submit"
                    backgroundColor="#e41111"
                    isLoading={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Layout>
      )
  }
}

export default withUrqlClient(createUrqlClient)(EditPost)
