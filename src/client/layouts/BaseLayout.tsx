import { ReactNode } from "react";
import Footer from "../components/layout/Footer";
import NavBar from "../components/layout/NavBar";
import Notification from "../components/shared/Notification";

const BaseLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col justify-between bg-black">
      <Notification />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
