import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { AiOutlineDown, AiOutlineLogout, AiOutlineUp } from "react-icons/ai";
import Link from "next/link";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { useRouter } from "next/router";
import { RiDashboardLine } from "react-icons/ri";

const Sidebar = () => {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const [menus, setMenus] = useState([]);

  const { menu, user } = useAppContext();
  const { configMenu, selectedMenu, selectedSubmenu, setSelectedMenu } = menu;
  const { setShowLogout } = user;
  const [showSidemenu, setShowSidemenu] = useState(true);
  const [showDropdown, setShowDropdown] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("member");
      setMember(name);
    }
  }, []);
  const [member, setMember] = useState(false);

  useEffect(() => {
    setMenus(configMenu.mainMenu);
  }, []);

  const handleSubMenuClick = (route) => {
    setShowDropdown((prev) => ({
      ...prev,
      [route]: !prev[route],
    }));
  };

  return (
    <div
      className="relative w-full bg-primary-500 text-black shadow flex flex-col gap-6 px-6 py-6 rounded-lg max-w-[256px] "
      style={{ height: "calc(100vh - 32px)" }}
    >
      <div className="flex justify-center items-center space-x-4 ">
        <Image
          className="w-16 h-20"
          src="/logo.svg"
          alt="LOGO"
          title="LOGO"
          width={250}
          height={250}
        />
        <div className="w-40 font-bold ">
          <p>Sekolah Kristen</p>
          <p>Kalam Kudus 2</p>
          <p>Batam</p>
        </div>
      </div>
      <div className="space-y-2 flex flex-col gap-1 pr-4 scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-primary-500 scrollbar-thumb-rounded scrollbar-track-rounded hover:scrollbar-thumb-primary-300 overflow-y-auto">
        {member ? (
          <React.Fragment>
            <div className="flex flex-col gap-1 bg-primary-500">
              <Link href="/" legacyBehavior>
                <a className="p-2 hover:bg-primary-200">
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-row items-center ">
                      <div className="w-8">
                        <RiDashboardLine />
                      </div>
                      Home
                    </div>
                  </div>
                </a>
              </Link>
              <Link href="/historyTransaksiMember" legacyBehavior>
                <a className="p-2 hover:bg-primary-200">
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-row items-center ">
                      <div className="w-8">
                        <RiDashboardLine />
                      </div>
                      History Transaksi
                    </div>
                  </div>
                </a>
              </Link>
              <Link href="/login" legacyBehavior>
                <a
                  className="p-2  hover:bg-primary-200"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowLogout(true);
                  }}
                >
                  <div className="flex flex-row justify-between items-center gap-4">
                    <div className="flex flex-row items-center">
                      <div className="w-8">
                        <AiOutlineLogout />
                      </div>
                      Logout
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {menus &&
              menus.map(({ route, name, subMenu, icon }) => (
                <div key={route}>
                  {subMenu === undefined ? (
                    <div className="flex flex-col gap-1 bg-primary-500">
                      <Link
                        href={subMenu ? "" : route}
                        key={route}
                        legacyBehavior
                      >
                        <a
                          title={showSidemenu ? "" : name}
                          className={
                            selectedMenu === route
                              ? `p-2 bg-primary-300`
                              : `p-2 hover:bg-primary-200`
                          }
                          onClick={(e) => {
                            if (!showSidemenu) {
                              setShowSidemenu(true);
                            }
                            if (route === "/logout") {
                              e.preventDefault();
                              setShowLogout(true);
                            } else if (subMenu) {
                              handleSubMenuClick(route);
                            }
                          }}
                        >
                          <div className="flex flex-row justify-between items-center gap-4">
                            <div className="flex flex-row items-center">
                              <div className={showSidemenu ? "w-8" : ""}>
                                {icon}
                              </div>
                              {showSidemenu && name}
                            </div>
                            {subMenu &&
                              showSidemenu &&
                              (selectedMenu === route || showDropdown[route] ? (
                                <HiChevronUp size={16} />
                              ) : (
                                <HiChevronDown size={16} />
                              ))}
                          </div>
                        </a>
                      </Link>
                    </div>
                  ) : (
                    <div
                      title={showSidemenu ? "" : name}
                      className={`p-2 ${
                        selectedMenu === route
                          ? "bg-primary-300"
                          : "hover:bg-primary-200"
                      }`}
                      onClick={() => handleSubMenuClick(route)}
                    >
                      <div className="flex flex-row justify-between items-center gap-4">
                        <div className="flex flex-row items-center">
                          <div className={showSidemenu ? "w-8" : ""}>
                            {icon}
                          </div>
                          {showSidemenu && name}
                        </div>
                        {showSidemenu &&
                          (selectedMenu === route || showDropdown[route] ? (
                            <HiChevronUp size={16} />
                          ) : (
                            <HiChevronDown size={16} />
                          ))}
                      </div>
                    </div>
                  )}
                  {showSidemenu &&
                    (selectedMenu === route || showDropdown[route]) &&
                    subMenu && (
                      <div className="flex flex-row justify-center">
                        <div className="bg-primary-500 flex flex-col w-full">
                          {subMenu.map((sub) => (
                            <Link
                              href={sub.route}
                              key={sub.route}
                              legacyBehavior
                            >
                              <a
                                className={
                                  selectedSubmenu === sub.route
                                    ? "pl-6 py-2 bg-primary-300"
                                    : "pl-6 py-2 hover:bg-primary-200"
                                }
                              >
                                {sub.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
