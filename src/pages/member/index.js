import Layout from "@/components/layout";
import Table from "@/components/table";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";

export default function Member({ page }) {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const location = useRouter();
  const { res, isLoading, isError } = useFetcher("member", page);
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
        // Convert gedung object to an array of key-value pairs
        const arr = Object.entries(gedung);
        
        // Filter out unwanted keys
        const filterArr = arr.filter(
          ([key, value]) =>
            key !== "status" &&
            key !== "place_of_birth" &&
            key !== "date_of_birth" &&
            key !== "address" &&
            key !== "class" &&
            key !== "portal_code" &&
            key !== "notes" &&
            key !== "file" &&
            key !== "gender" &&
            // key !== "rfid" &&
            key !== "users_id" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        newObj.gender = gedung.gender === 'P' ? 'Perempuan' : 'Laki - Laki';
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
        pagination={dataPagination}
        list={list}
        buttonAdd
        buttonPrint
        search
        actionEdit
        actionDelete
        actionPrint
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/member`;
  return { props: { page, baseUrl } };
}
