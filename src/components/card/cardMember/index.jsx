import Image from "next/image";
import React, { forwardRef } from "react";

const CardMember = forwardRef(({ printItem, printItemValue }, ref) => {
  const items = printItem || [];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 p-2 place-items-start">
      {printItem &&
        printItem.map((printItem, index) => (
          <div
            key={index}
            className={`relative isolate flex items-center align-middle justify-center flex-col overflow-hidden rounded-2xl p-4 w-[322.97px] h-[204.02px] ${
              index % 10 === 0 ? "page-break" : ""
            }`}
          >
            <Image
              src="/16282276_rm222batch2-mind-03.jpg"
              alt="Card Member"
              className="absolute inset-0 h-full w-full object-cover"
              width={100}
              height={100}
            />
            <div className="z-10 flex space-x-2 align-middle items-center">
              <table className="text-black text-xl">
                <tbody>
                  <tr>
                    <td>NIS</td>
                    <td className="px-2">:</td>
                    <td>{printItem.nis}</td>
                  </tr>
                  <tr>
                    <td>Name</td>
                    <td className="px-2">:</td>
                    <td>{printItem.name}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
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
            src="/16282276_rm222batch2-mind-03.jpg"
            alt="Card Member"
            className="absolute inset-0 h-full w-full object-cover"
            width={100}
            height={100}
          />
          <div className="z-10 flex space-x-8 align-middle items-center">
            <table className="text-black text-xl">
              <tbody>
                <tr>
                  <td>NIS</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.nis}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td className="px-2">:</td>
                  <td>{printItemValue.name}</td>
                </tr>
                <tr>
                  <td>Gender</td>
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
