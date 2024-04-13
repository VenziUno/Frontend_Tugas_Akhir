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

export default function AddCarrierType() {
  const { basic } = useAppContext();
  const { form, setForm, resetForm, notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();

  const handleCheck = () => {
    if (
      form.code === "" ||
      form.id === "" ||
      form.name === "" ||
      form.mrac === "" 
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
  } = useFetcher(`carriertype/code`);

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
          }/api/carriertype`,
          form,
          {
            headers: {
              "Carrier-Type": "multipart/form-data",
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
        router.push("/master/carrierType");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/master/carrierType");
      }
    }
  };
  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Carrier Type" type="title" />
        <div className="gap-2">
          <Label label="Carrier Type Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Carrier Type Code"
              title="Carrier Type Code"
              value={form.code}
              setValue={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Label>
          <Label label="MRAC Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="MRAC Code"
              title="MRAC Code"
              value={form.mrac}
              setValue={(e) => setForm({ ...form, mrac: e.target.value })}
            />
          </Label>
          <Label label="Carrier Type Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Carrier Type Name"
              title="Carrier Type Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button
            action="light"
            link="/master/carrierType"
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
