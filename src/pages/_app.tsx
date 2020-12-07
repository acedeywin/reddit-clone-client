import React from "react"
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import { Provider, createClient } from "urql"

import theme from "../theme"

const client = createClient({
  url: "http://localhost:4500/graphql",
  fetchOptions: {
    credentials: "include",
  },
})

interface MyAppProps {
  Component: any
  pageProps: any
}

const MyApp: React.FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
