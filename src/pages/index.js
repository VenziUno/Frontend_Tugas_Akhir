import CardKatalog from "@/components/card/cardKatalog";
import Label from "@/components/label";
import Navbar from "@/components/navbar";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";

const Landing = () => {
  const { basic } = useAppContext();
  const { search, move, setMove, route } = basic;

  const { res, isLoading, isError } = useFetcher(
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
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setDataTableGedung2(filteredDatas);
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
              <a  href="filterKatalogBook?subject=S004">
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
              <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
                {dataTableGedung2 &&
                  dataTableGedung2
                    .slice(0, 4)
                    .map((item, index) => (
                      <CardKatalog key={index} index={index} data={item} />
                    ))}
              </div>
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
              <div className="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
                {dataTableGedung &&
                  dataTableGedung
                    .slice(0, 4)
                    .map((item, index) => (
                      <CardKatalog key={index} index={index} data={item} />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Landing;
