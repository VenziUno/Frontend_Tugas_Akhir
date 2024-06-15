import { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { RiArticleLine, RiDashboardLine } from "react-icons/ri";

export const useMenuProvider = () => {
  const configMenu = {
    mainMenu: [
      {
        id: 1,
        route: "/dashboard",
        name: "Dashboard",
        title: "Dashboard",
        detail: "Hello !",
        icon: <RiDashboardLine />,
      },
      {
        id: 2,
        route: "/master",
        name: "Master",
        title: "Master",
        icon: <RiDashboardLine />,
        subMenu: [
          {
            id: 1,
            route: "/master/gmd",
            name: "GMD",
            title: "GMD",
            detail: "See GMD details here!",
          },
          {
            id: 2,
            route: "/master/mediaType",
            name: "Media Type",
            title: "Media Type",
            detail: "See media type details here!",
          },
          {
            id: 3,
            route: "/master/contentType",
            name: "Content Type",
            title: "Content Type",
            detail: "See Content type details here!",
          },
          {
            id: 4,
            route: "/master/carrierType",
            name: "Carrier Type",
            title: "Carrier Type",
            detail: "Seearrier type details here!",
          },
          {
            id: 5,
            route: "/master/publisher",
            name: "Publisher",
            title: "Publisher",
            detail: "See Publisher details here!",
          },
          // {
          //   id: 6,
          //   route: "/master/supplier",
          //   name: "Supplier",
          //   title: "Supplier",
          //   detail: "See Supplier details here!",
          // },
          {
            id: 7,
            route: "/master/author",
            name: "Author",
            title: "Author",
            detail: "See Author details here!",
          },
          {
            id: 8,
            route: "/master/subject",
            name: "Subject",
            title: "Subject",
            detail: "See Subject details here!",
          },
          {
            id: 9,
            route: "/master/location",
            name: "Location",
            title: "Location",
            detail: "See Location details here!",
          },
          {
            id: 10,
            route: "/master/place",
            name: "Place",
            title: "Place",
            detail: "See Place details here!",
          },
          {
            id: 11,
            route: "/master/itemStatus",
            name: "Item Status",
            title: "Item Status",
            detail: "See Item Status details here!",
          },
          {
            id: 12,
            route: "/master/collectionType",
            name: "Collection Type",
            title: "Collection Type",
            detail: "See Collection Type details here!",
          },
          {
            id: 13,
            route: "/master/docLanguage",
            name: "Doc. Language",
            title: "Doc. Language",
            detail: "See Doc. Language details here!",
          },
          {
            id: 14,
            route: "/master/label",
            name: "Label",
            title: "Label",
            detail: "See Label details here!",
          },
        ]
      },
      // {
      //   id: 2,
      //   route: "/banner",
      //   name: "Banner",
      //   title: "Banner",
      //   detail: "Banner Details",
      //   icon: <RiDashboardLine />,
      // },
      {
        id: 3,
        route: "/bookDetail",
        name: "Book",
        title: "Book",
        detail: "See book details here!",
        icon: <RiDashboardLine />,
        // subMenu: [
          // {
          //   id: 1,
          //   route: "/book/bookCategory",
          //   name: "Book Category",
          //   title: "Book Category",
          //   detail: "See book category details here!",
          // },
          // {
          //   id: 2,
          //   route: "/book/bookCatalog",
          //   name: "Book Catalog",
          //   title: "Book Catalog",
          //   detail: "See book Catalog details here!",
          // },
          // {
          //   id: 1,
          //   route: "",
          //   name: "Book Detail",
          //   title: "Book Detail",

          // },
          // {
          //   id: 3,
          //   route: "/book/bookRfid",
          //   name: "Book RFID",
          //   title: "Book RFID Detail",
          //   detail: "See book rfis details here!",
          // },
        // ]
      },
      {
        id: 4,
        route: "/member",
        name: "Member",
        title: "Member",
        detail: "Member Details",
        icon: <RiDashboardLine />,
      },
      {
        id: 5,
        route: "/transaction",
        name: "Transaction",
        title: "Transaction",
        icon: <RiDashboardLine />,
        subMenu: [
          {
            id: 3,
            route: "/transaction/borrowing",
            name: "Loaned",
            title: "Loaned",
            detail: "See loaned details here!",
          },
          {
            id: 4,
            route: "/transaction/reversion",
            name: "Returned",
            title: "Returned",
            detail: "See returned details here!",
          },
          // {
          //   id: 5,
          //   route: "/transaction/mulct",
          //   name: "Mulct",
          //   title: "Mulct",
          //   detail: "See mulct details here!",
          // },
        ],
      },
      {
        id: 6,
        route: "/report",
        name: "Report",
        title: "Report",
        detail: "Report Details",
        icon: <RiDashboardLine />,
        subMenu: [
          {
            id: 1,
            route: "/report/transaction",
            name: "Transaction Report",
            title: "Transaction Report",
            detail: "See transaction report details here!",
          },
          {
            id: 2,
            route: "/report/book",
            name: "Book Report",
            title: "Book Report",
            detail: "See book details here!",
          },
        ]
      },
      {
        id: 7,
        route: "/settings",
        name: "Setting",
        title: "Setting",
        icon: <RiDashboardLine />,
        subMenu: [
          {
            id: 6,
            route: "/settings/account",
            name: "Account",
            title: "Account Details",
            detail: "See Account details here!",
          },
          {
            id: 7,
            route: "/settings/role",
            name: "Role",
            title: "Role Details",
            detail: "See Role details here!",
          },
          {
            id: 8,
            route: "/settings/authorization",
            name: "Authorization",
            title: "Authorization Details",
            detail: "See Authorization details here!",
          },
          // {
          //   id: 9
          //   route: "/settings/activity",
          //   name: "Activity Log",
          //   title: "Activity Log Details",
          //   detail: "See Authorization details here!",
          // },
          // {
          //   id: 10,
          //   route: "/settings/configRfid",
          //   name: "Config RFID",
          //   title: "Authorization Details",
          //   detail: "See Authorization details here!",
          // },
        ],
      },
      {
        id: 8,
        route: "/logout",
        name: "Logout",
        title: "Logout",
        detail: "Logout",
        icon: <AiOutlineLogout />,
      },
    ],
    additionalMenu: [
      {
        route: "/profile",
        name: "Profile",
        title: "Your Profile",
        detail: "Update your photo and details here!",
      },
      {
        route: "/password",
        name: "Password",
        title: "Change Password",
        detail: "Update your Password here!",
      },
    ],
  };

  const [selectedMenu, setSelectedMenu] = useState("/dashboard");
  const [selectedSubmenu, setSelectedSubmenu] = useState("");
  const [selectedActionmenu, setSelectedActionmenu] = useState("");

  let header;
  const findSelectedMenuInMain = configMenu.mainMenu.find(
    (i) => selectedMenu === i.route
  );
  if (findSelectedMenuInMain) {
    header = {
      title: findSelectedMenuInMain.title,
      detail: findSelectedMenuInMain.detail,
    };
    if (selectedSubmenu && findSelectedMenuInMain.subMenu) {
      const findSelectedSubmenuInMain = findSelectedMenuInMain.subMenu.find(
        (i) => selectedSubmenu === i.route
      );
      if (findSelectedSubmenuInMain) {
        header = {
          title: findSelectedSubmenuInMain.title,
          detail: findSelectedSubmenuInMain.detail,
        };
      }
      // if (selectedActionmenu && findSelectedSubmenuInMain.actionMenu) {
      //   const findSelectedActionmenuInSub =
      //     findSelectedSubmenuInMain.actionMenu.find(
      //       (i) => selectedActionmenu === i.route
      //     );
      //   if (findSelectedActionmenuInSub) {
      //     header = {
      //       title: findSelectedActionmenuInSub.title,
      //       detail: findSelectedActionmenuInSub.detail,
      //     };
      //   }
      // }
    } else {
      if (selectedActionmenu && findSelectedMenuInMain.actionMenu) {
        const findSelectedActionmenuInMain =
          findSelectedMenuInMain.actionMenu.find(
            (i) => selectedActionmenu === i.route
          );
        if (findSelectedActionmenuInMain) {
          header = {
            title: findSelectedActionmenuInMain.title,
            detail: findSelectedActionmenuInMain.detail,
          };
        }
      }
    }
  } else {
    const findSelectedMenuInAdditional = configMenu.additionalMenu.find(
      (i) => selectedMenu === i.route
    );
    if (findSelectedMenuInAdditional) {
      header = {
        title: findSelectedMenuInAdditional.title,
        detail: findSelectedMenuInAdditional.detail,
      };
    }
  }

  return {
    configMenu,
    header,
    selectedMenu,
    setSelectedMenu,
    selectedSubmenu,
    setSelectedSubmenu,
    selectedActionmenu,
    setSelectedActionmenu,
  };
};
