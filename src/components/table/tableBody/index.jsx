import Button from "@/components/button";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePrinter,
} from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { useRouter } from "next/router";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Barcode from "@/components/barcode";
import CardMember from "@/components/card/cardMember";
import axios from "axios";

const TableBody = ({
  path,
  data,
  tableHead,
  actionAdd,
  actionView,
  actionRequest,
  actionAppoval,
  actionDetail,
  actionDelete,
  actionEdit,
  actionPrint,
  actionReturn,
  actionPrintBarcode,
  indexStartFrom,
}) => {
  const location = useRouter();
  const { asPath } = location;

  const { user, basic } = useAppContext();
  const { setDeleteItem, setMulct } = user;
  const componentRef = useRef();
  const [printBarcodeItem, setPrintBarcodeItem] = useState(null);
  const {
    form,
    search,
    move,
    setMove,
    route,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;

  const handleDelete = (item) => {
    const baseUrl =
      location.components[location.pathname].props.pageProps.baseUrl;
    const url = `${baseUrl}/${item.id}`;
    setDeleteItem({ show: true, url: url, data: data.length });
  };

  const handlePrint = (item) => {
    setPrintBarcodeItem(item);
  };

  const handlePrintValue = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintBarcode = (item) => {
    setPrintBarcodeItem(item);
  };

  const handlePrintBarcodeValue = useReactToPrint({
    content: () => componentRef.current,
  });

  const holidayDates = [
    new Date(2024, 0, 1), // Tahun Baru
    new Date(2024, 2, 10), // Hari Raya Nyepi
    new Date(2024, 4, 1), // Hari Raya Waisak
    new Date(2024, 7, 17), // Hari Kemerdekaan Republik Indonesia
    new Date(2024, 4, 21), // Idul Fitri 1 Syawal (tanggal 1)
    new Date(2024, 4, 22), // Idul Fitri 1 Syawal (tanggal 2)
    new Date(2024, 7, 11), // Hari Raya Idul Adha
    new Date(2024, 7, 30), // Tahun Baru Islam
    new Date(2024, 9, 17), // Maulid Nabi Muhammad SAW
    new Date(2024, 11, 25), // Hari Raya Natal
    new Date(2024, 0, 24), // Cuti Bersama Tahun Baru
    new Date(2024, 2, 29), // Cuti Bersama Hari Raya Nyepi
    new Date(2024, 7, 12), // Cuti Bersama Hari Kemerdekaan Republik Indonesia
    new Date(2024, 7, 13), // Cuti Bersama Hari Kemerdekaan Republik Indonesia (tambahan)
    new Date(2024, 9, 15), // Cuti Bersama Maulid Nabi Muhammad SAW
    new Date(2024, 11, 24), // Cuti Bersama Hari Raya Natal
  ];

  function calculateDueDate(loanDate, days) {
    let dueDate = new Date(loanDate);
    let daysToAdd = 0;

    while (daysToAdd < days) {
      dueDate.setDate(dueDate.getDate() + 1);
      const isWeekendDay = dueDate.getDay() === 0;
      const isHolidayDate = holidayDates.some(
        (holiday) => holiday.getTime() === dueDate.getTime()
      );
      if (!isWeekendDay && !isHolidayDate) {
        daysToAdd++;
      }
    }

    return dueDate;
  }

  function parseBorrowingDate(borrowingDate) {
    // Pemetaan nama bulan ke angka bulan dengan nama bulan tiga huruf
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      Mei: "05",
      Jun: "06",
      Jul: "07",
      Agu: "08",
      Sep: "09",
      Okt: "10",
      Nov: "11",
      Des: "12",
    };

    // Parsing string tanggal dengan mengabaikan hari dalam seminggu
    const match = borrowingDate.match(
      /(?:\w+),\s*(\d{1,2})\s*(\w{3})\s*(\d{4})/
    );
    if (!match) {
      throw new Error("Format tanggal tidak valid");
    }

    const [, day, monthName, year] = match;
    const monthNumber = monthMap[monthName];

    if (!monthNumber) {
      throw new Error("Nama bulan tidak valid");
    }

    // Memastikan day memiliki dua digit
    const dayWithTwoDigits = day.padStart(2, "0");

    // Menghasilkan tanggal dalam format "DDMMYYYY"
    const formattedDate = `${dayWithTwoDigits}${monthNumber}${year}`;

    return formattedDate;
  }

  function calculateDueDate(startDate, daysToAdd) {
    // Parsing tanggal "DDMMYYYY" ke Date object
    const day = parseInt(startDate.substr(0, 2), 10);
    const month = parseInt(startDate.substr(2, 2), 10) - 1; // Bulan di JavaScript dimulai dari 0 (Januari = 0)
    const year = parseInt(startDate.substr(4, 4), 10);

    const dueDate = new Date(year, month, day);
    dueDate.setDate(dueDate.getDate() + daysToAdd);

    return dueDate;
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const handleReturn = async (id, remaining) => {
    if (remaining > 0) {
      try {
        const returned_date = new Date();
        form.returned_date = formatDate(returned_date);
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/borrowingdetail/return/${id}`,
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
        location.reload();
      } catch (error) {
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
      }
    } else {
      const baseUrl =
        location.components[location.pathname].props.pageProps.baseUrl;
      const url = `${baseUrl}/${id}`;
      const finePerDay = 1000;
      const fine = Math.min(Math.abs(remaining) * finePerDay, 10000); // Max fine of 10,000 units
      const title = `Kamu telat ${Math.abs(
        remaining
      )} hari. Denda yang harus dibayarkan sebesar Rp ${fine}.`;
      setMulct({
        show: true,
        url: url,
        data: title,
        mulct: fine,
      });
    }
  };
  const handleExtension = async (id, borrowingDate, borrowingApporval) => {
    try {
      const formattedDate = parseBorrowingDate(borrowingDate);
      const newDueDate = calculateDueDate(formattedDate, 3);
      form.due_date = formatDate(newDueDate);
      form.approval = borrowingApporval;

      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/borrowingdetail/extension/${id}`,
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
      location.reload();
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleExtensionMember = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/borrowingdetail/extension/member/${id}`,
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
      location.reload();
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  useEffect(() => {
    if (printBarcodeItem !== null) {
      handlePrintBarcodeValue();
      setPrintBarcodeItem(null);
    }
    if (printBarcodeItem !== null) {
      handlePrintValue();
      setPrintBarcodeItem(null);
    }
  }, [printBarcodeItem, handlePrintBarcodeValue]);

  return (
    <tbody>
      {data.map((item, index) => {
        return (
          <tr className="border rounded" key={index}>
            <td className="p-4 border-y border-l rounded-l-lg text-center border-slate-400">
              {indexStartFrom + index}
            </td>
            {tableHead.map((head) => (
              <td
                key={"item" + head + index}
                className="p-4 border-y border-slate-400"
              >
                {head === "file" ? (
                  <div className="relative">
                    <Image
                      src={item[head] || "download.png"}
                      alt="Picture of the author"
                      width={500}
                      height={500}
                      className="object-contain w-10 h-10  border border-black"
                    />
                  </div>
                ) : head === "approval" ? (
                  <div>
                    {actionRequest && item[head] === "1" && (
                      <Button
                        action="success"
                        handleClick={(e) => {
                          e.preventDefault();
                          handleExtension(
                            item.id,
                            item.due_date,
                            item.approval
                          );
                        }}
                      >
                        <FiCheck size={20} />
                      </Button>
                    )}
                    {actionAppoval && item[head] === null && (
                      <Button
                        handleClick={(e) => {
                          e.preventDefault();
                          handleExtensionMember(item.id);
                        }}
                      >
                        Extension
                      </Button>
                    )}
                  </div>
                ) : (
                  <React.Fragment>
                    {item[head] === undefined || item[head] === null ? (
                      <div className="text-gray-500 italic">NULL</div>
                    ) : (
                      <React.Fragment>
                        {item[head].length > 45 ? (
                          <div title={item[head]}>
                            {item[head].slice(0, 50)}...
                          </div>
                        ) : (
                          <React.Fragment>{item[head]}</React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </td>
            ))}
            <td className="border-y w-fit border-r rounded-r-lg px-4 border-slate-400">
              <div className="flex gap-2 justify-center">
                {actionEdit && (
                  <Button link={path + "/edit/" + item.id} action="warning">
                    <AiOutlineEdit />
                  </Button>
                )}
                {actionDetail && (
                  <Button
                    link={`${path}/detail/${item.id}/detailStatus`}
                    action="success"
                  >
                    <BiMessageSquareDetail />
                  </Button>
                )}
                {actionPrintBarcode && (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => {
                        return (
                          <Button
                            action="info"
                            handleClick={() => handlePrintBarcode(item)}
                          >
                            <AiOutlinePrinter />
                          </Button>
                        );
                      }}
                      content={() => this.componentRef}
                    />
                    <div className="hidden print:block">
                      <Barcode
                        ref={componentRef}
                        printItemValue={printBarcodeItem}
                      />
                    </div>
                  </React.Fragment>
                )}
                {actionPrint && (
                  <React.Fragment>
                    <ReactToPrint
                      trigger={() => {
                        return (
                          <Button
                            action="info"
                            handleClick={() => handlePrint(item)}
                          >
                            <AiOutlinePrinter />
                          </Button>
                        );
                      }}
                      content={() => this.componentRef}
                    />
                    <div className="hidden print:block">
                      <CardMember
                        ref={componentRef}
                        printItemValue={printBarcodeItem}
                      />
                    </div>
                  </React.Fragment>
                )}
                {actionDelete && (
                  <Button
                    action="danger"
                    handleClick={() => handleDelete(item)}
                  >
                    <AiOutlineDelete />
                  </Button>
                )}
                {actionReturn && (
                  <React.Fragment>
                    <Button
                      handleClick={(e) => {
                        e.preventDefault();
                        handleExtension(item.id, item.due_date);
                      }}
                    >
                      Extension
                    </Button>
                    <Button
                      handleClick={(e) => {
                        e.preventDefault();
                        handleReturn(item.id, item.remaining);
                      }}
                    >
                      Return
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
