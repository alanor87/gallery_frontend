import { useState, useEffect } from "react";

function useWindowWidth() {
  console.log("useWindowWidth fired");
  const [windowWidth, setWindowWidth] = useState<Number>(window.innerWidth);

  const getWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", getWindowWidth);
    console.log("listener added");
    return () => {
      window.removeEventListener("resize", getWindowWidth);
      console.log("listener removed");
    };
  }, []);
  return windowWidth;
}

export default useWindowWidth;
