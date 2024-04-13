import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";

export default function AddSupplier() {
  const { supplier, basic } = useAppContext();
  const { form, setForm, resetForm, notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === "" 
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
  } = useFetcher(`supplier/code`);


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
          }/api/supplier`,
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
        router.push("/master/supplier");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/master/supplier");
      }
    }
  };
  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Supplier" type="title" />
        <div className="gap-2">
          <Label label="Supplier Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Supplier Name"
              title="Supplier Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Address">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Address"
              title="Address"
              value={form.address}
              setValue={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Label>
          <Label label="Portal Code">
            <InputFields
              type="number"
              style="w-full"
              placeholder="Portal Code"
              title="Portal Code"
              value={form.portal_code}
              setValue={(e) => setForm({ ...form,portal_code: e.target.value })}
            />
          </Label>
          <Label label="Phone number">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Phone number"
              title="Phone number"
              value={form.phone_number}
              setValue={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button
            action="light"
            link="/master/supplier"
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
