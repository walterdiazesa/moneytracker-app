import {
  ListBulletIcon,
  ChartBarIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Item from "./Item";
import { memo, useEffect, useState } from "react";
import { TransactionContext } from "@/context";
import {
  mountScreenOrientationEvents,
  mountSwipeDownEvents,
  unmountSwipeDownEvents,
  unmountScreenOrientationEvents,
} from "@/utils/gestures";
import { getScreenType } from "@/utils/screen";

const BottomNav = () => {
  const [, setTransactionContext] = TransactionContext.useStore(
    (store) => store["isTransactionModalOpen"]
  );

  const [showAuthTab, setShowAuthTab] = useState(false);

  useEffect(() => {
    const cb = () => setShowAuthTab(getScreenType() === "mobile-landscape");
    const orientationChangeRef = mountScreenOrientationEvents(cb);
    const touchEndRef = mountSwipeDownEvents(cb);
    return () => {
      unmountSwipeDownEvents(touchEndRef);
      unmountScreenOrientationEvents(orientationChangeRef);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 w-full border-t border-zinc-800 bg-theme-main-light pb-safe">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        <Item href="/">
          <ListBulletIcon width={24} height={24} />
        </Item>
        <div className="flex -translate-y-1/3 flex-col items-center justify-center rounded-md bg-theme-action p-4 hover:bg-theme-action-dark">
          <PlusIcon
            onClick={() =>
              setTransactionContext({ isTransactionModalOpen: true })
            }
            width={20}
            height={20}
          />
        </div>
        <Item href="/history">
          <ChartBarIcon width={20} height={20} />
        </Item>
        {showAuthTab && (
          <Item href="/auth">
            <UserIcon width={20} height={20} />
          </Item>
        )}
      </div>
    </nav>
  );
};

export default memo(BottomNav, () => true);
