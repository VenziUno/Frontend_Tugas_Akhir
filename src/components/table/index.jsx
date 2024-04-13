import React, { useEffect, useState } from "react";
import TableTopNav from "./tableTopNav";
import TableHead from "./tableHead";
import TableBody from "./tableBody";
import TableBottomNav from "./tableBottomNav";
import { useRouter } from "next/router";
import { HiOutlineXCircle } from "react-icons/hi2";

const Tabel = ({
  title,
  buttonAdd,
  buttonBack,
  buttonPrint,
  buttonPrintBatcode,
  search,
  list,
  data,
  actionDelete,
  actionEdit,
  actionDetail,
  actionAppoval,
  actionRequest,
  actionView,
  actionAdd,
  actionPrint,
  actionReturn,
  actionPrintBarcode,
  pagination,
}) => {
  let tableHead = [];
  let table_head_formatted = [];

  if (data && data.length > 0) {
    data.forEach((rowData) => {
      Object.keys(rowData).forEach((key) => {
        const splitKey = key.split("_");
        const formattedKey = splitKey.join(" ");
        if (
          key !== "id" &&
          key !== "rfid" &&
          // key !== "approval" &&
          key !== "created_at" &&
          key !== "deleted_at" &&
          key !== "updated_at"
        ) {
          if (key === "file") {
            if (
              !tableHead.includes(key) &&
              !table_head_formatted.includes(formattedKey)
            ) {
              tableHead.unshift(key);
              table_head_formatted.unshift(formattedKey);
            }
          } else {
            if (!table_head_formatted.includes(formattedKey)) {
              tableHead.push(key);
              table_head_formatted.push(formattedKey);
            }
          }
        }
      });
    });
  }

  const location = useRouter();

  const [pathnameWithId, setPathnameWithId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathWithId = location.pathname;
  const id = location.query.id;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      if (pathWithId.includes("[id]")) {
        setPathnameWithId(pathWithId.replace("[id]", id));
      } else {
        setPathnameWithId(pathWithId);
      }
    }, 2000);
  }, [pathWithId, id]);

  const path = pathnameWithId;

  return (
    <div className={`buttonAdd ? ("p-4 h-fit w-full") : ('')`}>
      <TableTopNav
        path={path}
        data={data}
        title={title}
        buttonBack={buttonBack}
        buttonAdd={buttonAdd}
        buttonPrint={buttonPrint}
        buttonPrintBatcode={buttonPrintBatcode}
        search={search}
        list={list}
      />
      {isLoading ? ( // Tampilkan pesan loading jika masih dalam proses penarikan data
        <div className="flex flex-col align-middle justify-center items-center gap-2 h-96">
          <div>
            <svg
              aria-hidden="true"
              className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : data && data.length > 0 ? (
        <React.Fragment>
          <table className="border-separate border-spacing-y-3 w-full">
            <TableHead
              table_head_formatted={table_head_formatted}
              data={data}
              actionAdd={actionAdd}
              actionView={actionView}
              actionEdit={actionEdit}
              actionAppoval={actionAppoval}
              actionRequest={actionRequest}
              actionDelete={actionDelete}
              actionReturn={actionReturn}
            />
            <TableBody
              path={path}
              data={data}
              tableHead={tableHead}
              actionView={actionView}
              actionAdd={actionAdd}
              actionEdit={actionEdit}
              actionPrint={actionPrint}
              actionAppoval={actionAppoval}
              actionRequest={actionRequest}
              actionPrintBarcode={actionPrintBarcode}
              actionDelete={actionDelete}
              actionDetail={actionDetail}
              actionReturn={actionReturn}
              indexStartFrom={pagination ? pagination.from : 1}
            />
          </table>
          {pagination && <TableBottomNav pagination={pagination} />}
        </React.Fragment>
      ) : (
        <div className="flex flex-col align-middle justify-center items-center gap-2 h-96">
          <HiOutlineXCircle size={80} className="text-primary-400" />
          <span className="text-5xl font-medium text-primary-400">
            Data Not Found
          </span>
        </div>
      )}
    </div>
  );
};

export default Tabel;
