import React from "react"
import { useField } from "formik"
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react"
import { InputFieldComponentProps } from "../types/componentTypes"

// interface ComponentInterface{
//   C?: InputProps & {C?: TextareaProps}

// }

const InputFieldComponent: React.FC<InputFieldComponentProps> = ({
  label,
  size: _,
  textarea,
  ...props
}) => {
  //checking for textarea
  let IntputOrTextarea: any = Input
  if (textarea) {
    IntputOrTextarea = Textarea
  }
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <IntputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputFieldComponent
