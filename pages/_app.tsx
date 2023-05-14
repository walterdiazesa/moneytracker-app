import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { TransactionContext } from "@/context";
import Meta from "@/components/meta";
import "@/styles/globals.css";
import "../extends";
import TransactionModal from "@/components/Transaction/Modal";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TransactionContext.Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Meta />
        <TransactionModal />
        <Component {...pageProps} />
      </ThemeProvider>
    </TransactionContext.Provider>
  );
};

export default App;
