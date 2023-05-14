import Page from "@/components/page";
import ExpendedCategoryByWindow from "@/components/Transaction/Chart/ExpendedCategoryByWindow";
import TransactionSearch from "@/components/Transaction/TransactionSearch";

const History = () => (
  <Page title="Historial" className="pb-20">
    <ExpendedCategoryByWindow />
    <TransactionSearch />
  </Page>
);

export default History;
