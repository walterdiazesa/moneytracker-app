import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const index = ({ href, children }: { href: string; children: JSX.Element }) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      className={`flex h-full w-full flex-col items-center justify-center space-y-1 ${
        router.pathname === href
          ? "text-indigo-500 dark:text-indigo-400"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      }`}
    >
      {children}
    </Link>
  );
};

export default index;
