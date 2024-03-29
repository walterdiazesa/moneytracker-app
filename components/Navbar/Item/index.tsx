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
          ? "text-theme-action"
          : "over:text-zinc-50 text-zinc-400"
      }`}
    >
      {children}
    </Link>
  );
};

export default index;
