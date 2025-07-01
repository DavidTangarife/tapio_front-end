import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default AppLayout;
