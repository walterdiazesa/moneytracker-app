import {
  ListBulletIcon,
  ChartBarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Item from "./Item";
import { memo } from "react";

const BottomNav = () => {
  return (
    <div className="sm:hidden">
      <nav className="fixed bottom-0 w-full border-t bg-zinc-100 pb-safe dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
          <Item href="/">
            <ListBulletIcon width={24} height={24} />
          </Item>
          <div className="flex -translate-y-1/3 flex-col items-center justify-center rounded-md bg-blue-500 p-4">
            <PlusIcon width={20} height={20} />
          </div>
          <Item href="/history">
            <ChartBarIcon width={20} height={20} />
          </Item>
        </div>
      </nav>
    </div>
  );
};

export default memo(BottomNav, () => true);
