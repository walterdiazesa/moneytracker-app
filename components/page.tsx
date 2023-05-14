import Head from "next/head";
import BottomNav from "@/components/Navbar";

interface Props {
  title?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}

const Page = ({ title, children, className }: Props) => {
  return (
    <>
      {title && (
        <Head>
          <title>{`MoneyTracker | ${title}`}</title>
        </Head>
      )}

      <main className="mx-auto max-w-screen-xl px-safe sm:pb-0 md:px-4 lg:px-16 xl:px-safe">
        <div {...(className && { className })}>{children}</div>
      </main>

      <BottomNav />
    </>
  );
};

export default Page;
