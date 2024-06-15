import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/layout";
import InputFields from "@/components/inputFields";
import Button from "@/components/button";
import Table from "@/components/table";
import { useFetcher } from "@/hooks/useFetcher";
import { useAppContext } from "@/hooks/useAppContext";
import { addDays, format, isWeekend } from "date-fns";

export default function Borrowing() {
  const [form, setForm] = useState({
    rfid: "",
  });

  const [formBook, setFormBook] = useState({
    isbn_issn: "",
  });

  const { banner, basic } = useAppContext();
  const [memberData, setMemberData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [bookDataTransaksi, setBookDataTransaksi] = useState([]);
  const [startTransaction, setStartTransaction] = useState(null);
  const [borrowing, setBorrowing] = useState(null);
  const { notification, setNotification, handleShowNotification } = basic;
  const [ipConfig, setIpconfig] = useState("");

  const {
    res: resCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useFetcher(`borrowing/code`);

  const { res, isLoading, isError } = useFetcher("configrfid");

  useEffect(() => {
    if (res) {
      const data = res.data.map((configrfid) => configrfid.ip);
      setIpconfig(data);
    }
  }, [res]);

  const handleRefreshClick = () => {
    fetchDataAndUpdates();
    fetchDataAndUpdate();
  };

  const fetchDataAndUpdates = async () => {
    try {
      const response = await axios.get("https://wezady.my.id/api/public/rfiddata");
      const data = response.data.data;
      setForm({ ...form, rfid: data[0].rfid_data});
    } catch (error) {
      setForm({ ...form, rfid: "" });
    }
  };

  useEffect(() => {
    fetchDataAndUpdate();
  }, [form.rfid]);

  useEffect(() => {
    fetchData();
  }, [formBook.isbn_issn]);

  const handleStartTransaction = () => {
    setStartTransaction(true);
  };

  const handleCheck = () => {
    if (borrowing === null) {
      setNotification({
        show: true,
        type: "Warning",
        message: "Please fill in all fields.",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleFinalTransaction = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/borrowing`,
          borrowing,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStartTransaction(false);
        setMemberData(null);
        setForm({ ...form, rfid: "" });
        setFormBook({ ...form, isbn_issn: "" });
        setBookDataTransaksi([]);
        setBorrowing(null);
        setNotification({
          show: true,
          type: "Success",
          message: res.data.message,
        });
      } catch (error) {
        // resetForm();
        setStartTransaction(false);
        setMemberData(null);
        setForm({ ...form, rfid: "" });
        setFormBook({ ...form, isbn_issn: "" });
        setBookDataTransaksi([]);
        setBorrowing(null);
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
      }
    }
  };

  const fetchDataAndUpdate = async () => {
    try {
      if (form.rfid !== "") {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/member/rfid/${form.rfid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setMemberData(data);
      }
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      if (formBook.isbn_issn.length > 10) {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bookdetailstatus/RFID/${formBook.isbn_issn}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setBookData(data);
      }
    } catch (error) {}
  };

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

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (bookData && bookData !== null) {
      const loanDate = new Date();
      const dueDate = calculateDueDate(loanDate, 3);

      const { id, isbn_issn, books_id, book } = bookData;
      const newData = {
        id,
        books_id,
        book_title: book.title,
        isbn_issn,
        loan_date: formatDate(loanDate),
        due_date: formatDate(dueDate),
      };
      if (bookDataTransaksi && bookDataTransaksi.length < 3) {
        const isDuplicate =
          bookDataTransaksi.find((data) => data.id === newData.id) !==
          undefined;

        const isDuplicateBook =
          bookDataTransaksi.find(
            (data) => data.book_title === newData.book_title
          ) !== undefined;

        if (!isDuplicate && !isDuplicateBook) {
          setBookDataTransaksi([...bookDataTransaksi, newData]);
          setFormBook({ isbn_issn: "" });
        } else {
          setFormBook({ isbn_issn: "" });
          setNotification({
            show: true,
            type: "Warning",
            message: "Try Again",
          });
        }
      }
    }
  }, [bookData]);

  const handleDelete = (id) => {
    const updatedBookDataTransaksi = bookDataTransaksi.filter(
      (book) => book.id !== id
    );
    setBookDataTransaksi(updatedBookDataTransaksi);
  };

  useEffect(() => {
    if (
      resCode &&
      memberData &&
      bookDataTransaksi &&
      bookDataTransaksi.length > 0
    ) {
      const member_id = memberData.data.id;

      const isbn_issn = bookDataTransaksi.map((book) => book.isbn_issn);
      const loan_date = bookDataTransaksi[0].loan_date;
      const due_date = bookDataTransaksi[0].due_date;
      const { code, status } = resCode;
      const borrowingData = {
        id: code,
        members_id: member_id,
        isbn_issn: isbn_issn,
        loan_date: loan_date,
        due_date: due_date,
      };
      setBorrowing(borrowingData);
    }
  }, [memberData, bookDataTransaksi]);

  return (
    <Layout>
      <div className="space-y-2 p-2">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Add Borrowing</h1>
        </div>
        <div className="gap-2 space-y-2">
          <div className="flex gap-2">
            <div className={startTransaction ? "hidden" : "flex space-x-2 "}>
              <InputFields
                type="text"
                placeholder="RFID"
                title="RFID"
                value={form.rfid}
                setValue={(e) => setForm({ ...form, rfid: e.target.value })}
              />
              <Button
                action="info"
                handleClick={handleRefreshClick}
                style={{ display: startTransaction ? "none" : "block" }}
              >
                Scan & Refresh
              </Button>
            </div>
            <Button
              action="yellow"
              handleClick={
                startTransaction
                  ? handleFinalTransaction
                  : handleStartTransaction
              }
            >
              {startTransaction ? "Final Transaksi" : "Start Transaksi"}
            </Button>
          </div>
          {memberData && memberData.data && form.rfid !== "" && (
            <div className="w-full">
              <table className="border-separate border-spacing-y-2 w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-50/50 to-primary-500 rounded ">
                    <th className="p-2 text-left border-l border-y rounded-l-lg border-slate-400">
                      Name
                    </th>
                    <th className="p-2 text-left border-y border-slate-400">
                      RFID
                    </th>
                    <th className="p-2 text-left border-y border-slate-400">
                      NIS
                    </th>
                    <th className="p-2 text-left border-y border-slate-400">
                      Gender
                    </th>
                    <th className="p-2 border-y border-r rounded-r-lg text-center border-slate-400">
                      Class
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-l border-y rounded-l-lg  border-slate-400">
                      {memberData.data.name}
                    </td>
                    <td className="p-2 text-left border-y border-slate-400 uppercase">
                      {memberData.data.rfid}
                    </td>
                    <td className="p-2 text-left border-y border-slate-400">
                      {memberData.data.nis}
                    </td>
                    <td className="p-2 text-left border-y border-slate-400">
                      {memberData.data.gender}
                    </td>
                    <td className="p-2 border-y border-r rounded-r-lg text-center border-slate-400">
                      {memberData.data.class}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {startTransaction && (
            <>
              <div className="flex gap-2">
                <InputFields
                  type="text"
                  placeholder="Code"
                  title="Code"
                  value={formBook.isbn_issn}
                  setValue={(e) =>
                    setFormBook({ ...formBook, isbn_issn: e.target.value })
                  }
                />
              </div>
              <div>
                {bookDataTransaksi && bookDataTransaksi.length > 0 && (
                  <table className="border-separate border-spacing-y-3 w-full">
                    <thead className="">
                      <tr className="bg-gradient-to-r from-primary-50/50 to-primary-500 rounded ">
                        <th className="p-2 border-l border-y rounded-l-lg w-4 text-center border-slate-400">
                          No
                        </th>
                        <th className="p-2 text-left border-y w-4 border-slate-400">
                          ISBN/ISSN
                        </th>
                        <th className="p-2 text-left border-y border-slate-400">
                          Book Title
                        </th>
                        <th className="p-2 border-y border-r rounded-r-lg text-center border-slate-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookDataTransaksi.map((book, index) => (
                        <tr key={book.id}>
                          <td className="p-2 border-l border-y rounded-l-lg w-4 text-center border-slate-400">
                            {index + 1}
                          </td>
                          <td className="p-2 text-left border-y border-slate-400">
                            {book.isbn_issn}
                          </td>
                          <td className="p-2 text-left border-y border-slate-400">
                            {book.book_title}
                          </td>
                          <td className="p-2 border-y border-r rounded-r-lg text-center border-slate-400">
                            <Button handleClick={() => handleDelete(book.id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
