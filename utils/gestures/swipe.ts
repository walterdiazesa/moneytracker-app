const pStart = { x: 0, y: 0 };
const pStop = { x: 0, y: 0 };

function swipeCheck(cb: () => void) {
  const changeY = pStart.y - pStop.y;
  const changeX = pStart.x - pStop.x;
  if (isPullDown(changeY, changeX)) {
    cb();
  }
}

function isPullDown(dY: number, dX: number) {
  // methods of checking slope, length, direction of line created by swipe action
  return (
    dY < 0 &&
    ((Math.abs(dX) <= 100 && Math.abs(dY) >= 300) ||
      (Math.abs(dX) / Math.abs(dY) <= 0.3 && dY >= 60))
  );
}

function swipeStart(e: TouchEvent) {
  if (typeof e["targetTouches"] !== "undefined") {
    const touch = e.targetTouches[0];
    pStart.x = touch.screenX;
    pStart.y = touch.screenY;
  } else {
    pStart.x = (e as any).screenX;
    pStart.y = (e as any).screenY;
  }
}

function swipeEnd(e: TouchEvent, cb: () => void) {
  if (typeof e["changedTouches"] !== "undefined") {
    const touch = e.changedTouches[0];
    pStop.x = touch.screenX;
    pStop.y = touch.screenY;
  } else {
    pStop.x = (e as any).screenX;
    pStop.y = (e as any).screenY;
  }

  swipeCheck(cb);
}

const touchStart = function (e: TouchEvent) {
  swipeStart(e);
};
const touchEnd = function (e: TouchEvent, cb: () => void) {
  swipeEnd(e, cb);
};

export const mountSwipeDownEvents = (cb: () => void) => {
  const touchEndRef = (e: TouchEvent) => touchEnd(e, cb);
  document.addEventListener("touchstart", touchStart, false);
  document.addEventListener("touchend", touchEndRef, false);
  return touchEndRef;
};
export const unmountSwipeDownEvents = (
  touchEndRef: (e: TouchEvent) => void
) => {
  document.removeEventListener("touchstart", touchStart, false);
  document.removeEventListener("touchend", touchEndRef, false);
};
