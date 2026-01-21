import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const LayoutChildren = ({ children }: LayoutProps ) => {
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  return (
    <div
      className={`mx-auto ${
        isHome ? "px-0 py-0" : "px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
      }`}
    >
      <AnimatePresence mode="wait">
        <motion.div>{children}</motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LayoutChildren;
