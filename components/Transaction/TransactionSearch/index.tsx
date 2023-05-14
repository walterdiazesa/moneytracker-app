import Loader from "@/components/Loader";
import { TransactionContext } from "@/context";
import { getTransactionFromFilter } from "@/fetch";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TextInput, DateRangePicker } from "@tremor/react";
import React, { useState } from "react";
import Transaction from "@/components/Transaction";

const TransactionSearch = () => {
  const [transactionsFromSearch, setTransactionContext] =
    TransactionContext.useStore((store) => store["transactionsFromSearch"]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="m-4 flex">
        <TextInput
          id="search-title"
          icon={MagnifyingGlassIcon}
          placeholder="Título o lugar..."
        />
        <DateRangePicker
          id="search-from"
          className="mx-1 max-w-[50px]"
          enableDropdown={false}
          placeholder=""
          maxDate={new Date()}
        />
        <DateRangePicker
          id="search-to"
          className="mr-1 max-w-[50px]"
          enableDropdown={false}
          placeholder=""
          maxDate={new Date()}
        />
        <div
          onClick={() => {
            setIsLoading(true);
            const getSearchInput = (
              input: "title" | "to" | "from"
            ): HTMLInputElement =>
              document.getElementById(`search-${input}`) as HTMLInputElement;
            getTransactionFromFilter({
              title: getSearchInput("title").value,
              ...(getSearchInput("from").innerText && {
                from: new Date(getSearchInput("from").innerText),
              }),
              ...(getSearchInput("to").innerText && {
                to: new Date(getSearchInput("to").innerText),
              }),
            })
              .then((transactions) =>
                setTransactionContext({ transactionsFromSearch: transactions })
              )
              .finally(() => setIsLoading(false));
          }}
          className="min-w-16 flex min-h-full items-center justify-center rounded-md bg-white px-2.5"
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      {isLoading && <Loader label="Obteniendo transacciones filtradas" />}
      {transactionsFromSearch.map((transaction) => (
        <Transaction key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};

export default TransactionSearch;
