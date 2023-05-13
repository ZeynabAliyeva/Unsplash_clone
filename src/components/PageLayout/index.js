import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

function PageLayout() {
  return (
    <>
      <Header />
      <div className="PageLayoutWrapper">
        <Outlet />
      </div>
    </>
  );
}

export default PageLayout;
