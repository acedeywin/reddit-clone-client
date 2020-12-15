import { useRouter } from "next/router"
import { usePostQuery } from "../generated/graphql"

export const useGetIntId = () => {
  const router = useRouter(),
    intId = typeof router.query.id === "string" ? parseInt(router.query.id) : -1
  return intId
}

export const useGetPostFromUrl = () => {
  const intId = useGetIntId()
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
}
