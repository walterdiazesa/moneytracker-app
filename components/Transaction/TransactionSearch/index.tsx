import Loader from "@/components/Loader";
import { TransactionContext } from "@/context";
import { getTransactionFromFilter } from "@/fetch";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TextInput } from "@tremor/react";
import React, { useState } from "react";
import Transaction from "@/components/Transaction";

const TransactionSearch = () => {
  const [transactionsFromSearch, setTransactionContext] =
    TransactionContext.useStore((store) => store["transactionsFromSearch"]);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="flex p-4">
        <TextInput
          id="search-title"
          icon={MagnifyingGlassIcon}
          placeholder="Título o lugar..."
          className="tremor-input"
        />
        <input
          id="search-from"
          type="date"
          className="mx-1 max-h-10 w-12 rounded-md px-1 sm:min-w-fit input flex justify-center"
          max={new Date().toISOString().split("T")[0]}
        />
        <input
          id="search-to"
          type="date"
          className="mr-1 max-h-10 w-12 rounded-md px-1 sm:min-w-fit input flex justify-center"
          max={new Date().toISOString().split("T")[0]}
        />
        <button
          onClick={() => {
            setIsLoading(true);
            const getSearchInput = (
              input: "title" | "to" | "from"
            ): HTMLInputElement =>
              document.getElementById(`search-${input}`) as HTMLInputElement;

            getTransactionFromFilter({
              title: getSearchInput("title").value,
              ...(getSearchInput("from").valueAsDate && {
                from: getSearchInput("from").valueAsDate,
              }),
              ...(getSearchInput("to").valueAsDate && {
                to: getSearchInput("to").valueAsDate,
              }),
            })
              .then((transactions) =>
                setTransactionContext({ transactionsFromSearch: transactions })
              )
              .finally(() => setIsLoading(false));
          }}
          className="min-w-16 min-h-full rounded-md bg-theme-action px-2.5 hover:bg-theme-action-dark"
        >
          <MagnifyingGlassIcon className="h-4 w-4 text-white" />
        </button>
      </div>
      {isLoading && <Loader label="Obteniendo transacciones filtradas" />}
      {transactionsFromSearch.map((transaction) => (
        <Transaction key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};

export default TransactionSearch;
