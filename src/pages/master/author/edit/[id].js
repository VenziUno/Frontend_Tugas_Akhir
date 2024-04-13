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

const EditAuthor = ({ id }) => {
  const { basic } = useAppContext();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  const router = useRouter();
  const [author, setAuthor] = useState();
  const pilihan_type = [
    { label: "Personal Name", value: "P" },
    { label: "Organizational Body", value: "O" },
    { label: "Conference", value: "C" },
  ];

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === "" ||
      form.type === null
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
          }/api/author/${form.id}`,
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

  const { res, isLoading, isError } = useFetcher(`author/${id}`);


  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        birth_year: res.data.birth_year,
        type: res.data.type,
      });
      if (res.data.type === "0") {
        setAuthor({ label: "Personal Name", value: 0 });
      } else if (res.data.type === "1") {
        setAuthor({ label: "Organizational Body", value: 1 });
      } else if (res.data.type === "2") {
        setAuthor({ label: "Conference", value: 2 });
      } else setAuthor(null);
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Author" type="title" />
        <div className="">
          <Label label="Author Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Author Name"
              title="Author Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Author Birth">
            <InputFields
              type="date"
              style="w-full"
              placeholder="Author Birth"
              title="Author Birth"
              value={form.birth_year}
              setValue={(e) => setForm({ ...form, birth_year: e.target.value })}
            />
          </Label>
          <Label label="Author Type">
            {author && (
              <Selects
              value={author}
                list={pilihan_type}
                placeholder="Pilih Author Type"
                handleChange={(item) => setForm({ ...form, type: item.value })}
              />
            )}
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button action="light" link="/master/author" handleClick={resetForm}>
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

export default EditAuthor;
