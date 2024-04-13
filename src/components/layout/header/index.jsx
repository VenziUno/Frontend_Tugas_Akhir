import React, { useState } from "react";
import Link from "next/link";
import { HiOutlineBell, HiOutlineCog } from "react-icons/hi";
import { useAppContext } from "@/hooks/useAppContext";

const Header = ({ notif }) => {
  const { menu, user } = useAppContext();
  const { setShowLogout } = user;
  const { header } = menu;
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    setShowLogout(true);
  };

  return (
    <div className="flex flex-row justify-between items-center bg-primary-500 shadow rounded-lg px-6 w-full h-[100px] py-auto">
      <div className="flex flex-col space-y-2">
        {header && <div className="font-bold text-3xl">{header.title}</div>}
        {header && header.detail && (
          <div className="font-medium text-sm">{header.detail}</div>
        )}
      </div>
      <div className="flex  space-x-4">
        {/* <Link href="/notif" legacyBehavior>
          <a className=" py-4  rounded-full text-neutral-3 hover:cursor-pointer hover:text-primary-800">
            <HiOutlineBell size={24} />
          </a>
        </Link> */}
        <button
          className="relative py-4 rounded-full text-neutral-3 hover:cursor-pointer hover:text-primary-800"
          onClick={() => setShowNotif(!showNotif)}
        >
          <HiOutlineBell size={26} />
          {notif && notif.length > 0 && (
            <span className="absolute top-3 right-0 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-xs font-semibold">
              <span className=" text-xs">{notif.length}</span>
            </span>
          )}
        </button>

        {/* Tampilkan notifikasi jika tombol ditekan */}
        {notif && showNotif && (
          <div className="absolute top-20 right-20 mt-12 bg-white w-96 h-96 border border-gray-200 rounded-lg shadow-lg p-4 z-10 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-primary-100 scrollbar-thumb-rounded scrollbar-track-rounded hover:scrollbar-thumb-primary-300 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Notifikasi</h2>
            {notif.length > 0 ? (
              notif.map((message, index) => (
                <div
                  key={index}
                  className="mb-2 border-t py-2 border-slate-400"
                >
                  {message}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Tidak ada notifikasi saat ini.
              </p>
            )}
          </div>
        )}

        {/* <Link href="/settings/level" legacyBehavior>
          <a className="py-4 rounded-full text-neutral-3 hover:cursor-pointer hover:text-primary-800">
            <HiOutlineCog size={24} />
          </a>
        </Link> */}
        <div className="flex flex-col items-end relative">
          <button
            className="flex flex-row items-center gap-4"
            onClick={handleToggleProfileDropdown}
          >
            <div className="flex flex-col gap-1 justify-center items-end px-4">
              <div className="font-semibold text-sm text-neutral-4">
                {/* {user_info.name} */} Pendi
              </div>
              <div className="font-normal text-sm text-neutral-3">
                {/* {user_info.role} */} Administrator
              </div>
            </div>
            <div className="overflow-hidden relative w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-600">
              <svg
                className="absolute -left-1 w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </button>
          {showProfileDropdown && (
            <div
              className="absolute top-20 z-20 w-[260px] bg-white
              divide-y divide-gray-200 rounded-lg drop-shadow-xl"
              id="user-dropdown"
            >
              {/* <div className="py-2.5 flex flex-col cursor-default">
                <Link href="/profile" legacyBehavior>
                  <div className="px-4 py-2 text-md font-medium hover:text-primary-800">
                    Profile
                  </div>
                </Link>
                <Link href="/settings/account" legacyBehavior>
                  <div className="px-4 py-2 text-md hover:text-primary-800 hover:underline">
                    Settings
                  </div>
                </Link>
              </div> */}
              <div className="py-2.5 flex flex-col">
                <Link href="/password" legacyBehavior>
                  <div className="px-4 py-2 text-md hover:text-primary-800">
                    Password
                  </div>
                </Link>
                <div
                  className="px-4 py-2 text-md hover:text-primary-800 cursor-pointer"
                  onClick={(e) => handleLogOut(e)}
                >
                  Log Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
