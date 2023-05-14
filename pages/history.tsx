import Page from "@/components/page";
import ExpendedCategoryByWindow from "@/components/Transaction/Chart/ExpendedCategoryByWindow";
import TransactionSearch from "@/components/Transaction/TransactionSearch";
import { useEffect } from "react";

const History = () => {
  useEffect(() => {}, []);

  return (
    <Page title="Historial" className="pb-20">
      <ExpendedCategoryByWindow />
      <TransactionSearch />
    </Page>
  );
};

export default History;
