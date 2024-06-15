import MultiSelect from "@/components/Multiselect";
import CardKatalog from "@/components/card/cardKatalog";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Navbar from "@/components/navbar";
import TableBottomNav from "@/components/table/tableBottomNav";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi2";

export default function FilterKatalogBook({ page }) {
  const { basic } = useAppContext();
  const {
    form,
    search,
    move,
    setMove,
    route,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  const [isLoading, setIsLoading] = useState(true);
  const [label, setLabel] = useState([]);
  const [subject, setSubject] = useState([]);
  const [callNumber, setCallNumber] = useState([
    { value: "0", name: "Computer Science, Information & General Works" },
    { value: "1", name: "Philosophy & Psychology" },
    { value: "2", name: "Religion" },
    { value: "3", name: "Social Sciences" },
    { value: "4", name: "Language" },
    { value: "5", name: "Pure Science" },
    { value: "6", name: "Applied Sciences" },
    { value: "7", name: "Art & Recreation" },
    { value: "8", name: "Literature" },
    { value: "9", name: "History & Geography" },
  ]);
  const [subjectSearch, setSubjectSearch] = useState([]);
  const [callNumberSearch, setCallNumberSearch] = useState([]);
  const [pagination, setDataPagination] = useState(null);
  const [gmd, setGMD] = useState([]);
  const [gmdSearch, setGMDSearch] = useState([]);
  const [docLanguage, setDocLanguage] = useState([]);
  const [language, setLanguage] = useState("");
  const [labelSearch, setLabelSearch] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (router.query.callnumber) {
      const grade_id = router.query.callnumber.split(',');
      setCallNumberSearch({ grade_id });
    }
    if (router.query.subject) {
      const grade_id = router.query.subject.split(',');
      setSubjectSearch({ grade_id });
    }
    if (router.query.label) {
      const grade_id = router.query.label.split(',');
      setLabelSearch({ grade_id });
    }
    if (router.query.gmdSearch) {
      const grade_id = router.query.gmdSearch.split(',');
      setGMDSearch({ grade_id });
    }
    if (router.query.doclanguage) {
      const grade_id = router.query.doclanguage.split(',');
      setLanguage({ grade_id });
    }
  }, [router.query]);

  const updateUrl = (queryParam, selectedValues) => {
    const newQueryParams = {
      ...router.query,
      [queryParam]: selectedValues.join(','),
      page: 1 // Reset to page 1
    };

    // Remove query parameters that have undefined or empty values
    Object.keys(newQueryParams).forEach(key => {
      if (!newQueryParams[key] || newQueryParams[key] === 'undefined') {
        delete newQueryParams[key];
      }
    });

    router.push({
      pathname: router.pathname,
      query: newQueryParams
    });
  };

  const {
    res: resLabel,
    isLoading: isLoadingLabel,
    isError: isErrorLabel,
  } = useFetcher(`public/label`);

  const filter = `doclanguage=${language.grade_id}&callnumber=${callNumberSearch.grade_id}&subject=${subjectSearch.grade_id}&gmdSearch=${gmdSearch.grade_id}&label=${labelSearch.grade_id}`;

  const { res } = useFetcher(
    `public/book`, page, filter
  );
  
  console.log(res);
  const {
    res: resSubject,
    isLoading: isLoadingSubject,
    isError: isErrorSubject,
  } = useFetcher(`public/subject`);
  const {
    res: resGMD,
    isLoading: isLoadingGMD,
    isError: isErrorGMD,
  } = useFetcher(`public/gmd`);
  const {
    res: resDocLanguage,
    isLoading: isLoadingDocLanguage,
    isError: isErrorDocLanguage,
  } = useFetcher(`public/doclanguage`);

  useEffect(() => {
    if (resLabel) {
      const pilihan_label = resLabel.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setLabel(pilihan_label);
    }
    if (resSubject) {
      const pilihan_subject = resSubject.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setSubject(pilihan_subject);
      setIsLoading(true);
    }
    if (resGMD) {
      const pilihan_GMD = resGMD.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setGMD(pilihan_GMD);
      setIsLoading(true);
    }
    if (resDocLanguage) {
      const pilihan_doc_language = resDocLanguage.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setDocLanguage(pilihan_doc_language);
      setIsLoading(true);
    }
  }, [resLabel, resGMD, resDocLanguage, resSubject]);

  const [dataTableGedung, setDataTableGedung] = useState(null);

  useEffect(() => {
    if (res) {
      const data = res.data.data.map((gedung) => {
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
      filteredDatas = filteredData.filter((item) => item.opac !== 0);
      setDataTableGedung(filteredDatas);
      setDataPagination(res.data);
      if (search && move) {
        setMove(false);
        router.push(`${route}?page=1`);
      }
      setIsLoading(false);
    }
  }, [res]);

  return (
    <div>
      <Navbar>
        <div className="xl:container mx-auto px-2 py-4 xl:px-6 xl:gap-6 flex flex-col md:flex-row gap-2">
          <div className="md:w-64 w-full h-fit border rounded shadow px-2 py-4 space-y-6  xl:px-6">
            <Label
              typeStyle={"text-center"}
              label={"Filter by"}
              type={"title"}
            />
            <div className="border-b pb-4">
              <MultiSelect
                search
                label={"Label"}
                list={label}
                type={"filter"}
                size="w-full"
                handleValue={(select) => {
                  const grade_id = select.map((d) => d.value);
                  setLabelSearch({ grade_id });
                  updateUrl('label', grade_id);
                  setIsLoading(true);
                }}
              />
            </div>
            <div className="border-b pb-4">
              <MultiSelect
                search
                label={"Call Number"}
                list={callNumber}
                type={"filter"}
                size="w-full"
                handleValue={(select) => {
                  const grade_id = select.map((d) => d.value);
                  setCallNumberSearch({ grade_id });
                  updateUrl('callnumber', grade_id);
                  setIsLoading(true);
                }}
              />
            </div>
            <div className="border-b pb-4">
              <MultiSelect
                search
                label={"Subject"}
                list={subject}
                type={"filter"}
                size="w-full"
                handleValue={(select) => {
                  const grade_id = select.map((d) => d.value);
                  setSubjectSearch({ grade_id });
                  updateUrl('subject', grade_id);
                  setIsLoading(true);
                }}
              />
            </div>
            <div className="border-b pb-4">
              <MultiSelect
                search
                label={"General Material Designation"}
                list={gmd}
                type={"filter"}
                size="w-full"
                handleValue={(select) => {
                  const grade_id = select.map((d) => d.value);
                  setGMDSearch({ grade_id });
                  updateUrl('gmdSearch', grade_id);
                  setIsLoading(true);
                }}
              />
            </div>
            <div className="pb-4">
              <MultiSelect
                search
                label={"Doc Language"}
                list={docLanguage}
                type={"filter"}
                size="w-full"
                handleValue={(select) => {
                  const grade_id = select.map((d) => d.value);
                  setLanguage({ grade_id });
                  updateUrl('doclanguage', grade_id);
                  setIsLoading(true);
                }}
              />
            </div>
          </div>

          <div className="w-full h-full min-h-screen border rounded shadow space-y-6 px-4 py-4 xl:px-8 xl:py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Label
                typeStyle={"hidden md:block"}
                label={"Found from your keywords :"}
              />
              {/* <div className="flex items-center gap-4">
                <Label label={"Sort by :"}></Label>
                <div>
                  <InputFields />
                </div>
              </div> */}
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
              ) : dataTableGedung && dataTableGedung.length > 0 ? (
                <div className="place-items-center gap-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {dataTableGedung.map((item, index) => (
                    <CardKatalog key={index} index={index} data={item} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col align-middle justify-center items-center gap-2 h-96">
                  <HiOutlineXCircle size={80} className="text-primary-400" />
                  <span className="text-5xl font-medium text-primary-400">
                    Data Not Found
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="xl:container mx-auto px-2 pb-4 xl:px-6 xl:gap-6 flex justify-center align-middle items-center flex-col md:flex-row gap-2">{pagination && <TableBottomNav pagination={pagination} />}</div>
      </Navbar>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const page = ctx.query.page || 1;
  const baseUrl = `${process.env.API_URL}/api/book`;
  return { props: { page, baseUrl } };
}
