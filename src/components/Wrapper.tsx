import { Box } from "@chakra-ui/react"
import React from "react"

export type WrapperVariant = {
  variant?: "small" | "regular"
}

interface WrapperProps {
  variant?: WrapperVariant | any
}

const WrapperComponent: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  )
}

export default WrapperComponent
