import { getScreenType } from "../screen";

const screenTypeRegister: { state: ReturnType<typeof getScreenType> } = {
  state: "mobile-portrait",
};
export const mountScreenOrientationEvents = (cb: () => void) => {
  const orientationChangeRef = () => {
    const screenType = getScreenType();
    if (screenTypeRegister.state === screenType) return;
    screenTypeRegister.state = screenType;
    cb();
  };
  window.addEventListener("resize", orientationChangeRef, false);
  return orientationChangeRef;
};
export const unmountScreenOrientationEvents = (
  orientationChangeRef: () => void
) => {
  window.removeEventListener("resize", orientationChangeRef, false);
};
