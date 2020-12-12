import React from "react"
import Navbar from "./Navbar"
import WrapperComponent, { WrapperVariant } from "./Wrapper"

interface LayoutProps {
  variant?: WrapperVariant | any
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <WrapperComponent variant={variant}>{children}</WrapperComponent>
    </>
  )
}

export default Layout
