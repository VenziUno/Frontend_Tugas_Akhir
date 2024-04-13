import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import Tabel from "@/components/table";
import * as XLSX from "xlsx";
import Button from "@/components/button";
import Selects from "@/components/selects";
import Label from "@/components/label";

export default function ReportTransaksi({ page }) {
  const { basic } = useAppContext();
  const { res, isLoading, isError } = useFetcher("borrowingdetail/report");
  const [dataTableGedung, setDataTableGedung] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [data, setData] = useState("Summary");
  const [newDataLength, setNewDataLength] = useState(0);
  const [countDipinjam, setCountDipinjam] = useState(0);
  const [countDikembalikan, setCountDikembalikan] = useState(0);
  const [totalMulct, setTotalMulct] = useState(0);

  const list = [
    { label: "Summary", value: "Summary" },
    { label: "Detail", value: "Detail" },
  ];

  useEffect(() => {
    if (res && res.data) {
      const newData = res.data.map((item) => {
        return {
          id: item.id,
          book_title: item.book_detail_status.book.title,
          status: item.status,
          mulct: item.mulct ? parseInt(item.mulct) : 0,
          book_id: item.book_detail_status.books_id,
        };
      });

      const newDatas = res.data.map((item) => {
        return {
          id: item.id,
          name: item.borrowing.member.name,
          book_title: item.book_detail_status.book.title,
          mulct: `Rp ${item.mulct ? parseInt(item.mulct) : 0}`,
          status: item.status,
        };
      });

      const dipinjamData = newData.filter((item) => item.status === "dipinjam");
      const dikembalikanData = newData.filter(
        (item) => item.status === "dikembalikan"
      );

      setNewDataLength(newData.length);
      setCountDipinjam(dipinjamData.length);
      setCountDikembalikan(dikembalikanData.length);
      setTotalMulct(
        newData.reduce((acc, item) => {
          return acc + item.mulct;
        }, 0)
      );

      const groupedData = newData.reduce((acc, item) => {
        const { book_id, mulct, book_title, id } = item;
        acc[book_id] = acc[book_id] || {
          id,
          book_title,
          count: 0,
          total_fines: 0,
        };
        acc[book_id].count++;
        acc[book_id].total_fines += mulct;
        return acc;
      }, {});

      const modifiedData = Object.values(groupedData).map((item) => ({
        id: item.id,
        book_title: item.book_title,
        count: `${item.count} buku`,
        total_fines: `Rp ${item.total_fines}`,
      }));

      const processedData = Object.values(modifiedData);
      setDataTableGedung(processedData);
      setDataTable(newDatas);
    }
  }, [res]);

  const handleDownload = () => {
    const rows = dataTableGedung.map((product, index) => ({
      no: index + 1,
      book_title: product.book_title,
      count: product.count,
      total_fines: product.total_fines,
    }));

    const rows2 = dataTable.map((item) => ({
      no: item.id,
      name: item.name,
      book_title: item.book_title,
      mulct: item.mulct,
      status: item.status,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const worksheet2 = XLSX.utils.json_to_sheet(rows2);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report Transaksi Book");
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet2,
      "Report Transaksi Detail Member"
    );
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["No", "Book Title", "Count", "Total Fines"],
    ]);
    XLSX.utils.sheet_add_aoa(worksheet2, [
      ["No", "Name", "Book Title", "Fines", "Status"],
    ]);
    XLSX.writeFile(workbook, "Report.xlsx", { compression: true });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-blue-200 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">Total Book Transactions</h4>
              <p className="text-xl">{newDataLength} Transaction</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-green-200 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">Total Loans</h4>
              <p className="text-xl">{countDipinjam} Book</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">Total Returned</h4>
              <p className="text-xl">{countDikembalikan} Book</p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 md:w-1/4">
            <div className="bg-red-200 p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-bold">Total Fines</h4>
              <p className="text-xl">Rp {totalMulct}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-between">
          <div className="flex align-middle items-center gap-4">
            <Label label="Filter:"></Label>
            <Selects
              list={list}
              placeholder="Summary"
              value="Summary"
              handleChange={(item) => setData(item.value)}
            ></Selects>
          </div>
          <Button handleClick={handleDownload}>Export</Button>
        </div>
      </div>
      <Tabel
        title="Building List"
        data={data === "Summary" ? dataTableGedung : dataTable}
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/borrowingdetail`;
  return { props: { page, baseUrl } };
}
