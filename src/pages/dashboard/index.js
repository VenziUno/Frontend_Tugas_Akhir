import Layout from "@/components/layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { basic } = useAppContext();
  const { res, isLoading, isError } = useFetcher("borrowingdetail/report");
  const {
    res: resBorrowing,
    isLoading: isLoadingBorrowing,
    isError: isErrorBorrowing,
  } = useFetcher("borrowing/report");
  const { res: resMember } = useFetcher("member");
  const {
    res: resBook,
    isLoading: isLoadingBook,
    isError: isErrorBook,
  } = useFetcher("book");
  const [dataTableGedung, setDataTableGedung] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataMember, setDataMember] = useState(0);
  const [newDataLength, setNewDataLength] = useState(0);
  const [countDipinjam, setCountDipinjam] = useState(0);
  const [countDikembalikan, setCountDikembalikan] = useState(0);
  const [totalMulct, setTotalMulct] = useState(0);
  const [totalLoanStock, setTotalLoanStock] = useState(null);
  const [totalTitles, setTotalTitles] = useState(null);
  const [totalMembers, setTotalMembers] = useState(null);
  const [totalStock, setTotalStock] = useState(null);
  const [totalAvailableStock, setTotalAvailableStock] = useState(null);
  const [totalMissingStock, setTotalMissingStock] = useState(null);
  const [totalRepairStock, setTotalRepairStock] = useState(null);

  useEffect(() => {
    if (resMember) {
      const data = resMember.data.map((gedung) => {
        
      });
      setTotalMembers(data.length);
    }

    if (resBook) {
      const data = resBook.data.map((gedung) => {
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

      const totalStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator +
          parseInt(currentValue.available_stock.split(" ")[0]) +
          parseInt(currentValue.loan_stock.split(" ")[0]) +
          parseInt(currentValue.missing_stock.split(" ")[0]) +
          parseInt(currentValue.repair_stock.split(" ")[0]),
        0
      );

      const totalAvailableStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.available_stock.split(" ")[0]),
        0
      );

      const totalMissingStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.missing_stock.split(" ")[0]),
        0
      );

      const totalLoanStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.loan_stock.split(" ")[0]),
        0
      );

      const totalRepairStock = data.reduce(
        (accumulator, currentValue) =>
          accumulator + parseInt(currentValue.repair_stock.split(" ")[0]),
        0
      );
      setTotalTitles(data.length);
      setTotalStock(totalStock);
      setTotalLoanStock(totalLoanStock);
      setTotalAvailableStock(totalAvailableStock);
      setTotalMissingStock(totalMissingStock);
      setTotalRepairStock(totalRepairStock);
    }
  }, [resBook]);

  useEffect(() => {
    if (resBorrowing) {
      setDataTable(resBorrowing.data);
    }
  });

  useEffect(() => {
    if (res && res.data) {
      const newData = res.data.map((item) => {
        return {
          id: item.id,
          member: item.borrowing.member,
          book_title: item.book_detail_status.book.title,
          status: item.status,
          mulct: item.mulct ? parseInt(item.mulct) : 0,
          book_id: item.book_detail_status.books_id,
        };
      });

      const dipinjamData = newData.filter((item) => item.status === "dipinjam");
      const dikembalikanData = newData.filter(
        (item) => item.status === "dikembalikan"
      );

      const bookCountByMember = {};
      newData.forEach((item) => {
        const memberId = item.member.id;
        if (!bookCountByMember[memberId]) {
          bookCountByMember[memberId] = {
            id: memberId,
            name: item.member.name,
            file: item.member.file,
            bookCount: 0,
          };
        }
        bookCountByMember[memberId].bookCount++;
      });

      setDataMember(bookCountByMember);
      setNewDataLength(newData.length);
      setCountDipinjam(dipinjamData.length);
      setCountDikembalikan(dikembalikanData.length);
      setTotalMulct(
        newData.reduce((acc, item) => {
          return acc + item.mulct;
        }, 0)
      );

      const groupedData = newData.reduce((acc, item) => {
        const { book_id, book_title, id } = item;
        acc[book_id] = acc[book_id] || {
          id,
          book_title,
          count: 0,
        };
        acc[book_id].count++;
        return acc;
      }, {});

      const dataArray = Object.values(groupedData)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setDataTableGedung(dataArray);
    }
  }, [res]);

  const labels = Object.values(dataTableGedung).map((item) => item.book_title);
  const dataCounts = Object.values(dataTableGedung).map((item) => item.count);

  const data = {
    labels: labels,
    datasets: [
      {
        labels: labels,
        data: dataCounts,
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(255, 0, 0, 0.8)",
          "rgba(0, 0, 255, 0.8)",
        ],
        borderWidth: 2,
        spacing: 10,
      },
    ],
  };
  const option = {
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "start",
        padding: 20,
      },
      elements: {
        arc: {
          spacing: 20, // Atur jarak antara setiap bagian data (slice)
        },
      },
    },
    hover: {
      mode: null, // Menghilangkan efek hover
    },
  };

  const datas = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Book Loans In 2024",
        data: dataTable,
        fill: false,
        backgroundColor: "rgba(255, 0, 0, 1)",
        borderColor: "rgba(0, 0, 255, .5)",
        pointBackgroundColor: "rgba(255, 0, 0, 1)", // Warna untuk dot
        pointBorderColor: "rgba(255, 0, 0, 1)",
        tension: 0.2,
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            weight: "bold",
          },
        },
      },
      title: {
        display: false,
        text: "Sales Data",
      },
    },
  };

  return (
    <div>
      <Layout>
        <div className="space-y-4">
          <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalTitles} Title
                </span>
                <span className="block text-gray-500">
                  Number of Book Titles
                </span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-pink-600 bg-pink-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalStock} Book
                </span>
                <span className="block text-gray-500">
                  Number of Book Stocks
                </span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-gray-600 bg-gray-200 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalMembers} Member
                </span>
                <span className="block text-gray-500">Number of Members</span>
              </div>
            </div>
          </section>
          <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {newDataLength} Transaction
                </span>
                <span className="block text-gray-500">
                  Total Book Transactions
                </span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {countDipinjam} Book
                </span>
                <span className="block text-gray-500">Total Loaned</span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="inline-block text-2xl font-bold">
                  {countDikembalikan} Book
                </span>
                <span className="block text-gray-500">Total Returned</span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  Rp {totalMulct}
                </span>
                <span className="block text-gray-500">Total Fines</span>
              </div>
            </div>
          </section>
          <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2 xl:grid-flow-col gap-4">
            <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow rounded-lg">
              <div className="px-6 py-5 text-center font-bold capitalize border-b border-gray-100">
                The number of students who loaned books and checked out per
                monthth
              </div>
              <div className="flex-grow">
                <div className="flex items-center px-4 py-4 justify-center h-full rounded-md">
                  <Line options={options} data={datas} />
                </div>
              </div>
            </div>
            <div className="row-span-2 bg-white shadow rounded-lg">
              <div className="flex items-center text-center font-bold capitalize justify-between px-6 py-5 border-b border-gray-100">
                <span>five students who loaned the most books</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "24rem" }}>
                <ul className="p-6 space-y-6">
                  {Object.values(dataMember)
                    .slice(0, 5)
                    .map((book) => (
                      <li key={book.id} className="flex items-center">
                        <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
                          <Image
                            src={book.file || "download.png"}
                            alt="Picture of the author"
                            width={500}
                            height={500}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-gray-600">{book.name}</span>
                        <span className="ml-auto font-semibold">
                          {book.bookCount} Book
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col row-span-2 bg-white shadow rounded-lg">
              <div className="px-6 text-lg py-5 text-center font-bold capitalize border-b border-gray-100">
                The five most frequently borrowed
              </div>
              <div className="flex-grow">
                <div className="flex items-center px-2 py-2 justify-center h-full rounded-md">
                  <Doughnut data={data} options={option} />
                </div>
              </div>
            </div>
          </section>
          <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalAvailableStock} Book
                </span>
                <span className="block text-gray-500">Available</span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalLoanStock} Book
                </span>
                <span className="block text-gray-500">Loan</span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="inline-block text-2xl font-bold">
                  {totalMissingStock} Book
                </span>
                <span className="block text-gray-500">Missing</span>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white shadow rounded-lg">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                <div className="h-6 w-6"></div>
              </div>
              <div>
                <span className="block text-2xl font-bold">
                  {totalRepairStock} Book
                </span>
                <span className="block text-gray-500">Repair</span>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </div>
  );
}
