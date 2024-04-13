import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import { router } from "next/router";
import Layout from "@/components/layout";

export default function historyTransaksiMember({ page }) {
  const { basic } = useAppContext();
  const [member, setMember] = useState(false);
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
  const location = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("member");
      setMember(name);
    }
  }, []);

  const { res, isLoading, isError } = useFetcher(
    `public/borrowingdetail/member/${member}`,
    page
  );

  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);

  const list = [
    { label: "Semua", value: "" },
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  useEffect(() => {
    const sessionStorageItem = sessionStorage.getItem("token");
    if (res && sessionStorageItem) {
      const newData = res.data.data.map((item) => {
        const { borrowing, book_detail_status } = item;
        const dueDate = new Date(item.due_date);
        const currentDate = new Date();
        let remainingDays = Math.ceil(
          (dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        let totalSaturdays = 0;
        while (currentDate < dueDate) {
          if (currentDate.getDay() === 0) {
            totalSaturdays++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        remainingDays -= totalSaturdays;

        const dayNames = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];

        function formatDate(date) {
          const options = { day: "2-digit", month: "short", year: "numeric" };
          return new Intl.DateTimeFormat("id-ID", options).format(date);
        }
        const dueDayName = dayNames[dueDate.getDay()];
        const formattedDueDate = formatDate(dueDate);
        const formattedDueDateString = `${dueDayName}, ${formattedDueDate}`;

        return {
          id: item.id,
          name: borrowing.member.name,
          isbn_issn: book_detail_status.isbn_issn,
          title: book_detail_status.book.title,
          due_date: formattedDueDateString,
          remaining: remainingDays,
          approval: item.approval,
        };
      });
      setDataTableGedung(newData);
      setDataPagination(res.data);
      if (search && move) {
        setMove(false);
        location.push(`${route}?page=1`);
      }
    }
  }, [res]);

  return (
    <Layout>
      <Table
        title="Building List"
        data={dataTableGedung}
        pagination={dataPagination}
        actionAppoval
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/borrowingdetail/return`;
  return { props: { page, baseUrl } };
}
