import Image from "next/image";
import React, { forwardRef } from "react";

const CardMember = forwardRef(({ printItem, printItemValue }, ref) => {
  const items = printItem || [];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 p-2">
      {printItem &&
        printItem.map((printItem, index) => (
          <div
            key={index}
            className="relative isolate flex items-center align-middle justify-center flex-col overflow-hidden rounded-2xl p-4 w-[322.97px] h-[204.02px]"
          >
            <Image
              src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a"
              alt="Card Member"
              className="absolute inset-0 h-full w-full object-cover"
              width={100}
              height={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
            <div className="z-10 flex space-x-2 align-middle items-center">
              <Image
                src={printItem.file || "/download.png"}
                alt="Card Member"
                className="object-cover"
                width={100}
                height={100}
              />
              <table className="text-white">
                <tbody>
                  <tr>
                    <td className="w-full">NIS</td>
                    <td className="px-2">:</td>
                    <td>{printItem.nis}</td>
                  </tr>
                  <tr>
                    <td className="w-full">Name</td>
                    <td className="px-2">:</td>
                    <td>{printItem.name}</td>
                  </tr>
                  <tr>
                    <td className="w-full">Gender</td>
                    <td className="px-2">:</td>
                    <td>{printItem.gender}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      {printItemValue && (
        <div className="relative isolate flex items-center align-middle justify-center flex-col overflow-hidden rounded-2xl p-8 h-64 w-96">
          <Image
            src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a"
            alt="Card Member"
            className="absolute inset-0 h-full w-full object-cover"
            width={100}
            height={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
          <div className="z-10 flex space-x-8 align-middle items-center">
            <Image
              src={printItemValue.file}
              alt="Card Member"
              className="object-cover"
              width={100}
              height={100}
            />
            <table className="text-white">
              <tbody>
                <tr>
                  <td className="w-full">NO</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.rfid}</td>
                </tr>
                <tr>
                  <td className="w-full">NIS</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.nis}</td>
                </tr>
                <tr>
                  <td className="w-full">Name</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.name}</td>
                </tr>
                <tr>
                  <td className="w-full">Gender</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.gender}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export default CardMember;
