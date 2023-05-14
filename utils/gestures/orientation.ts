export const mountScreenOrientationEvents = (cb: () => void) => {
  const orientationChangeRef = () => cb();
  document.addEventListener("orientationchange", orientationChangeRef);
  return orientationChangeRef;
};
export const unmountScreenOrientationEvents = (
  orientationChangeRef: () => void
) => {
  document.removeEventListener("orientationchange", orientationChangeRef);
};
