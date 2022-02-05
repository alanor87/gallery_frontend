import { useState, useEffect } from "react";

function useWindowWidth() {
  console.log("useWindowWidth fired");
  const [windowWidth, setWindowWidth] = useState<Number>(window.innerWidth);

  const getWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    console.log("listener added");
    window.addEventListener("resize", getWindowWidth);
    return () => {
      window.removeEventListener("resize", getWindowWidth);
      console.log("listener removed");
    };
  }, []);
  return windowWidth;
}

export default useWindowWidth;
