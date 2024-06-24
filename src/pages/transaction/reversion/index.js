import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import Button from "@/components/button";
import axios from "axios";

export default function Member({ page }) {
  const { basic } = useAppContext();
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

  const { res, isLoading, isError } = useFetcher("borrowingdetail", page);
  const { res:res2 } = useFetcher("borrowingdetail");
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);
  const [hasRemaining, setHasRemaining] = useState(false);
  const [notif, setNotif] = useState([]);

  const list = [
    { label: "Semua", value: "" },
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  useEffect(() => {
    if (res) {
      // Inisialisasi array notifikasi baru
      // const newNotifications = [];
  
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
  
        // if (remainingDays <= 3) {
        //   let notificationMessage = '';
        //   if (remainingDays < 0) {
        //     notificationMessage = `Peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name} terlambat ${Math.abs(remainingDays)} hari.`;
        //   } else {
        //     notificationMessage = `Peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name} akan segera berakhir pada ${formattedDueDateString}. Sisa waktu: ${remainingDays} hari.`;
        //   }
        //   newNotifications.push(notificationMessage);
        // }
        
        // if (item.approval === 1) {
        //   let notificationMessage = `Ada permohonan perpanjangan peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name}".`;
        //   newNotifications.push(notificationMessage);
        // }
        

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

      // setNotif(newNotifications);
      setDataTableGedung(newData);
      setDataPagination(res.data);
      if (search && move) {
        setMove(false);
        location.push(`${route}?page=1`);
      }
    }
  }, [res]);

  useEffect(() => {
    if (res2) {
      const newNotifications = [];
  
      const newData = res2.data.map((item) => {
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
  
        if (remainingDays <= 1) {
          let notificationMessage = '';
          if (remainingDays < 0) {
            notificationMessage = `Peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name} terlambat ${Math.abs(remainingDays)} hari.`;
          } else {
            notificationMessage = `Peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name} akan segera berakhir pada ${formattedDueDateString}. Sisa waktu: ${remainingDays} hari.`;
          }
          newNotifications.push(notificationMessage);
        }
        
        if (item.approval === 1) {
          let notificationMessage = `Ada permohonan perpanjangan peminjaman buku "${book_detail_status.book.title}" oleh ${borrowing.member.name}".`;
          newNotifications.push(notificationMessage);
        }    

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

      setNotif(newNotifications);
    }
  }, [res2]);

  return (
    <Layout notif={notif} >
      <Table
        title="Building List"
        data={dataTableGedung}
        pagination={dataPagination}
        actionReturn
        actionRequest
        search
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/borrowingdetail/return`;
  return { props: { page, baseUrl } };
}
