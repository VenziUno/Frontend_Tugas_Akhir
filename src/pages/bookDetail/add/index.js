import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";
import Selects from "@/components/selects";
import ImageUploader from "@/components/imageUploader";
import TextArea from "@/components/textArea";

export default function AddBookDetail() {
  const { basic } = useAppContext();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;

  const [selectAuthor, setSelectAuthor] = useState([]);
  const [selectGmd, setSelectGmd] = useState([]);
  const [selectContent, setSelectContent] = useState([]);
  const [selectMedia, setSelectMedia] = useState([]);
  const [selectCarrier, setSelectCarrier] = useState([]);
  const [selectPublisher, setSelectPublisher] = useState([]);
  const [selectPlace, setSelectPlace] = useState([]);
  const [selectSubject, setSelectSubject] = useState([]);
  const [selectDocLanguage, setSelectDocLanguage] = useState([]);
  const [selectLabel, setSelectLabel] = useState([]);
  const [createAuthor, setCreateAuthor] = useState(false);
  const [createPlace, setCreatePlace] = useState(false);
  const [createPublisher, setCreatePublisher] = useState(false);
  const [formPlace, setFormPlace] = useState({ id: "", name: "" });
  const [formAuthor, setFormAuthor] = useState({ id: "", name: "", type: "" });
  const [formPublisher, setFormPublisher] = useState({ id: "", name: "" });

  const handleCreateAuthor = () => {
    setCreateAuthor(!createAuthor);
  };
  const handleCreatePlace = () => {
    setCreatePlace(!createPlace);
  };
  const handleCreatePublisher = () => {
    setCreatePublisher(!createPublisher);
  };
  const router = useRouter();
  const pilihan_type = [
    { label: "Personal Name", value: "P" },
    { label: "Organizational Body", value: "O" },
    { label: "Conference", value: "C" },
  ];

  const {
    res: resCodePlace,
    isLoading: isLoadingCodePlace,
    isError: isErrorCodePlace,
  } = useFetcher(`place/code`);

  useEffect(() => {
    if (resCodePlace) {
      const { code, status } = resCodePlace;
      if (status) {
        setFormPlace({ ...formPlace, id: code });
      }
    }
  }, [resCodePlace, setForm]);

  const {
    res: resCodeAuthor,
    isLoading: isLoadingCodeAuthor,
    isError: isErrorCodeAuthor,
  } = useFetcher(`author/code`);

  useEffect(() => {
    if (resCodeAuthor) {
      const { code, status } = resCodeAuthor;
      if (status) {
        setFormAuthor({ ...formAuthor, id: code });
      }
    }
  }, [resCodeAuthor, setForm]);

  const {
    res: resCodePublisher,
    isLoading: isLoadingCodePublisher,
    isError: isErrorCodePublisher,
  } = useFetcher(`publisher/code`);

  useEffect(() => {
    if (resCodePublisher) {
      const { code, status } = resCodePublisher;
      if (status) {
        setFormPublisher({ ...formPublisher, id: code });
      }
    }
  }, [resCodePublisher, setForm]);

  const handleSubmitAddPlace = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/place`,
        formPlace,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatePlace(!createPlace);
      handleRefreshClickPlace();
      setFormPlace({
        id: "",
        name: "",
      });
      setNotification({
        show: true,
        type: "Success",
        message: res.data.message,
      });
    } catch (error) {
      setCreatePlace(!createPlace);
      setFormPlace({
        id: "",
        name: "",
      });
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleSubmitAddPublsiher = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/publisher`,
        formPublisher,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatePublisher(!createPublisher);
      handleRefreshClickPublisher();
      setFormPublisher({
        id: "",
        name: "",
      });
      setNotification({
        show: true,
        type: "Success",
        message: res.data.message,
      });
    } catch (error) {
      setCreatePublisher(!createPublisher);
      setFormPublisher({
        id: "",
        name: "",
      });
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleSubmitAddAuthor = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${
          typeof window === "undefined"
            ? process.env.API_URL_SSR
            : process.env.API_URL
        }/api/author`,
        formAuthor,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreateAuthor(!createAuthor);
      handleRefreshClickAuthor();
      setFormAuthor({
        id: "",
        name: "",
        type: "",
      });
      setNotification({
        show: true,
        type: "Success",
        message: res.data.message,
      });
    } catch (error) {
      setFormAuthor({
        id: "",
        name: "",
        type: "",
      });
      setCreateAuthor(!createAuthor);
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const { res } = useFetcher("author");

  useEffect(() => {
    if (res) {
      const data = res.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectAuthor(data);
    }
  }, [res]);

  const fetchDataAndUpdateAuthor = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://wezady.my.id/api/author", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data.data;
      const data = responseData.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSelectAuthor(data);
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleRefreshClickAuthor = () => {
    fetchDataAndUpdateAuthor();
  };

  const { res: resGmd } = useFetcher("gmd");

  useEffect(() => {
    if (resGmd) {
      const data = resGmd.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectGmd(data);
    }
  }, [resGmd]);

  const { res: resContent } = useFetcher("contenttype");

  useEffect(() => {
    if (resContent) {
      const data = resContent.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectContent(data);
    }
  }, [resContent]);

  const { res: resMedia } = useFetcher("mediatype");

  useEffect(() => {
    if (resMedia) {
      const data = resMedia.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectMedia(data);
    }
  }, [resMedia]);

  const { res: resCarrier } = useFetcher("carriertype");

  useEffect(() => {
    if (resCarrier) {
      const data = resCarrier.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectCarrier(data);
    }
  }, [resCarrier]);

  const { res: resPlace } = useFetcher("place");

  useEffect(() => {
    if (resPlace) {
      const data = resPlace.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectPlace(data);
    }
  }, [resPlace]);

  const fetchDataAndUpdatePlace = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://wezady.my.id/api/place", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data.data;
      const data = responseData.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSelectPlace(data);
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleRefreshClickPlace = () => {
    fetchDataAndUpdatePlace();
  };

  const { res: resPublisher } = useFetcher("publisher");

  useEffect(() => {
    if (resPublisher) {
      const data = resPublisher.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectPublisher(data);
    }
  }, [resPublisher]);

  const fetchDataAndUpdatePublisher = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("https://wezady.my.id/api/publisher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data.data;
      const data = responseData.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setSelectPublisher(data);
    } catch (error) {
      setNotification({
        show: true,
        type: "Danger",
        message: error.message,
      });
    }
  };

  const handleRefreshClickPublisher = () => {
    fetchDataAndUpdatePublisher();
  };

  const { res: resSubject } = useFetcher("subject");

  useEffect(() => {
    if (resSubject) {
      const data = resSubject.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectSubject(data);
    }
  }, [resSubject]);

  const { res: resDocLanguage } = useFetcher("doclanguage");

  useEffect(() => {
    if (resDocLanguage) {
      const data = resDocLanguage.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectDocLanguage(data);
    }
  }, [resDocLanguage]);

  const { res: resLabel } = useFetcher("label");

  useEffect(() => {
    if (resLabel) {
      const data = resLabel.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectLabel(data);
    }
  }, [resLabel]);

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.title === "" ||
      form.authors_id === "" ||
      form.gmds_id === "" ||
      form.isbn_issn === "" ||
      form.publishers_id === "" ||
      form.publisher_year === "" ||
      form.doc_languages_id === "" ||
      form.places_id === "" ||
      form.labels_id === "" ||
      form.file === null ||
      form.opac === null ||
      form.current_stock === null
    ) {
      setNotification({
        show: true,
        type: "Warning",
        message: "Please fill in all fields.",
      });
      return false;
    } else {
      return true;
    }
  };

  const pilihan_status = [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  const {
    res: resCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useFetcher(`book/code`);

  useEffect(() => {
    if (resCode) {
      const { code, status } = resCode;
      if (status) {
        setForm({ ...form, id: code });
      }
    }
  }, [resCode, setForm]);

  const handleSubmitAdd = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/book`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resetForm();
        setNotification({
          show: true,
          type: "Success",
          message: res.data.message,
        });
        router.push("/bookDetail");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/bookDetail");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Book " type="title" />
        <div className="space-y-2">
          <Label label="Book Title *">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Book Title"
              title="Book Title"
              value={form.title}
              setValue={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Label>
          <Label label="Author *">
            <div className="flex gap-4">
              <Selects
                search
                list={selectAuthor}
                placeholder="Pilih Author"
                handleChange={(item) =>
                  setForm({ ...form, authors_id: item.value })
                }
              />
              <Button handleClick={handleCreateAuthor}>+</Button>
            </div>
            {createAuthor ? (
              <div className="gap-4 flex">
                <Label
                  label="Create Author"
                  typeStyle={"w-full"}
                  childrenStyle={"flex gap-4 items-stretch"}
                >
                  <Label label="Author Name" typeStyle={"w-full"}>
                    <InputFields
                      type="text"
                      style="w-full"
                      placeholder="Author Name"
                      title="Author Name"
                      value={formAuthor.name}
                      setValue={(e) =>
                        setFormAuthor({ ...formAuthor, name: e.target.value })
                      }
                    />
                  </Label>
                  <Label
                    label="Author type"
                    typeStyle={"w-full"}
                    childrenStyle={"flex gap-4"}
                  >
                    <Selects
                      list={pilihan_type}
                      placeholder="Pilih Author Type"
                      handleChange={(item) =>
                        setFormAuthor({ ...formAuthor, type: item.value })
                      }
                    />
                    <Button
                      action="primary"
                      handleClick={handleSubmitAddAuthor}
                      style={"self-end"}
                    >
                      Save
                    </Button>
                  </Label>
                </Label>
              </div>
            ) : null}
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <Label label="Statement of Responsibility">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Statement of Responsibility"
                title="Statement of Responsibility"
                value={form.statement_of_responsibility}
                setValue={(e) =>
                  setForm({
                    ...form,
                    statement_of_responsibility: e.target.value,
                  })
                }
              />
            </Label>
            <Label label="Edition">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Edition"
                title="Edition"
                value={form.edition}
                setValue={(e) => setForm({ ...form, edition: e.target.value })}
              />
            </Label>
            <Label label="Specific Detail Info">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Specific Detail Info"
                title="Specific Detail Info"
                value={form.specific_detail_info}
                setValue={(e) =>
                  setForm({ ...form, specific_detail_info: e.target.value })
                }
              />
            </Label>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label label="GMD *">
              <Selects
                search
                list={selectGmd}
                placeholder="Pilih GMD"
                handleChange={(item) =>
                  setForm({ ...form, gmds_id: item.value })
                }
              />
            </Label>
            <Label label="Content">
              <Selects
                search
                list={selectContent}
                placeholder="Pilih Content"
                handleChange={(item) =>
                  setForm({ ...form, content_types_id: item.value })
                }
              />
            </Label>
            <Label label="Media">
              <Selects
                search
                list={selectMedia}
                placeholder="Pilih Media"
                handleChange={(item) =>
                  setForm({ ...form, media_types_id: item.value })
                }
              />
            </Label>
            <Label label="Carrier">
              <Selects
                search
                list={selectCarrier}
                placeholder="Pilih Carrier"
                handleChange={(item) =>
                  setForm({ ...form, carrier_types_id: item.value })
                }
              />
            </Label>
          </div>
          <Label label="ISBN/ISSN *">
            <InputFields
              type="number"
              style="w-full"
              placeholder="ISBN/ISSN"
              title="ISBN/ISSN"
              value={form.isbn_issn}
              setValue={(e) => setForm({ ...form, isbn_issn: e.target.value })}
            />
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <Label label="Publisher *">
              <div className="flex gap-4">
                <Selects
                  search
                  list={selectPublisher}
                  placeholder="Pilih Publisher"
                  handleChange={(item) =>
                    setForm({ ...form, publishers_id: item.value })
                  }
                />
                <Button handleClick={handleCreatePublisher}>+</Button>
              </div>
              {createPublisher ? (
                <div className="gap-4">
                  <Label
                    label="Publisher Name"
                    typeStyle={"w-full"}
                    childrenStyle={"flex gap-4"}
                  >
                    <InputFields
                      type="text"
                      style="w-full"
                      placeholder="Publisher Name"
                      title="Publisher Name"
                      value={formPublisher.name}
                      setValue={(e) =>
                        setFormPublisher({
                          ...formPublisher,
                          name: e.target.value,
                        })
                      }
                    />
                    <Button
                      action="primary"
                      handleClick={handleSubmitAddPublsiher}
                    >
                      Save
                    </Button>
                  </Label>
                </div>
              ) : null}
            </Label>
            <Label label="Publisher Year *">
              <InputFields
                type="number"
                style="w-full"
                placeholder="2024"
                title="Publisher Year"
                value={form.publisher_year}
                setValue={(e) =>
                  setForm({ ...form, publisher_year: e.target.value })
                }
              />
            </Label>
            <Label label="Publisher Place *">
              <div className="flex gap-4">
                <Selects
                  search
                  list={selectPlace}
                  placeholder="Pilih Publisher Place"
                  handleChange={(item) =>
                    setForm({ ...form, places_id: item.value })
                  }
                />
                <Button handleClick={handleCreatePlace}>+</Button>
              </div>
              {createPlace ? (
                <div className="flex gap-4">
                  <Label
                    label="Place Name"
                    typeStyle={"w-full"}
                    childrenStyle={"flex gap-4"}
                  >
                    <InputFields
                      type="text"
                      style="w-full grow"
                      placeholder="Place Name"
                      title="Place Name"
                      value={formPlace.name}
                      setValue={(e) =>
                        setFormPlace({ ...formPlace, name: e.target.value })
                      }
                    />
                    <Button action="primary" handleClick={handleSubmitAddPlace}>
                      Save
                    </Button>
                  </Label>
                </div>
              ) : null}
            </Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Label label="Collation">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Collation"
                title="Collation"
                value={form.collation}
                setValue={(e) =>
                  setForm({ ...form, collation: e.target.value })
                }
              />
            </Label>
            <Label label="Series Title">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Series Title"
                title="Series Title"
                value={form.series_title}
                setValue={(e) =>
                  setForm({ ...form, series_title: e.target.value })
                }
              />
            </Label>
            <Label label="Call Number">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Call Number"
                title="Call Number"
                value={form.call_number}
                setValue={(e) =>
                  setForm({ ...form, call_number: e.target.value })
                }
              />
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Label label="Subject">
              <Selects
                search
                list={selectSubject}
                placeholder="Pilih Subject"
                handleChange={(item) =>
                  setForm({ ...form, subjects_id: item.value })
                }
              />
            </Label>
            <Label label="Doc Language *">
              <Selects
                search
                list={selectDocLanguage}
                placeholder="Pilih Doc Language"
                handleChange={(item) =>
                  setForm({ ...form, doc_languages_id: item.value })
                }
              />
            </Label>
          </div>
          <Label label="Current Stock *">
            <InputFields
              type="number"
              style="w-full"
              placeholder="Current Stock"
              title="Current Stock"
              value={form.current_stock}
              setValue={(e) =>
                setForm({ ...form, current_stock: e.target.value })
              }
            />
          </Label>
          <Label label="Desc">
            <TextArea
              type="text"
              style="w-full"
              placeholder="Desc"
              title="Desc"
              value={form.desc}
              setValue={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <Label label="Label *">
              <Selects
                search
                list={selectLabel}
                placeholder="Pilih Label"
                handleChange={(item) =>
                  setForm({ ...form, labels_id: item.value })
                }
              />
            </Label>
            <Label label="Hide Opac *">
              <Selects
                search
                list={pilihan_status}
                placeholder="Pilih Opac"
                handleChange={(item) => setForm({ ...form, opac: item.value })}
              />
            </Label>
          </div>
          <Label label="Book Cover *">
            <ImageUploader
              type="file"
              style="w-full"
              placeholder="Book Cover"
              title="Book Cover"
              onChildValueChange={(imageList) =>
                setForm({ ...form, file: imageList })
              }
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button action="light" link="/bookDetail" handleClick={resetForm}>
            Cancel
          </Button>
          <Button action="primary" handleClick={handleSubmitAdd}>
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
}
