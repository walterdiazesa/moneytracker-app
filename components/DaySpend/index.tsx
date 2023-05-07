import { Transaction } from "@/ts";
import { currencyFormatter } from "@/utils";
import React, { useMemo } from "react";

const index = ({ dayTransactions }: { dayTransactions: Transaction[] }) => {
  const spendPerDay = useMemo(
    () =>
      dayTransactions.reduce(
        (acc, cVal) => acc + +cVal.amount * (cVal.type === "minus" ? -1 : 0), // Change 0 to 1 to handle plus cases
        0
      ),
    [dayTransactions]
  );

  return (
    <span
      className={`ml-1 text-xs ${
        spendPerDay === 0
          ? "text-gray-400"
          : spendPerDay > 0
          ? "text-green-200"
          : "text-red-300"
      }`}
    >
      {spendPerDay < 0 && "-"}${currencyFormatter(spendPerDay)}
    </span>
  );
};

export default index;
