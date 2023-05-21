import type { AppProps } from "next/app";
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

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className={`${font.className}`}>
      <TransactionContext.Provider>
        <Meta />
        <TransactionModal />
        <Component {...pageProps} />
      </TransactionContext.Provider>
    </div>
  );
};

export default App;
