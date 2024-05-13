import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import Tabel from "@/components/table";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function ReportBook({ page }) {
  const { res, isLoading, isError } = useFetcher("book",page);
  const { res:resDetail} = useFetcher("book");
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const location = useRouter();
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataTableGedung2, setDataTableGedung2] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);
  const [totalLoanStock, setTotalLoanStock] = useState(null);
  const [totalAvailableStock, setTotalAvailableStock] = useState(null);
  const [totalMissingStock, setTotalMissingStock] = useState(null);
  const [totalRepairStock, setTotalRepairStock] = useState(null);

  useEffect(() => {
    if (resDetail) {
      const data = resDetail.data.map((gedung) => {
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
            key !== "call_number" &&
            key !== "subjects_id" &&
            key !== "doc_languages_id" &&
            key !== "opac" &&
            key !== "labels_id" &&
            key !== "isbn_issn" &&
            key !== "file" &&
            key !== "current_stock" &&
            key !== "desc" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        const itemCount = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS001"
        ).length;
        const itemLoan = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS002"
        ).length;
        const itemMissing = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS003"
        ).length;
        const itemRepair = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS004"
        ).length;
        const newData = {
          ...newObj,
          available_stock: `${itemCount} Book`,
          loan_stock: `${itemLoan} Book`,
          missing_stock: `${itemMissing} Book`,
          repair_stock: `${itemRepair} Book`,
        };
        return newData;
      });

      const totalAvailableStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.available_stock.split(" ")[0]),
        0
      );

      // Hitung total missing stock
      const totalMissingStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.missing_stock.split(" ")[0]),
        0
      );

      // Hitung total loan stock
      const totalLoanStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.loan_stock.split(" ")[0]),
        0
      );

      // Hitung total repair stock
      const totalRepairStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.repair_stock.split(" ")[0]),
        0
      );

      setTotalLoanStock(totalLoanStock);
      setTotalAvailableStock(totalAvailableStock);
      setTotalMissingStock(totalMissingStock);
      setTotalRepairStock(totalRepairStock);

      setDataTableGedung2(data);
      setDataPagination(res.data);
      if (search && move) {
        setMove(false);
        location.push(`${route}?page=1`);
      }
    }

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
            key !== "call_number" &&
            key !== "subjects_id" &&
            key !== "doc_languages_id" &&
            key !== "opac" &&
            key !== "labels_id" &&
            key !== "isbn_issn" &&
            key !== "file" &&
            key !== "current_stock" &&
            key !== "desc" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        const itemCount = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS001"
        ).length;
        const itemLoan = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS002"
        ).length;
        const itemMissing = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS003"
        ).length;
        const itemRepair = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS004"
        ).length;
        const newData = {
          ...newObj,
          available_stock: `${itemCount} Book`,
          loan_stock: `${itemLoan} Book`,
          missing_stock: `${itemMissing} Book`,
          repair_stock: `${itemRepair} Book`,
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
  }, [res, resDetail]);


  const handleDownload = () => {
    const rows = dataTableGedung2.map((item, index) => ({
      no: index + 1,
      book_title: item.title,
      available_stock: item.available_stock,
      loan_stock: item.loan_stock, 
      missing_stock:item.missing_stock,
      repair_stock: item.repair_stock,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report Transaksi Book");
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["No", "Book Title", "Availble", "Loan", "Missing", "Repair"],
    ]);
    XLSX.writeFile(workbook, "Report.xlsx", { compression: true });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-blue-200 p-4 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-bold">Available</h4>
              <p className="text-xl">{totalAvailableStock} Book</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-green-200 p-4 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-bold">Loan</h4>
              <p className="text-xl">{totalLoanStock} Book</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-yellow-200 p-4 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-bold">Missing</h4>
              <p className="text-xl">{totalMissingStock} Book</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-red-200 p-4 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-bold">Repair</h4>
              <p className="text-xl">{totalRepairStock} Book</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-between">
          <div className="flex align-middle items-center gap-4">
            {/* <Label label="Filter:"></Label> */}
            {/* <InputFields></InputFields> */}
          </div>
          <Button handleClick={handleDownload}>Export</Button>
        </div>
      </div>
      <Tabel
        title="Book List"
        data={dataTableGedung}
        pagination={dataPagination}
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api`;
  return { props: { page, baseUrl } };
}
