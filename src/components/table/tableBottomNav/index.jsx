import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { usePagination } from "@/hooks/usePagination";

const TableBottomNav = ({ pagination }) => {
  const { from, to, total, current_page, last_page } = pagination;
  const location = useRouter();
  const { asPath } = location;

  const paginationRange = usePagination({
    currentPage: current_page,
    totalPage: last_page,
    siblingCount: 1,
  });

  return (
    <div className="flex flex-row items-center mt-6">
      <div className="flex flex-row items-center gap-4 text-xs h-8">
        <Link
          href={`${asPath.split("?")[0]}?page=${
            current_page === 1 ? 1 : current_page - 1
          }`}
          className={`font-medium px-1.5 py-1.5 w-8 h-full flex justify-center items-center rounded bg-gray-100 border border-slate-400 hover:bg-primary-100 ${
            current_page === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <HiChevronLeft size={14} />
        </Link>
        {paginationRange.map((i, index) => (
          <Link
            key={"pageFromRange" + index}
            href={`${asPath.split("?")[0]}?page=${i}`}
            className={`font-medium px-1.5 py-1.5 w-8 h-full flex justify-center items-center rounded border-slate-400 ${
              current_page === i
                ? "bg-primary-300 border border-primary-300 text-white"
                : "bg-gray-100 border border-gray-200 hover:bg-primary-100"
            }`}
            onClick={(e) => i === "..." && e.preventDefault()}
          >
            {i}
          </Link>
        ))}
        <Link
          href={`${asPath.split("?")[0]}?page=${
            current_page === last_page ? last_page : current_page + 1
          }`}
          className={`font-medium px-1.5 py-1.5 w-8 h-full flex justify-center items-center rounded bg-gray-100 border border-slate-400 hover:bg-primary-100 ${
            current_page === last_page ? "cursor-not-allowed" : ""
          }`}
        >
          <HiChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default TableBottomNav;
