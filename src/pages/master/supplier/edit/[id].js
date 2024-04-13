import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Label from "@/components/label";
import InputFields from "@/components/inputFields";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";

const EditPublisher = ({ id }) => {
  const { publisher, basic } = useAppContext();
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

  const handleSubmitEdit = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/supplier/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`supplier/${id}`);
  

  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        address: res.data.address,
        portal_code: res.data.portal_code,
        phone_number: res.data.phone_number,
      });
    }
  }, [res, setForm]);


  return (
    <Layout>
      <div className="space-y-5 p-2">
      <Label label="Edit Publisher" type="title" />
        <div className="">
          <Label label="Publisher Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Publisher Name"
              title="Publisher Name"
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
        <div className="flex flex-row justify-end gap-5">
          <Button
            action="light"
            link="/master/supplier"
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

export default EditPublisher;
