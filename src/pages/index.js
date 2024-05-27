import CardKatalog from "@/components/card/cardKatalog";
import Label from "@/components/label";
import Navbar from "@/components/navbar";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { HiOutlineXCircle } from "react-icons/hi2";

const Landing = () => {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;
  const [isLoading, setIsLoading] = useState(true);
  const { res } = useFetcher(
    `public/book?search=${search}`
  );
  const [dataTableGedung, setDataTableGedung] = useState(null);
  const [dataTableGedung2, setDataTableGedung2] = useState(null);
  const [dataPagination, setDataPagination] = useState(null);
  const [showTopic, setShowTopic] = useState(false);

  const handleChangeShow = () => {
    setShowTopic(!showTopic);
  };

  const [filter, setFilter] = useState([]);

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
        };
        return newData;
      });
      let filteredData = data;
      let filteredDatas = data;
      filteredData = filteredData.filter((item) => item.opac !== 0);
      setDataTableGedung(filteredData);
      filteredDatas.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setDataTableGedung2(filteredDatas);
      setIsLoading(false)
    }
  }, [res, filter]);

  return (
    <div>
      <Navbar home>
        <div className="container mx-auto space-y-10 py-6">
          <div className="mt-14 text-2xl font-thin gap-8 flex flex-col text-center items-center">
            <Label
              label="Select the topic you are interested in"
              type="title"
            ></Label>
            <div className="grid grid-cols-2 grid-flow-row xl:grid-cols-5 md:grid-cols-3 gap-4">
              <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                <a
                  className="flex flex-col items-center"
                  href="filterKatalogBook?callnumber=8"
                >
                  <Image
                    className="w-24 h-24"
                    src="/8-books.png"
                    alt="books"
                    title="books"
                    width={50}
                    height={50}
                  />
                  <span className="text-center text-sm">Literature</span>
                </a>
              </li>
              <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                <a
                  className="flex flex-col items-center"
                  href="filterKatalogBook?callnumber=3"
                >
                  <Image
                    className="w-24 h-24"
                    src="/3-diploma.png"
                    alt="diploma"
                    title="diploma"
                    width={50}
                    height={50}
                  />
                  <span className="text-center text-sm">Social Sciences</span>
                </a>
              </li>
              <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                <a
                  className="flex flex-col items-center"
                  href="filterKatalogBook?callnumber=6"
                >
                  <Image
                    className="w-24 h-24"
                    src="/6-blackboard.png"
                    alt="blackboard"
                    title="blackboard"
                    width={50}
                    height={50}
                  />
                  <span className="text-center text-sm">Applied Sciences</span>
                </a>
              </li>
              <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                <a
                  className="flex flex-col items-center"
                  href="filterKatalogBook?callnumber=7"
                >
                  <Image
                    className="w-24 h-24"
                    src="/7-quill.png"
                    alt="quill"
                    title="quill"
                    width={50}
                    height={50}
                  />
                  <span className="text-center text-sm">Art & Recreation</span>
                </a>
              </li>
              <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                <button onClick={handleChangeShow}>
                  <Image
                    className="w-24 h-24"
                    src="/grid_icon.png"
                    alt="grid_icon"
                    title="grid_icon"
                    width={50}
                    height={50}
                  />
                  <span className="text-center text-sm">More</span>
                </button>
              </li>
            </div>
            {showTopic ? (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 flex justify-center items-center">
                <div className="fixed lg:w-2/3 h-96 lg:h-fit overflow-auto bg-white rounded-lg shadow-lg px-6 py-6 space-y-2 z-50">
                  <div className="md:p-8 md:space-y-8">
                    <div className="w-full flex justify-between items-center">
                      <Label label="Select the topic" type="title" />
                      <div>
                        <FaWindowClose size={24} onClick={handleChangeShow} />
                      </div>
                    </div>
                    <div className="grid grid-flow-row  grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=0"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/0-chemical.png"
                            alt="chemical"
                            title="chemical"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Computer Science, Information & General Works
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=1"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/1-memory.png"
                            alt="memory"
                            title="memory"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Philosophy & Psychology
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=2"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/2-mosque.png"
                            alt="mosque"
                            title="mosque"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">Religion</span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=3"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/3-diploma.png"
                            alt="diploma"
                            title="diploma"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Social Sciences
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=4"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/4-translation.png"
                            alt="translation"
                            title="translation"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">Language</span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=5"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/5-math.png"
                            alt="math"
                            title="math"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Pure Science
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=6"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/6-blackboard.png"
                            alt="blackboard"
                            title="blackboard"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Applied Sciences
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=7"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/7-quill.png"
                            alt="quill"
                            title="quill"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Art & Recreation
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=8"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/8-books.png"
                            alt="books"
                            title="books"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            Literature
                          </span>
                        </a>
                      </li>
                      <li className="flex justify-center items-center m-2 border py-4 px-8 rounded-lg shadow-lg">
                        <a
                          className="flex flex-col items-center"
                          href="filterKatalogBook?callnumber=9"
                        >
                          <Image
                            className="w-24 h-24"
                            src="/9-return-to-the-past.png"
                            alt="return-to-the-past"
                            title="return-to-the-past"
                            width={50}
                            height={50}
                          />
                          <span className="text-center text-sm">
                            History & Geography
                          </span>
                        </a>
                      </li>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 space-y-4 py-6 ">
            <div className="space-y-2">
              <Label
                label="Popular among our collections"
                typeStyle={"text-center md:text-left"}
                type="title"
              />
              <div className=" text-justify">
                Our library's line of collection that have been favoured by our
                users were shown here. Look for them. Borrow them. Hope you also
                like them
              </div>
            </div>
            <div className=" hidden gap-4 lg:flex">
              <a href="filterKatalogBook?subject=S004">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Computer Science
                </div>
              </a>
              <a href="filterKatalogBook?subject=S003">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  The book
                </div>
              </a>
              <a href="filterKatalogBook?subject=S006">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Special Computer Methods
                </div>
              </a>
              <a href="filterKatalogBook?subject=S005">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Computer programming
                </div>
              </a>
              <a href="filterKatalogBook?subject=S001">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Knowledge
                </div>
              </a>
            </div>
            <div>
              {isLoading ? ( // Tampilkan pesan loading jika masih dalam proses penarikan data
                <div className="flex flex-col align-middle justify-center items-center gap-2 h-96">
                  <div>
                    <svg
                      aria-hidden="true"
                      className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : dataTableGedung2 && dataTableGedung2.length > 0 ? (
                <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
                  {dataTableGedung2.slice(0, 4).map((item, index) => (
                    <CardKatalog key={index} index={index} data={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col align-middle justify-center items-center gap-2 h-60">
                  <HiOutlineXCircle size={80} className="text-primary-400" />
                  <span className="text-5xl font-medium text-primary-400">
                    Data Not Found
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-24 space-y-4 py-6">
            <div className="space-y-2">
              <Label
                label="New collections + updated"
                typeStyle={"text-center md:text-left"}
                type="title"
              />
              <div className=" text-justify">
                These are new collections list. Hope you like them. Maybe not
                all of them are new. But in term of time, we make sure that
                these are fresh from our processing oven
              </div>
            </div>
            <div className=" hidden gap-4 lg:flex">
              <a href="filterKatalogBook?subject=S001">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Knowledge
                </div>
              </a>
              <a href="filterKatalogBook?subject=S002">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  The book
                </div>
              </a>
              <a href="filterKatalogBook?subject=S003">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Systems
                </div>
              </a>
              <a href="filterKatalogBook?subject=S004">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Computer Science
                </div>
              </a>
              <a href="filterKatalogBook?subject=S005">
                <div className="rounded-full border border-slate-400 px-4 py-2 hover:bg-slate-400 hover:text-white">
                  Computer programming
                </div>
              </a>
            </div>
            <div>
              {isLoading ? ( // Tampilkan pesan loading jika masih dalam proses penarikan data
                <div className="flex flex-col align-middle justify-center items-center gap-2 h-96">
                  <div>
                    <svg
                      aria-hidden="true"
                      className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) :dataTableGedung && dataTableGedung.length > 0 ? (
                <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
                  {dataTableGedung.slice(0, 4).map((item, index) => (
                    <CardKatalog key={index} index={index} data={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col align-middle justify-center items-center gap-2 h-60">
                  <HiOutlineXCircle size={80} className="text-primary-400" />
                  <span className="text-5xl font-medium text-primary-400">
                    Data Not Found
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Landing;
