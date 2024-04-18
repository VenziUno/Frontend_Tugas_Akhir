import Layout from "@/components/layout";
import Table from "@/components/table";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Admin({ page }) {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const location = useRouter();
  const { res, isLoading, isError } = useFetcher("admin", page);
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);

  const list = [
    { label: "Semua", value: "" },
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  useEffect(() => {
    if (res) {
      const data = res.data.map((gedung) => {
        const arr = Object.entries(gedung);
        const filterArr = arr.filter(
          ([key, value]) => key !== "status" &&  key !== "email_verified_at" && key !== "role_id" && typeof value !== "object"
        );
        const obj = Object.fromEntries(filterArr);
        const newObj = {
          ...obj,
          role: gedung.role.name,
        };
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
        title="Building List"
        data={dataTableGedung}
        // pagination={dataPagination}
        list={list}
        buttonAdd
        // search
        actionEdit
        actionDelete
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/admin`;
  return { props: { page, baseUrl } };
}
