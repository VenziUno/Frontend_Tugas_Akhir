import MultiSelect from "@/components/Multiselect";
import CardKatalog from "@/components/card/cardKatalog";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Navbar from "@/components/navbar";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi2";

export default function FilterKatalogBook() {
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
  const [gmd, setGMD] = useState([]);
  const [gmdSearch, setGMDSearch] = useState([]);
  const [docLanguage, setDocLanguage] = useState([]);
  const [language, setLanguage] = useState("");
  const [labelSearch, setLabelSearch] = useState([]);

  const location = useRouter();

  useEffect(() => {
    if (location.query.callnumber) {
      const grade_id = location.query.callnumber;
      setCallNumberSearch({ grade_id });
    }
    if (location.query.subject) {
      const grade_id = location.query.subject;
      setSubjectSearch({ grade_id });
    }
  }, [location.query.callnumber, location.query.subject]); // Specify the dependency here

  const {
    res: resLabel,
    isLoading: isLoadingLabel,
    isError: isErrorLabel,
  } = useFetcher(`public/label`);
  const { res, isLoading, isError } = useFetcher(
    `public/book?doclanguage=${language.grade_id}&callnumber=${callNumberSearch.grade_id}&subject=${subjectSearch.grade_id}&gmdSearch=${gmdSearch.grade_id}&label=${labelSearch.grade_id}`
  );
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
    }
    if (resGMD) {
      const pilihan_GMD = resGMD.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setGMD(pilihan_GMD);
    }
    if (resDocLanguage) {
      const pilihan_doc_language = resDocLanguage.data.map((d) => {
        return { name: d.name, value: d.id };
      });
      setDocLanguage(pilihan_doc_language);
    }
  }, [resLabel, resGMD, resDocLanguage, resSubject]);

  const [dataTableGedung, setDataTableGedung] = useState(null);

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
      filteredDatas = filteredData.filter((item) => item.opac !== 0);
      setDataTableGedung(filteredDatas);
      location.push('/filterKatalogBook')
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
                  setLabelSearch({ ...labelSearch, grade_id });
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
                  setCallNumberSearch({ ...callNumberSearch, grade_id });
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
                  setSubjectSearch({ ...callNumberSearch, grade_id });
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
                  setGMDSearch({ ...gmdSearch, grade_id });
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
                  setLanguage({ ...language, grade_id });
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
              <div className="flex items-center gap-4">
                <Label label={"Sort by :"}></Label>
                <div>
                  <InputFields />
                </div>
              </div>
            </div>
            <div>
              {dataTableGedung && dataTableGedung.length > 0 ? (
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
      </Navbar>
    </div>
  );
}
