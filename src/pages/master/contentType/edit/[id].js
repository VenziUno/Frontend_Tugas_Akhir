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

const EditContentType = ({ id }) => {
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

  const handleCheck = () => {
    if (
      form.code === "" ||
      form.name === "" ||
      form.id === ""
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
          }/api/contenttype/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`contenttype/${id}`);


  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        code: res.data.code,
        mrac: res.data.mrac,
      });
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Content Type" type="title" />
        <div className="">
          <Label label="Content Type Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Content Type Name"
              title="Content Type Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Content Type Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Content Type Code"
              title="Content Type Code"
              value={form.code}
              setValue={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Label>
          <Label label="MRAC Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="MRAC Name"
              title="MRAC Name"
              value={form.mrac}
              setValue={(e) => setForm({ ...form, mrac: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button
            action="light"
            link="/master/contenttype"
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
  return { props: { id } };
}

export default EditContentType;
