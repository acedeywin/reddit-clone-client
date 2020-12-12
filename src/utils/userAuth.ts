import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMeQuery } from "../generated/graphql"

export const userAuth = () => {
  const router = useRouter(),
    [{ data, fetching }] = useMeQuery()
  //To see if a user is logged in, and if not route to logging page
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login")
    }
  }, [fetching, data, router])
}
