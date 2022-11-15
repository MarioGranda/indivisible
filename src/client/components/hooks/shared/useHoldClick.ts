import { RefObject, useEffect, useState } from "react";

function useHoldClick<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [isPressed, setisPressed] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setisPressed(true);
  };
  const handleMouseLeave = () => {
    setisPressed(false);
  };

  useEffect(() => {
    if (elementRef?.current) {
      elementRef.current.addEventListener("mousedown", handleMouseEnter);
      elementRef.current.addEventListener("mouseup", handleMouseLeave);
      return () => {
        elementRef.current.removeEventListener("mousedown", handleMouseEnter);
        elementRef.current.removeEventListener("mouseup", handleMouseLeave);
      };
    }
  }, []);

  return isPressed;
}

export default useHoldClick;
