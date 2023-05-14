export const mountScreenOrientationEvents = (cb: () => void) => {
  const orientationChangeRef = () => cb();
  window.screen.orientation.addEventListener("change", orientationChangeRef);
  return orientationChangeRef;
};
export const unmountScreenOrientationEvents = (
  orientationChangeRef: () => void
) => {
  window.screen.orientation.removeEventListener("change", orientationChangeRef);
};
