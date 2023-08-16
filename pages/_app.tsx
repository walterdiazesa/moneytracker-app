import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import { TransactionContext } from "@/context";
import Meta from "@/components/meta";
import "@/styles/globals.css";
import "../extends";
import TransactionModal from "@/components/Transaction/Modal";
import { Roboto } from "next/font/google";

// Roboto, Poppins, Montserrat, Rubik
const font = Roboto({
  weight: ["400", "500"],
  style: ["normal"],
  subsets: ["latin"],
  display: "block",
});

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <div className={`${font.className}`}>
      <SessionProvider session={session}>
        <TransactionContext.Provider>
          <Meta />
          <TransactionModal />
          <Component {...pageProps} />
        </TransactionContext.Provider>
      </SessionProvider>
    </div>
  );
};

export default App;
