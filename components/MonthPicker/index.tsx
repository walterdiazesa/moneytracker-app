import React, { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TransactionContext } from "@/context";

const index = () => {
  const [selectedDate, setSelectedDate] = TransactionContext.useStore(
    (store) => store["lastSelectedMonth"]
  );

  const formattedDate = useMemo(
    () =>
      selectedDate.format({
        year: "numeric",
        month: "long",
        firstUpperCase: true,
      }),
    [selectedDate]
  );

  return (
    <div className="flex w-full items-center justify-center py-4 px-8">
      <div className="flex w-full justify-around rounded-md bg-theme-main py-4">
        <ChevronLeftIcon
          onClick={() =>
            setSelectedDate({
              lastSelectedMonth: selectedDate
                .clone()
                .change("month", -1)
                .getAbsMonth("begin"),
            })
          }
          width={24}
          height={24}
        />
        {formattedDate}
        <ChevronRightIcon
          onClick={() =>
            setSelectedDate({
              lastSelectedMonth: selectedDate
                .clone()
                .change("month", 1)
                .getAbsMonth("begin"),
            })
          }
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};

export default index;
