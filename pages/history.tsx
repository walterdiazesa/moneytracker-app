import Page from "@/components/page";
import ExpendedCategoryByWindow from "@/components/Transaction/Chart/ExpendedCategoryByWindow";
import TransactionSearch from "@/components/Transaction/TransactionSearch";
import { useEffect } from "react";

const History = () => {
  useEffect(() => {
    window.screen.orientation.addEventListener("change", (ev) => {
      alert(
        `width: ${window.screen.width}, availW: ${window.screen.availWidth}, height: ${window.screen.height}`
      );
    });
  }, []);

  return (
    <Page title="Historial" className="pb-20">
      <ExpendedCategoryByWindow />
      <TransactionSearch />
    </Page>
  );
};

export default History;
