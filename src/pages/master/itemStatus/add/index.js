import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";

export default function AddItemStatus() {
  const { itemstatus, basic } = useAppContext();
  const { form, setForm, resetForm, notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === "" ||
      form.code === ""
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


  const {
    res: resCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useFetcher(`itemstatus/code`);


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
          }/api/itemstatus`,
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
        router.push("/master/itemStatus");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/master/itemStatus");
      }
    }
  };
  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add ItemStatus" type="title" />
        <div className="gap-2">
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
        <div className="flex flex-row justify-end gap-4">
          <Button
            action="light"
            link="/master/itemStatus"
            handleClick={resetForm}
          >
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
