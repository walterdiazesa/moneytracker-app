import Loader from "@/components/Loader";
import { CATEGORIES, CATEGORIES_MAPPER } from "@/constants";
import { TransactionContext } from "@/context";
import { getExpenseHistoryWindow } from "@/fetch";
import { currencyFormatter } from "@/utils";
import { getScreenType } from "@/utils/screen";
import { BarChart } from "@tremor/react";
import React, { useEffect, useMemo, useState } from "react";

const ExpendedCategoryByWindow = () => {
  const [expenseHistory, setTransactionContext] = TransactionContext.useStore(
    (store) => store["expenseHistory"]
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(expenseHistory).length) return;
    setIsLoading(true);
    getExpenseHistoryWindow()
      .then((expenseHistory) => {
        setTransactionContext({ expenseHistory });
      })
      .catch((error) => alert(JSON.stringify(error.toJSON())))
      .finally(() => setIsLoading(false));
  }, [expenseHistory]);

  const digestedHistoryExpense = useMemo(
    () =>
      Object.entries(expenseHistory).map(([expenseMonth, sumByCat]) => ({
        month: new Date(expenseMonth).format({
          month: "short",
          ...(getScreenType() !== "mobile-portrait" && { year: "2-digit" }),
          firstUpperCase: true,
        }),
        ...sumByCat.reduce((acc, { categoryId, _sum: { amount } }) => {
          acc[
            CATEGORIES_MAPPER[categoryId as keyof typeof CATEGORIES_MAPPER].name
          ] = +amount;
          return acc;
        }, {} as Record<typeof CATEGORIES_MAPPER[keyof typeof CATEGORIES_MAPPER]["name"], number>),
      })),
    [expenseHistory]
  );

  return (
    <div className="pt-8">
      {isLoading && <Loader label="Obteniendo ventana de transacciones" />}
      <BarChart
        data={digestedHistoryExpense}
        index="month"
        categories={CATEGORIES.map(({ name }) => name)}
        colors={CATEGORIES.map(({ appColor }) => appColor)}
        valueFormatter={(val) => `$${currencyFormatter(val)}`}
        stack={true}
        showAnimation
        showLegend={false}
        showGridLines={true}
      />
    </div>
  );
};

export default ExpendedCategoryByWindow;
