import React, { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import { useRouter } from "next/router";
import { useAppContext } from "@/hooks/useAppContext";
import CardNotif from "../card/cardNotif";
import Notifikasi from "../notification";
import CardMember from "../card/cardMember";

const Layout = ({ children, notif }) => {
  const router = useRouter();
  const { menu, user, basic } = useAppContext();
  const { showLogout, deleteItem, printItem, setPrintItem, mulct } = user;
  const { setSelectedMenu, setSelectedSubmenu, setSelectedActionmenu } = menu;
  const { notification, handleShowNotification } = basic;

  useEffect(() => {
    const session = sessionStorage.getItem("token");
    if (!session) {
      router.push("/login");
    }
  }, []);

  const path = router.route;
  const pathMenu = "/" + path.split("/")[1];
  const pathSubMenu = "/" + path.split("/")[2];
  const pathAction = "/" + path.split("/")[3];

  useEffect(() => {
    setSelectedMenu(pathMenu);
    setSelectedSubmenu("");
    setSelectedActionmenu("");
    if (pathSubMenu === "/undefined") {
      setSelectedSubmenu("");
    } else if (
      pathSubMenu === "/add" ||
      pathSubMenu === "/edit" ||
      pathSubMenu === "/archive" ||
      pathSubMenu === "/detail"
    ) {
      setSelectedActionmenu(pathMenu + pathSubMenu);
    } else {
      setSelectedSubmenu(pathMenu + pathSubMenu);
      if (pathAction === "/undefined") {
        setSelectedActionmenu("");
      } else {
        setSelectedActionmenu(pathMenu + pathSubMenu + pathAction);
      }
    }
  }, [
    pathAction,
    pathMenu,
    pathSubMenu,
    setSelectedActionmenu,
    setSelectedMenu,
    setSelectedSubmenu,
  ]);

  useEffect(() => {
    if (notification.show) {
      handleShowNotification();
    }
  }, [handleShowNotification, notification]);

  return (
    <div className="w-full overflow-hidden">
      {notification.show && (
        <Notifikasi
          type={notification.type}
          description={notification.message}
        />
      )}
      {printItem.show && <CardMember />}
      {mulct.show && (
        <>
          <CardNotif
            type="mulct"
            title= {mulct.data}
            mulcts={mulct.mulct}
          />
        </>
      )}
      {deleteItem.show && (
        <CardNotif
          type="delete"
          title="Are you sure you want to Delete this data?"
        />
      )}
      {showLogout && <CardNotif type="logout" title="Yakin Ingin Keluar" />}
      <div className="flex flex-row gap-4 p-4 w-full ">
        <Sidebar />
        <div className="flex flex-col flex-grow h-full  ">
          <Header notif = {notif}/>
          <div className="w-full h-full pt-5 ">
            <div
              className="bg-white rounded-lg shadow scrollbar-thin scrollbar-thumb-primary-200 scrollbar-thumb-rounded scrollbar-track-white hover:scrollbar-thumb-primary-300 overflow-y-auto p-4"
              style={{ height: "calc(100vh - 152px)" }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
