export const getScreenType = ():
  | "mobile-portrait"
  | "mobile-landscape"
  | "desktop" => {
  if (
    !window ||
    (window.matchMedia("(orientation: portrait)").matches &&
      window.innerWidth < 500)
  )
    return "mobile-portrait";
  if (window.innerWidth < 1000) return "mobile-landscape";
  return "desktop";
};
