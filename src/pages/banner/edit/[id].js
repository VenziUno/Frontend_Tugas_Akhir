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
import TextArea from "@/components/textArea";
import ImageUploader from "@/components/imageUploader";

const EditBanner = ({ id }) => {
  const { banner, basic } = useAppContext();
  const { form, setForm, resetForm } = banner;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();
  const [status, setStatus] = useState();

  const pilihan_status = [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.title === "" ||
      form.description === "" ||
      form.file === "" ||
      form.status === 0
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
          }/api/banner/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`banner/${id}`);


  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        title: res.data.title,
        description: res.data.description,
        file: res.data.file,
        status: res.data.status,
      });
      if (res.data.status === 0) {
        setStatus({ label: "Tidak Aktif", value: 0 });
      } else if (res.data.status === 1) {
        setStatus({ label: "Aktif", value: 1 });
      } else setStatus(null);
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Banner" type="title" />
        <div className="">
          <Label label="Banner Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Banner Code"
              title="Banner Code"
              value={form.id}
              disabled
            />
          </Label>
          <Label label="Banner Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Banner Name"
              title="Banner Name"
              value={form.title}
              setValue={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Label>
          <Label label="Banner Description">
            <TextArea
              type="text"
              style="w-full"
              placeholder="Banner Description"
              title="Banner Description"
              value={form.description}
              setValue={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Label>
          <Label label="Status">
            {status && (
              <Selects
                list={pilihan_status}
                value={status}
                placeholder="Pilih Status"
                handleChange={(item) =>
                  setForm({ ...form, status: item.value })
                }
              />
            )}
          </Label>
          <Label label="Banner Image">
            <ImageUploader
              value={form.file}
              type="file"
              style="w-full"
              placeholder="Banner Image"
              title="Banner Image"
              onChildValueChange={(imageList) =>
                setForm({ ...form, file: imageList })
              }
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button action="light" link="/banner" handleClick={resetForm}>
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
  return { props: { id } };
}

export default EditBanner;
