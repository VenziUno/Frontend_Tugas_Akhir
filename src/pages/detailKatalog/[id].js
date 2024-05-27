import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Label from "@/components/label";
import { useFetcher } from "@/hooks/useFetcher";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import { BsBookmarkFill } from "react-icons/bs";
import Link from "next/link";

const DetailKatalog = ({ page }) => {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataTableBook, setDataTableBook] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);
  const [dataKatalog, setDataKatalog] = useState(null);
  const location = useRouter();
  const { res, isLoading, isError } = useFetcher(`public/book`);
  const { res: resBook } = useFetcher(`public/book/${location.query.id}`);
  const { res: resBookDetail } = useFetcher(
    `public/borrowingdetail/index/${location.query.id}`,
    page
  );

  useEffect(() => {
    if (res) {
      const data = res.data.map((gedung) => {
        const arr = Object.entries(gedung);
        const filterArr = arr.filter(
          ([key, value]) => key !== "status" && typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        const itemCount = gedung.book_detail_status.filter(
          (item) => item.item_status.id === "IS001"
        ).length;
        const newData = {
          ...newObj,
          available_stock: `${itemCount} Stock`,
          current_stock: `${gedung.current_stock} Stock`,
          author_name: gedung.author.name,
        };
        return newData;
      });
      let filteredData = data;
      filteredData = filteredData.filter((item) => item.opac !== 0);
      filteredData = filteredData.filter((item) => item.id !== location.query.id);
      setDataTableBook(filteredData);
    }
  }, [res, location]);

  useEffect(() => {
    if (resBook) {
      const available_stock = resBook.data.book_detail_status.filter(
        (item) => item.item_status.id === "IS001"
      ).length;

      const newObj = resBook.data;

      const newData = {
        ...newObj,
        available_stock,
      };
      setDataKatalog(newData);
    }
  }, [resBook]);

  useEffect(() => {
    if (resBookDetail) {
      const data = resBookDetail.data.data.map((gedung) => {
        const arr = Object.entries(gedung);
        const filterArr = arr.filter(
          ([key, value]) =>
            key !== "books_id" &&
            key !== "item_statuses_id" &&
            typeof value !== "object"
        );
        const newObj = Object.fromEntries(filterArr);
        newObj.book_name = gedung.book.title;
        newObj.item_status_name = gedung.item_status.name;
        return newObj;
      });
      setDataTableGedung(data);
      setDataPagination(resBookDetail.data);
      if (search && move) {
        setMove(false);
        location.push(`${route}?page=1`);
      }
    }
  }, [resBookDetail]);

  return (
    <div>
      <Navbar>
        <div className="container w-full mx-auto px-4 py-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 space-y-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full">
              {dataKatalog && (
                <div className="space-y-4 w-full">
                  <div>
                    <Label label="Book Detail" type="title" />
                  </div>
                  <div className="flex flex-col lg:items-start items-center lg:flex-row gap-4">
                    <Image
                      src={dataKatalog.file}
                      alt={dataKatalog.title}
                      width={250}
                      height={250}
                      priority
                      className="object-cover w-64 h-64 rounded-lg "
                    />
                    <div className="py-2 flex flex-col gap-4 w-full">
                      <div>
                        <div className="flex items-center ">
                          <BsBookmarkFill
                            className=" text-green-500"
                            size={24}
                          />
                          <div className="font-bold">
                            {dataKatalog.label.name}
                          </div>
                        </div>
                        <h1 className="text-3xl font-bold">
                          {dataKatalog.title}
                        </h1>
                        <p className="text-gray-500">
                          {dataKatalog.author.name}
                        </p>
                      </div>
                      <div className="">
                        <div className="text-xl font-bold pb-2 underline">
                          Detail Information
                        </div>
                        <div className="grid grid-cols-2 grid-flow-row capitalize">
                          <div className="text-xl font-bold">Series Title</div>
                          <div className="text-xl">
                            {dataKatalog.series_title
                              ? dataKatalog.series_title
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">Call Number</div>
                          <div className="text-xl">
                            {dataKatalog.call_number
                              ? dataKatalog.call_number
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">Publisher</div>
                          <div className="text-xl">
                            {dataKatalog.publisher.name}/
                            {dataKatalog.publisher_year}
                          </div>
                          <div className="text-xl font-bold">Collation</div>
                          <div className="text-xl">
                            {dataKatalog.collation !== null
                              ? dataKatalog.collation
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">Language</div>
                          <div className="text-xl">
                            {dataKatalog.doc_language.name}
                          </div>
                          <div className="text-xl font-bold">ISBN/ISSN</div>
                          <div className="text-xl">{dataKatalog.isbn_issn}</div>
                          <div className="text-xl font-bold">Classfication</div>
                          <div>
                            <div className="text-xl">
                              {dataKatalog.subject !== null
                                ? dataKatalog.subject.name
                                : "-"}
                            </div>
                            <div className="text-xl">
                              {dataKatalog.subject !== null
                                ? dataKatalog.subject.subjects_type
                                : "-"}
                            </div>
                            <div className="text-xl">
                              {dataKatalog.subject !== null
                                ? dataKatalog.subject.subjects_type
                                : "-"}
                            </div>
                          </div>
                          <div className="text-xl font-bold">Content Type</div>
                          <div className="text-xl">
                            {dataKatalog.content_type !== null
                              ? dataKatalog.content_type.name
                              : ""}
                          </div>
                          <div className="text-xl font-bold">Carrier Type</div>
                          <div className="text-xl">
                            {dataKatalog.carrier_type !== null
                              ? dataKatalog.subject.subjects_type
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">Edition</div>
                          <div className="text-xl">
                            {dataKatalog.edition ? dataKatalog.edition : "-"}
                          </div>
                          <div className="text-xl font-bold">
                            Specific Detail Info
                          </div>
                          <div className="text-xl">
                            {dataKatalog.specific_detail_info
                              ? dataKatalog.specific_detail_info
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">
                            Statement of Responsibility
                          </div>
                          <div className="text-xl">
                            {dataKatalog.statement_of_responsibility
                              ? dataKatalog.statement_of_responsibility
                              : "-"}
                          </div>
                          <div className="text-xl font-bold">
                            Available Stock
                          </div>
                          <div className="text-xl">
                            {dataKatalog.available_stock
                              ? dataKatalog.available_stock
                              : "-"}{" "}
                            Stock
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">Decription Book</div>
                  <div className="text-xl">
                    {dataKatalog.desc ? dataKatalog.desc : "-"}
                  </div>
                </div>
              )}
            </div>
            <div className="flex max-w-sm w-full border p-4 rounded-lg border-slate-400 flex-col items-center gap-2 justify-self-center">
              <Label label="Book List" type="title" />
              <div className="flex flex-col gap-4">
                {dataTableBook &&
                  dataTableBook.slice(0, 4).map((item, index) => (
                    <div key={index} className="rounded-lg">
                      {item.file && (
                        <Link href={`/detailKatalog/${item.id}`} legacyBehavior>
                          <a className="">
                            <div className="border p-4 rounded shadow-lg flex items-center gap-4">
                              <Image
                                src={item.file}
                                alt={item.title}
                                width={250}
                                height={250}
                                priority
                                className="object-cover w-32 h-32 rounded-lg"
                              />
                              <div className="flex flex-col justify-between">
                                <div>
                                  <h1 className="text-xl font-bold">
                                    {item.title}
                                  </h1>
                                  <p className="text-gray-500">
                                    {item.author_name}
                                  </p>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-1">
                                  <span className="text-green-500 font-semibold">
                                    {item.available_stock}
                                  </span>
                                  <span className="text-gray-500">
                                    Available
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default DetailKatalog;

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/bookdetailstatus`;
  return { props: { page, baseUrl } };
}
