import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";

export default function BookDetail({ page }) {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const location = useRouter();
  const { res, isLoading, isError } = useFetcher(`bookdetailstatus/index/${location.query.id}`, page);
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);

  const list = [
    { label: "Semua", value: "" },
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  useEffect(() => {
    if (res) {
      const data = res.data.data.map((gedung) => {
        const arr = Object.entries(gedung);
        const filterArr = arr.filter(
          ([key, value]) =>
            key !== "books_id" &&
            key !== "item_statuses_id" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        newObj.book_name = gedung.book.title;
        newObj.author_name = gedung.book.author.name;
        newObj.call_number = gedung.book.call_number;
        newObj.item_status_name = gedung.item_status.name;
        return newObj;
      });
      setDataTableGedung(data);
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
          title="Book List"
          data={dataTableGedung}
          pagination={dataPagination}
          list={list}
          buttonBack
          actionEdit
          actionPrintBarcode
          actionDelete
        />
      </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/bookdetailstatus`;
  return { props: { page, baseUrl } };
}
