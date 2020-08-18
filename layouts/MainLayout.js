import React from "react";
import { Navbar } from "components/page_elements";

const MainLayout = ({ children, ...props }) => {
  return (
    <>
      <Navbar logo={props.logo} />
      {children}
    </>
  );
};

export default MainLayout;
