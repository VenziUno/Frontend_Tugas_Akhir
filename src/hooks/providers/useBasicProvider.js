import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useBasicProvider = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    id: "",
    code: "",
    name: "",
    nis: "",
    mrac: "",
    rfid: "",
    gender: "",
    place_of_birth: "",
    date_of_birth: "",
    birth_year: "",
    type: "",
    class: "",
    address: "",
    notes: "",
    portal_code: "29444",
    file: "",
    classification_code: "",
    title: "",
    author_id: "",
    statement_of_responsibility: "",
    edition: "",
    email: "",
    specific_detail_info: "",
    gmds_id: "",
    content_types_id: "",
    media_types_id: "",
    carrier_types_id: "",
    isbn_issn: "",
    item_statuses_id: "",
    publishers_id: "",
    publisher_year: "",
    places_id: "",
    collation: "",
    series_title: "",
    call_number: "",
    subjects_id: "",
    doc_languages_id: "",
    desc: "",
    opac: "",
    file: null,
    labels_id: "",
    status: 1,
    current_stock: "",
  });

  const resetForm = () => {
    setForm({
      id: "",
      code: "",
      email: "",
      name: "",
      nis: "",
      mrac: "",
      rfid: "",
      gender: "",
      place_of_birth: "",
      date_of_birth: "",
      birth_year: "",
      type: "",
      class: "",
      address: "",
      notes: "",
      portal_code: "29444",
      file: "",
      classification_code: "",
      title: "",
      statement_of_responsibility: "",
      edition: "",
      specific_detail_info: "",
      gmds_id: "",
      content_types_id: "",
      media_types_id: "",
      carrier_types_id: "",
      isbn_issn: "",
      item_statuses_id: "",
      publishers_id: "",
      publisher_year: "",
      places_id: "",
      collation: "",
      series_title: "",
      call_number: "",
      subjects_id: "",
      doc_languages_id: "",
      desc: "",
      opac: "",
      file: null,
      labels_id: null,
      status: null,
      current_stock: "",
    });
  };

  const handleShowNotification = () => {
    let timer = setTimeout(
      () =>
        setNotification({
          ...notification,
          show: false,
          type: "",
          message: "",
        }),
      8000
    );
    return () => clearTimeout(timer);
  };

  const [search, setSearch] = useState("");
  const [move, setMove] = useState(true);

  const router = useRouter();
  const { route } = router;
  useEffect(() => {
    setSearch("");
    setMove(true);
  }, [route]);

  return {
    loadingSpinner,
    setLoadingSpinner,
    notification,
    setNotification,
    handleShowNotification,
    search,
    setSearch,
    move,
    setMove,
    route,
    form,
    setForm,
    resetForm,
  };
};
