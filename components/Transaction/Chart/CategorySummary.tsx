import React from "react";
import { DonutChart as PieChart } from "@tremor/react";
import { currencyFormatter, getExpendedFromTransactions } from "@/utils";
import { CATEGORIES } from "@/constants";
import { TransactionContext } from "@/context";

const CategorySummary = () => {
  const [lastTransactions] = TransactionContext.useStore(
    (store) => store["lastTransactions"]
  );

  return (
    <PieChart
      variant="pie"
      className="mt-6 mb-3"
      data={CATEGORIES.map(({ id, name }) => ({
        name,
        expended: getExpendedFromTransactions(lastTransactions, id),
      }))}
      category="expended"
      index="name"
      valueFormatter={(v) => `$${currencyFormatter(v)}`}
      colors={CATEGORIES.map(({ appColor }) => appColor)}
      showAnimation
    />
  );
};

export default React.memo(CategorySummary);
