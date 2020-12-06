import React, { InputHTMLAttributes } from "react"
import { useField } from "formik"
import { type } from "os"
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react"

type InputFieldComponentProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
}

const InputFieldComponent: React.FC<InputFieldComponentProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props)
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  )
}

export default InputFieldComponent
