import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Tabs = ({ list, pathName, children, id }) => {
  const location = useRouter();
  const path = location.route;

  return (
    <div className="w-full text-sm relative">
      {/* Tab Head */}
      <div className="flex text-gray-400 font-medium w-fit">
        {list.map((i) => {
          let selected = "";
          if (path === `${pathName}${i.tab}`) {
            selected = "border-b-2";
          }
          return (
            <div className={`px-5 py-2 ${selected}`} key={"tab" + i.tab}>
              <Link href={ id !== null || undefined ? `${pathName}${i.tab}`: `${pathName}${i.tab}/${id}`}>{i.name}</Link>
            </div>
          );
        })}
      </div>
      {/* Tab Body */}
      <div className="">{children}</div>
    </div>
  );
};

export default Tabs;