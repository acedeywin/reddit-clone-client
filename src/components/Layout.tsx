import React from "react"
import { LayoutProps } from "../types/componentTypes"
import Navbar from "./Navbar"
import WrapperComponent from "./Wrapper"

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <WrapperComponent variant={variant}>{children}</WrapperComponent>
    </>
  )
}

export default Layout
