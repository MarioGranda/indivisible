import { RefObject, useEffect, useState } from "react";

function useHoldClick<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [isPressed, setisPressed] = useState<boolean>(false);

  const handleMouseEnter = () => {
    console.log("Down");
    setisPressed(true);
  };
  const handleMouseLeave = () => {
    console.log("Up");
    setisPressed(false);
  };

  useEffect(() => {
    if (elementRef?.current) {
      console.log("Here");
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
