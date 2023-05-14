import React from "react";
import Spinner from "../Icons/Spinner";

export const Loader = ({ label }: { label: string }) => {
  return (
    <div className="mb-3 px-8">
      <div className="flex items-center justify-center rounded-md bg-gray-300 py-2 text-sm text-white">
        <Spinner className="mr-2 h-4 w-4 text-white" />
        {label}
      </div>
    </div>
  );
};

export default Loader;
