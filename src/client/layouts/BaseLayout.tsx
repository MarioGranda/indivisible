import { ReactNode } from "react";
import NavBar from "../components/NavBar";
// import Notification from "../components/Notification";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col justify-between bg-black">
      {/* <Notification /> */}
      <NavBar />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default BaseLayout;
