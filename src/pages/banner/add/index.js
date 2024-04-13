import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import Selects from "@/components/selects";
import TextArea from "@/components/textArea";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ImageUploader from "@/components/imageUploader";

export default function AddBanner() {
  const { banner, basic } = useAppContext();
  const { form, setForm, resetForm } = banner;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState();

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
    setForm({ ...form, file: e.target.files[0] });
  };

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.title === "" ||
      form.description === "" ||
      form.file === null ||
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

  const pilihan_status = [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  const {
    res: resCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useFetcher(`banner/code`);

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
          }/api/banner`,
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
        router.push("/banner");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/banner");
      }
    }
  };
  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Banner" type="title" />
        <div className="gap-2">
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
            <Selects
              list={pilihan_status}
              placeholder="Pilih Status"
              handleChange={(item) => setForm({ ...form, status: item.value })}
            />
          </Label>
          <Label label="Banner Image">
            <ImageUploader
              type="file"
              style="w-full"
              placeholder="Banner Image"
              title="Banner Image"
              onChildValueChange={(imageList)=>setForm({ ...form, file: imageList })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button action="light" link="/banner" handleClick={resetForm}>
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
