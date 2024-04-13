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

export default function Password() {
  const { role, basic } = useAppContext();
  const { form, setForm, resetForm } = role;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();
  
  const handleCheck = () => {
    if (
      form.current_password === "" ||
      form.new_password === ""
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

  const handleSubmitAdd = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/change-password`,
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
        router.back()
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.back()
      }
    }
  };
  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Role" type="title" />
        <div className="gap-2">
          <Label label="Password">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Password"
              title="Password"
              value={form.current_password}
              setValue={(e) => setForm({ ...form, current_password: e.target.value })}
            />
          </Label>
          <Label label="New Password">
            <InputFields
              type="text"
              style="w-full"
              placeholder="New Password"
              title="New Password"
              value={form.new_password}
              setValue={(e) => setForm({ ...form, new_password: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
        <Button action="light" handleClick={() => router.back()}>Kembali</Button>
          <Button action="primary" handleClick={handleSubmitAdd}>
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
}
