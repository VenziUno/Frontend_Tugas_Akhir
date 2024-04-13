import React from "react";

const TableHead = ({
  table_head_formatted,
  actionAdd,
  actionView,
  actionDelete,
  actionEdit,
  actionReturn,
  actionAppoval,
  actionRequest,
}) => {
  return (
    <thead className="uppercase">
      <tr className="bg-gradient-to-r from-primary-50/50 to-primary-500 rounded ">
        <td className="p-4 border-l border-y rounded-l-lg w-4 text-center border-slate-400">
          No
        </td>
        {table_head_formatted.map((head) => (
          <React.Fragment key={head}>
            {head === "approval" ? (
              <td className="p-4 text-left border-y border-slate-400">
                {actionAppoval ? "Extension" : null}
                {actionRequest ? "Approval" : null}
              </td>
            ) : (
              <td className="p-4 text-left border-y border-slate-400">
                {head}
              </td>
            )}
          </React.Fragment>
        ))}
        <td className="p-4 w-fit border-y border-r rounded-r-lg text-center border-slate-400">
          {(actionView ||
            actionAdd ||
            actionDelete ||
            actionEdit ||
            actionReturn) &&
            "Action"}
        </td>
      </tr>
    </thead>
  );
};
export default TableHead;
