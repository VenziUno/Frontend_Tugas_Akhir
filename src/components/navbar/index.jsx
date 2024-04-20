import React, { useState, useEffect } from "react";
import Button from "../button";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/hooks/useAppContext";
import CardNotif from "../card/cardNotif";
import { AiOutlineSearch } from "react-icons/ai";
import { RiCloseFill } from "react-icons/ri";

const Navbar = ({ home, children }) => {
  const { menu, user } = useAppContext();
  const { showLogout, setShowLogout } = user;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("name");
      const role = sessionStorage.getItem("role");
      setLoggedInUser(name);
      setLoggedInUserRole(role);
    }
  }, []);

  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    setShowLogout(true);
  };

  const handleopen = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      {home ? (
        <div className="bg-black">
          <header className="bg-[url('/2495.jpg')] h-[360px] py-4 opacity-100 ">
            <div className="container mx-auto px-8 lg:px-16 h-full text-white">
              <div className="flex justify-between">
                <div className="flex text-sm justify-center items-center space-x-4">
                  <Image
                    className="w-20 h-16"
                    src="/logo.svg"
                    alt="LOGO"
                    title="LOGO"
                    width={50}
                    height={50}
                  />
                  <div className="w-54 font-bold ">
                    <p>Sekolah Kristen</p>
                    <p>Kalam Kudus 2</p>
                    <p>Batam</p>
                  </div>
                </div>
                <ul className="flex gap-4 items-center">
                  <li>
                    <Link href="/" legacyBehavior>
                      <a className="font-bold">Home</a>
                    </Link>
                  </li>
                  <li>
                    {loggedInUser ? (
                      <React.Fragment>
                        <div className="space-x-4">
                          <button
                            className="px-4 py-2 font-bold text-base inherit bg-danger-base hover:bg-danger-hover shadow rounded"
                            onClick={handleToggleProfileDropdown}
                          >
                            {loggedInUser}
                          </button>
                          {showProfileDropdown && (
                            <div
                              className="absolute top-20 z-60 w-fix bg-white divide-y divide-gray-200 rounded-lg drop-shadow-xl"
                              id="user-dropdown"
                            >
                              <div className="py-2.5 flex flex-col">
                                {loggedInUserRole === "RU003" ? (
                                  <Link
                                    href="/historyTransaksiMember"
                                    legacyBehavior
                                  >
                                    <div className="px-4 py-2 text-black text-md hover:text-primary-800">
                                      History transaksi
                                    </div>
                                  </Link>
                                ) : (
                                  <Link href="/dashboard" legacyBehavior>
                                    <div className="px-4 py-2 text-black text-md hover:text-primary-800">
                                      Dashboard
                                    </div>
                                  </Link>
                                )}
                                <div className="px-4 py-2 text-md text-black hover:text-primary-800 cursor-pointer">
                                  Reset Password
                                </div>
                                <div
                                  className="px-4 py-2 text-md text-black hover:text-primary-800 cursor-pointer"
                                  onClick={(e) => handleLogOut(e)}
                                >
                                  Log Out
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    ) : (
                      <Button width={"text-white"} link="/login">
                        Login
                      </Button>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </header>
          <footer className="relative flex items-center justify-center">
            <div className="absolute -top-10 w-full flex justify-center">
              <div className=" w-full sm:w-2/3 md:w-2/3 lg:w-1/2 px-6">
                <div
                  className={`flex border border-slate-400 bg-white shadow text-base py-4 outline-none w-full rounded px-6`}
                >
                  <input
                    autoComplete="off"
                    type="text"
                    placeholder={"Enter keyword to search collection..."}
                    className={`w-full pl-1 outline-none`}
                  />
                  <button
                    className="p-2 hover:rounded-full hover:bg-slate-400"
                    onClick={handleopen}
                  >
                    <AiOutlineSearch size={32} />
                  </button>
                </div>
                {open ? (
                  <div className="space-y-4 p-6 bg-white border mt-5 rounded border-slate-400">
                    <div className="flex justify-between items-center">
                      <div className="text-lg">Search By:</div>
                      <div>
                        <RiCloseFill
                          className=" text-danger-base"
                          size={24}
                          onClick={handleopen}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-info-base border px-4 py-2 rounded border-info-base">
                        All
                      </div>
                      <div className="bg-white border px-4 py-2 rounded border-slate-400 hover:border-primary-500 hover:bg-primary-200">
                        Author
                      </div>
                      <div className="bg-white border px-4 py-2 rounded border-slate-400 hover:border-primary-500 hover:bg-primary-200">
                        Subject
                      </div>
                      <div className="bg-white border px-4 py-2 rounded border-slate-400 hover:border-primary-500 hover:bg-primary-200">
                        ISBN/ISSN
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <div className="w-full h-20 bg-primary-500 sticky top-0">
          {showLogout && <CardNotif type="logout" title="Yakin Ingin Keluar" />}
          <div className="container mx-auto px-8 lg:px-16 h-full text-white">
            <div className="flex justify-between items-center h-full">
              <div className="flex text-sm justify-center items-center space-x-4">
                <Image
                  className="w-20 h-16"
                  src="/logo.svg"
                  alt="LOGO"
                  title="LOGO"
                  width={50}
                  height={50}
                />
                <div className="w-54 font-bold">
                  <p>Sekolah Kristen</p> <p>Kalam Kudus 2</p> <p>Batam</p>
                </div>
              </div>
              <ul className="flex gap-4 items-center">
                <li>
                  <Link href="/" legacyBehavior>
                    <a className="font-bold">Home</a>
                  </Link>
                </li>
                <li>
                  {loggedInUser ? (
                    <React.Fragment>
                      <div className="space-x-4">
                        <button
                          className="px-4 py-2 font-bold text-base inherit bg-danger-base hover:bg-danger-hover shadow rounded"
                          onClick={handleToggleProfileDropdown}
                        >
                          {loggedInUser}
                        </button>
                        {showProfileDropdown && (
                          <div
                            className="absolute top-20 z-60 w-fix bg-white divide-y divide-gray-200 rounded-lg drop-shadow-xl"
                            id="user-dropdown"
                          >
                            <div className="py-2.5 flex flex-col">
                              <Link
                                href="/historyTransaksiMember"
                                legacyBehavior
                              >
                                <div className="px-4 py-2 text-black text-md hover:text-primary-800">
                                  History transaksi
                                </div>
                              </Link>
                              <div className="px-4 py-2 text-md text-black hover:text-primary-800 cursor-pointer">
                                Reset Password
                              </div>
                              <div
                                className="px-4 py-2 text-md text-black hover:text-primary-800 cursor-pointer"
                                onClick={(e) => handleLogOut(e)}
                              >
                                Log Out
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  ) : (
                    <Button
                      width={"text-white"}
                      action={"danger"}
                      link="/login"
                    >
                      Login
                    </Button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <div>{children}</div>
      <footer className="bg-gray-800 text-gray-300 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-center text-center items-center">
            <div className="mb-4 md:mb-0">
              <p>
                &copy; {currentYear}{" "}
                <span className="font-bold px-1">
                  Sekolah Kalam Kudus 2 Batam.
                </span>{" "}
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Navbar;
