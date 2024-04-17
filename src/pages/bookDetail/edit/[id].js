import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Label from "@/components/label";
import InputFields from "@/components/inputFields";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";
import Selects from "@/components/selects";
import ImageUploader from "@/components/imageUploader";
import TextArea from "@/components/textArea";

const EditBook = ({ id }) => {
  const { bookDetail, basic } = useAppContext();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  const [selectAuthor, setSelectAuthor] = useState([]);
  const [author, setAuthor] = useState(null);
  const [selectGmd, setSelectGmd] = useState([]);
  const [gmd, setGmd] = useState(null);
  const [selectContent, setSelectContent] = useState([]);
  const [content, setContent] = useState(null);
  const [selectMedia, setSelectMedia] = useState([]);
  const [media, setMedia] = useState(null);
  const [selectCarrier, setSelectCarrier] = useState([]);
  const [carrier, setCarrier] = useState(null);
  const [selectPublisher, setSelectPublisher] = useState([]);
  const [publisher, setPublisher] = useState(null);
  const [selectPlace, setSelectPlace] = useState([]);
  const [place, setPlace] = useState(null);
  const [selectSubject, setSelectSubject] = useState([]);
  const [subject, setSubject] = useState(null);
  const [selectDocLanguage, setSelectDocLanguage] = useState([]);
  const [docLanguage, setDocLanguage] = useState(null);
  const [selectLabel, setSelectLabel] = useState([]);
  const [label, setLabel] = useState(null);
  const router = useRouter();
  const [opac, setOpac] = useState();
  const pilihan_status = [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  const { res: resBook } = useFetcher(`book/${id}`);

  useEffect(() => {
    if (resBook !== undefined) {
      setForm({
        id: resBook.data.id,
        title: resBook.data.title,
        authors_id: resBook.data.authors_id,
        statement_of_responsibility: resBook.data.statement_of_responsibility,
        edition: resBook.data.edition,
        specific_detail_info: resBook.data.specific_detail_info,
        gmds_id: resBook.data.gmds_id,
        isbn_issn: resBook.data.isbn_issn,
        content_types_id: resBook.data.content_types_id,
        media_types_id: resBook.data.media_types_id,
        carrier_types_id: resBook.data.carrier_types_id,
        publishers_id: resBook.data.publishers_id,
        publisher_year: resBook.data.publisher_year,
        places_id: resBook.data.places_id,
        collation: resBook.data.collation,
        series_title: resBook.data.series_title,
        call_number: resBook.data.call_number,
        subjects_id: resBook.data.subjects_id,
        doc_languages_id: resBook.data.doc_languages_id,
        file: resBook.data.file,
        opac: resBook.data.opac,
        desc: resBook.data.desc,
        labels_id: resBook.data.labels_id,
        current_stock: resBook.data.current_stock,
      });

      if (resBook.data.opac === 0) {
        setOpac({ label: "Tidak Aktif", value: 0 });
      } else if (resBook.data.opac === 1) {
        setOpac({ label: "Aktif", value: 1 });
      }

      setAuthor({
        value: resBook.data.author.id,
        label: resBook.data.author.name,
      });

      setGmd({
        value: resBook.data.gmd.id,
        label: resBook.data.gmd.name,
      });

      if (resBook.data.content_type !== null) {
        setContent({
          value: resBook.data.content_type.id,
          label: resBook.data.content_type.name,
        });
      } else {
        setContent(null);
      }

      if (resBook.data.media_type !== null) {
        setMedia({
          value: resBook.data.media_type.id,
          label: resBook.data.media_type.name,
        });
      } else {
        setMedia(null);
      }

      if (resBook.data.carrier_type !== null) {
        setCarrier({
          value: resBook.data.carrier_type.id,
          label: resBook.data.carrier_type.name,
        });
      } else {
        setCarrier(null);
      }

      setPublisher({
        value: resBook.data.publisher.id,
        label: resBook.data.publisher.name,
      });

      setPlace({
        value: resBook.data.place.id,
        label: resBook.data.place.name,
      });

      if (resBook.data.subject !== null) {
        setSubject({
          value: resBook.data.subject.id,
          label: resBook.data.subject.name,
        });
      } else {
        setSubject(null);
      }
      setDocLanguage({
        value: resBook.data.doc_language.id,
        label: resBook.data.doc_language.name,
      });

      setLabel({
        value: resBook.data.label.id,
        label: resBook.data.label.name,
      });
    }
  }, [resBook, setForm]);

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
      form.content_types_id === "" ||
      form.media_types_id === "" ||
      form.carrier_types_id === "" ||
      form.publishers_id === "" ||
      form.publisher_year === "" ||
      form.subjects_id === "" ||
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

  const handleSubmitEdit = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/book/${form.id}`,
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
        router.back();
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.back();
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Book" type="title" />
        <div className="gap-2">
          <Label label="Book Title">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Book Title"
              title="Book Title"
              value={form.title}
              setValue={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Label>
          <Label label="Author">
            {author && (
              <Selects
                search
                value={author}
                list={selectAuthor}
                placeholder="Pilih Author"
                handleChange={(item) =>
                  setForm({ ...form, authors_id: item.value })
                }
              />
            )}
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
          <Label label="GMD">
            {gmd && (
              <Selects
                search
                value={gmd}
                list={selectGmd}
                placeholder="Pilih GMD"
                handleChange={(item) =>
                  setForm({ ...form, gmds_id: item.value })
                }
              />
            )}
          </Label>
          <Label label="Content">
            <Selects
              search
              value={content}
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
              value={media}
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
              value={carrier}
              list={selectCarrier}
              placeholder="Pilih Carrier"
              handleChange={(item) =>
                setForm({ ...form, carrier_types_id: item.value })
              }
            />
          </Label>
          </div>
          <Label label="ISBN/ISSN">
            <InputFields
              type="text"
              style="w-full"
              placeholder="ISBN/ISSN"
              title="ISBN/ISSN"
              value={form.isbn_issn}
              setValue={(e) => setForm({ ...form, isbn_issn: e.target.value })}
            />
          </Label>
          <div className="grid grid-cols-3 gap-4">
          <Label label="Publisher">
            {publisher && (
              <Selects
                search
                value={publisher}
                list={selectPublisher}
                placeholder="Pilih Publisher"
                handleChange={(item) =>
                  setForm({ ...form, publishers_id: item.value })
                }
              />
            )}
          </Label>
          <Label label="Publisher Year">
            <InputFields
              type="number"
              style="w-full"
              placeholder="Publisher Year"
              title="Publisher Year"
              value={form.publisher_year}
              setValue={(e) =>
                setForm({ ...form, publisher_year: e.target.value })
              }
            />
          </Label>
          <Label label="Publisher Place">
            {place && (
              <Selects
                search
                value={place}
                list={selectPlace}
                placeholder="Pilih Publisher Place"
                handleChange={(item) =>
                  setForm({ ...form, places_id: item.value })
                }
              />
            )}
          </Label>
          </div>
          <div className="grid grid-cols-3 gap-4">
          <Label label="collation">
            <InputFields
              type="text"
              style="w-full"
              placeholder="collation"
              title="collation"
              value={form.collation}
              setValue={(e) => setForm({ ...form, collation: e.target.value })}
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
                value={subject}
                list={selectSubject}
                placeholder="Pilih Subject"
                handleChange={(item) =>
                  setForm({ ...form, subjects_id: item.value })
                }
              />
          </Label>
          <Label label="Doc Language">
            {docLanguage && (
              <Selects
                search
                value={docLanguage}
                list={selectDocLanguage}
                placeholder="Pilih Doc Language"
                handleChange={(item) =>
                  setForm({ ...form, doc_languages_id: item.value })
                }
              />
            )}
          </Label>
          </div>
          <Label label="Current Stock">
            <InputFields
              type="text"
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
          <Label label="Label">
            {label && (
              <Selects
                search
                value={label}
                list={selectLabel}
                placeholder="Pilih Label"
                handleChange={(item) =>
                  setForm({ ...form, labels_id: item.value })
                }
              />
            )}
          </Label>
          <Label label="Hide Opac">
            {opac && (
              <Selects
                search
                value={opac}
                list={pilihan_status}
                placeholder="Pilih Opac"
                handleChange={(item) => setForm({ ...form, opac: item.value })}
              />
            )}
          </Label>
          </div>
          <Label label="Book Cover">
            <ImageUploader
              value={form.file}
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
        <div className="flex flex-row justify-end gap-5">
          <Button
            action="light"
            link="/bookDetail"
            handleClick={resetForm}
          >
            Back
          </Button>
          <Button
            action="primary"
            handleClick={(e) => {
              e.preventDefault();
              handleSubmitEdit();
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  let id = ctx.query.id;
  const page = ctx.query.page || 1;
  return { props: { id, page } };
}

export default EditBook;
