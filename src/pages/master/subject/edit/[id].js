import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Label from "@/components/label";
import InputFields from "@/components/inputFields";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";

const EditSubject = ({ id }) => {
  const { subject, basic } = useAppContext();
  const { form, setForm, resetForm, notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === "" ||
      form.subjects_type === ""
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
          }/api/subject/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`subject/${id}`);
  

  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        subjects_type: res.data.subjects_type,
        classification_code: res.data.classification_code,
      });
    }
  }, [res, setForm]);


  return (
    <Layout>
      <div className="space-y-5 p-2">
      <Label label="Edit Subject" type="title" />
        <div className="">
        <Label label="Subject Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Subject Name"
              title="Subject Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Classification Code">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Classification Code"
              title="Classification Code"
              value={form.classification_code}
              setValue={(e) => setForm({ ...form, classification_code: e.target.value })}
            />
          </Label>
          <Label label="Type">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Type"
              title="Type"
              value={form.subjects_type}
              setValue={(e) => setForm({ ...form, subjects_type: e.target.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button
            action="light"
            link="/master/subject"
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

export default EditSubject;
