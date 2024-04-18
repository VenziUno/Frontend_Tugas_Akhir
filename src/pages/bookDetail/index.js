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
  const { res, isLoading, isError } = useFetcher("book", page);
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
            key !== "status" &&
            key !== "publisher_year" &&
            key !== "gmds_id" &&
            key !== "edition" &&
            key !== "publishers_id" &&
            key !== "authors_id" &&
            key !== "statement_of_responsibility" &&
            key !== "specific_detail_info" &&
            key !== "content_types_id" &&
            key !== "media_types_id" &&
            key !== "carrier_types_id" &&
            key !== "places_id" &&
            key !== "collation" &&
            key !== "series_title" &&
            // key !== "call_number" &&
            key !== "subjects_id" &&
            key !== "doc_languages_id" &&
            key !== "opac" &&
            key !== "labels_id" &&
            // key !== "isbn_issn" &&
            // key !== "current_stock" &&
            key !== "desc" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        newObj.author_name = gedung.author.name;
        const itemCount = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS001"
        ).length;
        const newData = {
          ...newObj,
          available_stock: `${itemCount} Book`,
          current_stock: `${gedung.current_stock} Book`,
        };
        return newData;
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
        buttonAdd
        buttonPrintBatcode
        search
        actionEdit
        actionDelete
        actionDetail
        actionPrintBarcode
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/book`;
  return { props: { page, baseUrl } };
}
