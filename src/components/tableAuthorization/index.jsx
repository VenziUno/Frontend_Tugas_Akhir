import React, { useEffect, useState } from "react";
import HeadAuthorization from "./headAuthorization";
import BodyAuthorization from "./bodyAuthorization";
import { useFetcher } from "@/hooks/useFetcher";
import { useAppContext } from "@/hooks/useAppContext";
import axios from "axios";

const TableAuthorization = () => {
  const { basic } = useAppContext();
  const { notification, setNotification, handleShowNotification } = basic;
  const [permissions, setPermissions] = useState({});
  const [checkAllState, setCheckAllState] = useState(false);
  const { res, isLoading, isError } = useFetcher("role");
  const [terpilih, setTerpilih] = useState(null);
  const {
    res: resMenu,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
  } = useFetcher("menu");
  const {
    res: resAuthorization,
    isLoading: isLoadingAuthorization,
    isError: isErrorAuthorization,
  } = useFetcher(`authorization/${terpilih ? terpilih : "RU001"}`);
  const [selectOptions, setSelectOptions] = useState([]);
  const [menuOtorisasi, setMenuOtorisasi] = useState([]);
  const [form, setForm] = useState({
    role_id: "RU001",
    otorisasi: null,
  });

  useEffect(() => {
    if (resMenu !== undefined) {
      const menu = resMenu.map((item) => ({
        id: item.id,
        menu: item.name,
        subMenuList:
          item.sub_menus.length > 0
            ? item.sub_menus.map((subItem) => ({
                id: subItem.id,
                subMenu: subItem.name,
              }))
            : null,
      }));
      setMenuOtorisasi(menu);
    }
  }, [resMenu]);

  useEffect(() => {
    const groupPermissions = (data) => {
      const groupedData = {};
      if (data !== undefined) {
        data.forEach((item) => {
          const { menu_id, sub_menu_id, authorization_type_id } = item;
          let authorizationType = "";
          if (authorization_type_id === 1) {
            authorizationType = "view";
          } else if (authorization_type_id === 2) {
            authorizationType = "add";
          } else if (authorization_type_id === 3) {
            authorizationType = "delete";
          } else if (authorization_type_id === 4) {
            authorizationType = "update";
          }
          if (!groupedData[menu_id]) {
            groupedData[menu_id] = {};
          }
          if (sub_menu_id !== null) {
            if (!groupedData[menu_id][sub_menu_id]) {
              groupedData[menu_id][sub_menu_id] = {};
            }
            if (!groupedData[menu_id][sub_menu_id][authorizationType]) {
              groupedData[menu_id][sub_menu_id][authorizationType] = {};
            }
            groupedData[menu_id][sub_menu_id][authorizationType] = true;
          } else {
            if (!groupedData[menu_id][authorizationType]) {
              groupedData[menu_id][authorizationType] = {};
            }
            groupedData[menu_id][authorizationType] = true;
          }
        });
      }
      return groupedData;
    };
    if (resAuthorization !== undefined) {
      const data = resAuthorization.data;
      const groupedPermissions = groupPermissions(data);
      setPermissions(groupedPermissions);
    }
  }, [resAuthorization]);

  useEffect(() => {
    if (res) {
      const data = res.data.map((role) => ({
        label: role.name,
        value: role.id
      }))
      setSelectOptions(data);
    }
  }, [res]);

  const handleCheckAll = () => {
    const newPermissions = { ...permissions };
    const newCheckAllState = !checkAllState;
    for (const menuItem of menuOtorisasi) {
      if (menuItem.subMenuList) {
        for (const subMenu of menuItem.subMenuList) {
          if (!newPermissions[menuItem.id]) {
            newPermissions[menuItem.id] = {};
          }
          if (!newPermissions[menuItem.id][subMenu.id]) {
            newPermissions[menuItem.id][subMenu.id] = {};
          }
          newPermissions[menuItem.id][subMenu.id] = {
            view: newCheckAllState,
            add: newCheckAllState,
            update: newCheckAllState,
            delete: newCheckAllState,
          };
        }
      } else {
        newPermissions[menuItem.id] = {
          view: newCheckAllState,
          add: newCheckAllState,
          update: newCheckAllState,
          delete: newCheckAllState,
        };
      }
    }
    setPermissions(newPermissions);
    setCheckAllState(newCheckAllState); 
  };

  const handleChangeRole = (item) => {
    setTerpilih(item.value);
    setForm({ ...form, role_id: item.value });
  };

  useEffect(() => {
    const convertPermissionsToOutput = (permissions) => {
      const output = {};
      const permissionMap = {
        view: 1,
        add: 2,
        update: 3,
        delete: 4,
      };

      for (const key in permissions) {
        if (permissions.hasOwnProperty(key)) {
          const permissionKeys = Object.keys(permissions[key]);

          const submenuKeys = Object.keys(permissions[key]).filter(
            (submenu) => !isNaN(parseInt(submenu))
          );

          const hasTruePermission = permissionKeys.some(
            (permission) => permissions[key][permission] === true
          );

          if (hasTruePermission) {
            const validPermissionKeys = permissionKeys.filter(
              (permission) => permissions[key][permission] === true
            );

            output[key] = validPermissionKeys.map(
              (permission) => `${key}_null_${permissionMap[permission]}`
            );
          }
          submenuKeys.forEach((submenuKey) => {
            const submenuPermissions = Object.keys(
              permissions[key][submenuKey]
            );

            const validSubmenuPermissions = submenuPermissions.filter(
              (permission) => permissions[key][submenuKey][permission] === true
            );

            if (validSubmenuPermissions.length > 0) {
              output[key] = output[key] || [];
              output[key].push(
                ...validSubmenuPermissions.map(
                  (permission) =>
                    `${key}_${submenuKey}_${permissionMap[permission]}`
                )
              );
            }
          });
        }
      }
      const outputArray = Object.values(output).flat();
      return outputArray;
    };
    const output = convertPermissionsToOutput(permissions);
    setForm({ ...form, otorisasi: output });
  }, [permissions]);

  const handleUpdateAuthorization = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/authorization`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotification({
        show: true,
        type: "Success",
        message: res.data.message,
      });
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  return (
    <div>
      <HeadAuthorization
        handleCheckAll={handleCheckAll}
        selectOptions={selectOptions}
        handleChangeRole={handleChangeRole}
        handleUpdateAuthorization={handleUpdateAuthorization}
      />
      <BodyAuthorization
        permissions={permissions}
        setPermissions={setPermissions}
        checkAllState={checkAllState}
        setCheckAllState={setCheckAllState}
        menu={menuOtorisasi}
      />
    </div>
  );
};

export default TableAuthorization;