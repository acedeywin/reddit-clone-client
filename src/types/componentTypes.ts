import { InputHTMLAttributes } from "react"
import { PostSnippetFragment } from "../generated/graphql"

export type InputFieldComponentProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
  textarea?: boolean
}

export type LayoutProps = {
  variant?: WrapperVariant | any
}

export type VoteProps = {
  post: PostSnippetFragment
}

export type WrapperVariant = {
  variant?: "small" | "regular"
}

// export type WrapperProps = {
//   variant?: WrapperVariant | any
// }
