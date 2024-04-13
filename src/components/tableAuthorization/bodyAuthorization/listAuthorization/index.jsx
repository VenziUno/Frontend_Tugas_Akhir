import React from "react";

const ListAuthorization = ({ permissions, setPermissions, menu }) => {
  const handlePermissionChange = (event, menuId, subMenuId, permission) => {
    const newPermissions = { ...permissions };

    if (subMenuId === null) {
      newPermissions[menuId] = {
        ...newPermissions[menuId],
        [permission]: event.target.checked,
      };
    } else {
      if (!newPermissions[menuId]) {
        newPermissions[menuId] = {};
      }
      if (!newPermissions[menuId][subMenuId]) {
        newPermissions[menuId][subMenuId] = {};
      }
      newPermissions[menuId][subMenuId][permission] = event.target.checked;
    }

    setPermissions(newPermissions);
  };

  return (
    <tbody className="capitalize">
      {menu.map((menuItem) => (
        <React.Fragment key={menuItem.id}>
          <tr className="rounded w-full">
            {menuItem.subMenuList !== null ? (
              <React.Fragment>
                <td
                  colSpan={5}
                  className="p-4 border border-y rounded-lg w-1/2 border-slate-400 "
                >
                  {menuItem.menu}
                </td>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <td className="p-4 border-l border-y rounded-l-lg w-1/2 border-slate-400 ">
                  {menuItem.menu}
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.view === true ? true : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, null, "view")
                    }
                  />
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.add === true ? true : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, null, "add")
                    }
                  />
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.update === true ? true : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, null, "update")
                    }
                  />
                </td>
                <td className="p-4 border-y border-r rounded-r-lg text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.delete === true ? true : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, null, "delete")
                    }
                  />
                </td>
              </React.Fragment>
            )}
          </tr>
          {menuItem.subMenuList &&
            menuItem.subMenuList.map((subMenu) => (
              <tr key={subMenu.id} className="rounded w-full">
                <td className="p-4 border-l border-y rounded-l-lg w-1/2 px-12 border-slate-400">
                  {subMenu.subMenu}
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.[subMenu.id]?.view === true
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, subMenu.id, "view")
                    }
                  />
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.[subMenu.id]?.add === true
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(e, menuItem.id, subMenu.id, "add")
                    }
                  />
                </td>
                <td className="p-4 border-y text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.[subMenu.id]?.update === true
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(
                        e,
                        menuItem.id,
                        subMenu.id,
                        "update"
                      )
                    }
                  />
                </td>
                <td className="p-4 border-y border-r rounded-r-lg text-center border-slate-400">
                  <input
                    type="checkbox"
                    checked={
                      permissions[menuItem.id]?.[subMenu.id]?.delete === true
                        ? true
                        : false
                    }
                    onChange={(e) =>
                      handlePermissionChange(
                        e,
                        menuItem.id,
                        subMenu.id,
                        "delete"
                      )
                    }
                  />
                </td>
              </tr>
            ))}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export default ListAuthorization;
