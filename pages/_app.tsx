import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { TransactionContext } from "@/context";
import Meta from "@/components/meta";
import "@/styles/globals.css";
import "../extends";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TransactionContext.Provider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
      >
        <Meta />
        <Component {...pageProps} />
      </ThemeProvider>
    </TransactionContext.Provider>
  );
};

export default App;
