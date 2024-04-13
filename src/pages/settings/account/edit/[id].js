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

const EditAccount = ({ id }) => {
  const { account, basic } = useAppContext();
  const { form, setForm, resetForm } = account;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();
  const [status, setStatus] = useState();
  const [selectOptions, setSelectOptions] = useState([]);
  const [options, setOptions] = useState(null);

  const pilihan_status = [
    { label: "Aktif", value: 1 },
    { label: "Tidak Aktif", value: 0 },
  ];

  const handleCheck = () => {
    if (
      form.name === "" ||
      form.email === "" ||
      form.password === "" ||
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

  const handleSubmitEdit = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/admin/${form.id}`,
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


  const { res, isLoading, isError } = useFetcher(`role`);
  const {
    res: resAccount,
    isLoading: isLoadingAccount,
    isError: isErrorAccount,
  } = useFetcher(`admin/${id}`);

  useEffect(() => {
    if (res) {
      const data = res.data.map((role) => ({
        label: role.name,
        value: role.id,
      }));
      setSelectOptions(data);
    }
   
  }, [res]);

  // // set value
  useEffect(() => {
    if (resAccount !== undefined) {
      setForm({
        id: resAccount.data.id,
        name: resAccount.data.name,
        email: resAccount.data.email,
        role_id: resAccount.data.role_id,
      });
      setOptions({
        value: resAccount.data.role.id,
        label: resAccount.data.role.name,
      });
    }
  }, [resAccount, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Role" type="title" />
        <div className="">
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
          <Label label="Role">
            {options && (
              <Selects
                list={selectOptions}
                value={options}
                placeholder="Pilih Role"
                handleChange={(item) =>
                  setForm({ ...form, role_id: item.value })
                }
              />
            )}
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button
            action="light"
            link="/settings/account"
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

export default EditAccount;
