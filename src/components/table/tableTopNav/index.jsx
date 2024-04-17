import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Selects from "@/components/selects";
import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import Barcode from "@/components/barcode";
import CardMember from "@/components/card/cardMember";

const TableTopNav = ({
  data,
  path,
  title,
  buttonAdd,
  buttonBack,
  buttonPrint,
  buttonPrintBatcode,
  search,
  list,
}) => {
  const location = useRouter();
  const { user } = useAppContext();
  const { setDeleteItem, setPrintItem } = user;
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrintBarcode = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className={`buttonAdd ? ("py-2 space-y-2 mb-3") : ('')`}>
      <div className="flex justify-between items-center ">
        <div className="flex flex-row items-center gap-2">
          {search && <InputFields icon="search" ></InputFields>}
          {/* {list && <Selects list={list} size="w-36" placeholder="Status" />} */}
        </div>
        <div className="flex flex-row items-center gap-2">
          {data && data.length !== 0 && buttonPrint  && (
            <React.Fragment>
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button action="info" handleClick={() => handlePrint()}>
                    Print
                  </Button>
                  );
                }}
                content={() => this.componentRef}
              />
              <div className="hidden print:block">
                <CardMember ref={componentRef} printItem={data} />
              </div>
            </React.Fragment>
          )}
          {data && data.length !== 0 && buttonPrintBatcode && (
            <React.Fragment>
              <ReactToPrint
                trigger={() => {
                  return (
                    <Button
                      action="info"
                      handleClick={() => handlePrintBarcode()}
                    >
                      Print
                    </Button>
                  );
                }}
                content={() => this.componentRef}
              />
              <div className="hidden print:block">
                <Barcode ref={componentRef} printItem={data} />
              </div>
            </React.Fragment>
          )}
          {buttonAdd && <Button link={path + "/add"}>Create</Button>}
          {buttonBack && <Button action="light" link={"/bookDetail"}>back</Button>}
        </div>
      </div>
    </div>
  );
};

export default TableTopNav;
