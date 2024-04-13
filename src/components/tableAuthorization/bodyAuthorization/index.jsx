import React from "react";
import ListAuthorization from "./listAuthorization";

const BodyAuthorization = ({
  permissions,
  setPermissions,
  checkAllState,
  setCheckAllState,
  menu,
}) => {
  return (
    <table className="border-separate border-spacing-y-2 w-full px-4">
      <thead className="uppercase">
        <tr className="bg-gradient-to-r from-primary-50/50 to-primary-500 rounded w-full">
          <td className="p-4 border-l border-y rounded-l-lg w-1/2 text-center border-slate-400">Menu</td>
          <td className="p-4 border-y text-center border-slate-400">View</td>
          <td className="p-4 border-y text-center border-slate-400">Add</td>
          <td className="p-4 border-y text-center border-slate-400">Update</td>
          <td className="p-4 border-y border-r rounded-r-lg text-center border-slate-400">Delete</td>
        </tr>
      </thead>
      <ListAuthorization
        permissions={permissions}
        setPermissions={setPermissions}
        checkAllState={checkAllState}
        setCheckAllState={setCheckAllState}
        menu={menu}
      />
    </table>
  );
};

export default BodyAuthorization;
