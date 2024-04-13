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

export default function AddMember() {
  const { account, basic } = useAppContext();
  const { form, setForm, resetForm } = account;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();
  const { res, isLoading, isError } = useFetcher("role");
  const [selectOptions, setSelectOptions] = useState([]);

  const handleCheck = () => {
    if (
      form.name === "" ||
      form.email === "" ||
      form.password === "" ||
      form.password_confirmation === "" ||
      form.role === ""
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

  useEffect(() => {
    if (res) {
      const data = res.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
      setSelectOptions(data);
    }
   
  }, [res]);

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
          }/api/admin`,
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
        router.push("/settings/account");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/settings/account");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Member" type="title" />
        <div className="gap-2">
          <Label label="Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Name"
              title="Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Email">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Email"
              title="Email"
              value={form.email}
              setValue={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Label>
          <Label label="Password">
            <InputFields
              type="password"
              style="w-full"
              placeholder="* * * * * * * *"
              icon="eye"
              title="Password"
              value={form.password}
              setValue={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Label>
          <Label label="Confirmed Password">
            <InputFields
              type="password"
              style="w-full"
              placeholder="* * * * * * * *"
              icon="eye"
              title="Confirmed Password"
              value={form.password_confirmation}
              setValue={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
            />
          </Label>
          <Label label="Role">
            <Selects
              list={selectOptions}
              placeholder="Pilih Role"
              handleChange={(item) => setForm({ ...form, role_id: item.value })}
            />
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button
            action="light"
            link="/settings/account"
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
