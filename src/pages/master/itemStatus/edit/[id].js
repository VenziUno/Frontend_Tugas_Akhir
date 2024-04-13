import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Label from "@/components/label";
import InputFields from "@/components/inputFields";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";

const EditItemStatus = ({ id }) => {
  const { itemstatus, basic } = useAppContext();
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
    if (form.id === "" || form.name === "" || form.code === "") {
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
          }/api/itemstatus/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`itemstatus/${id}`);


  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        code: res.data.code,
      });
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit ItemStatus" type="title" />
        <div className="">
          <Label label="ItemStatus Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="ItemStatus Name"
              title="ItemStatus Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="ItemStatus Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="ItemStatus Code"
              title="ItemStatus Code"
              value={form.code}
              setValue={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button action="light" link="/master/itemstatus" handleClick={resetForm}>
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

export default EditItemStatus;
