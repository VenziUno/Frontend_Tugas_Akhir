import React, { forwardRef } from "react";
import { useBarcode } from "next-barcode";

const Barcode = forwardRef(({ printItem, printItemValue }, ref) => {
  return (
    <div ref={ref}>
      <div className="grid grid-cols-3 place-content-center">
        {printItem &&
          printItem.map((item, index) => {
            let accumulatedIndex = 0; // Menyimpan jumlah total item yang sudah ditampilkan sebelumnya
            // Menghitung jumlah total item yang sudah ditampilkan sebelumnya
            for (let i = 0; i < index; i++) {
              accumulatedIndex += parseInt(printItem[i].current_stock);
            }
            return (
              <React.Fragment key={index} >
                {[...Array(parseInt(item.current_stock))].map((_, i) => {
                  const currentIndex = accumulatedIndex + i; // Menghitung indeks aktual untuk item saat ini
                  const shouldPageBreak = (accumulatedIndex + i + 1) % 18 === 0; // Cek apakah harus melakukan page break
                  return (
                    <React.Fragment key={`${item.id}-${i}`}>
                      <div
                        className="border-2 border-black m-2"
                        style={{
                          breakAfter: shouldPageBreak ? "page" : "auto",
                        }} // Setelah 18 items, lakukan page break
                      >
                        <div className="flex flex-col grow justify-center align-middle border-b-2 border-black items-center py-2 px-4">
                          Perpustakaan SKKK2 Batam
                        </div>
                        <div className="flex">
                          <div className="flex flex-col grow justify-center align-middle items-center border-r-2 border-black">
                            <div>
                              {item.title.length > 15
                                ? item.title.slice(0, 15) + "..."
                                : item.title}
                            </div>
                            <BarcodeItem
                              key={currentIndex} // Gunakan currentIndex sebagai kunci unik
                              value={`${item.isbn_issn}${(currentIndex + 1)
                                .toString()
                                .padStart(3, "0")}`}
                            />
                          </div>
                          <div className="flex flex-col flex-none w-16 justify-center align-middle items-center px-6 py-4 ">
                            <div>{item.call_number}</div>
                            <div className="uppercase">
                              {item.author_name.slice(0, 3)}
                            </div>
                            <div>{item.title.slice(0, 1)}</div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
      </div>
      {printItemValue && (
        <div className="grid grid-cols-3 gap-4 mx-4 mt-2">
          {printItemValue.current_stock === undefined ? (
            <div className="border-2 border-black">
              <div className="flex flex-col grow justify-center align-middle border-b-2 border-black items-center py-2 px-4">
                Perpustakaan SKKK2 Batam
              </div>
              <div className="flex ">
                <div className="flex flex-col grow justify-center align-middle items-center border-r-2 border-black">
                  <div>
                    {printItemValue.book_name.length > 15
                      ? printItemValue.book_name.slice(0, 15) + "..."
                      : printItemValue.book_name}
                  </div>{" "}
                  <BarcodeItem value={printItemValue.isbn_issn} />
                </div>
                <div className="flex flex-col flex-none w-16 justify-center align-middle items-center px-6 py-4 ">
                  <div>{printItemValue.call_number}</div>
                  <div className="uppercase">
                    {printItemValue.author_name.slice(0, 3)}
                  </div>
                  <div>{printItemValue.book_name.slice(0, 1)}</div>
                </div>
              </div>
            </div>
          ) : (
            <React.Fragment>
              {[...Array(parseInt(printItemValue.current_stock))].map(
                (_, index) => (
                  <div className="border-2 border-black">
                    <div className="flex flex-col grow justify-center align-middle border-b-2 font-bold border-black items-center py-2 px-4">
                      Perpustakaan SKKK2 Batam
                    </div>
                    <div className="flex ">
                      <div className="flex flex-col grow justify-center align-middle items-center border-r-2 border-black">
                        <div>
                          {printItemValue.title.length > 15
                            ? printItemValue.title.slice(0, 15) + "..."
                            : printItemValue.title}
                        </div>{" "}
                        <BarcodeItem
                          key={index}
                          value={`${printItemValue.isbn_issn}${(index + 1)
                            .toString()
                            .padStart(3, "0")}`}
                        />
                      </div>
                      <div className="flex flex-col flex-none w-16 justify-center align-middle items-center px-6 py-4">
                        <div>{printItemValue.call_number}</div>
                        <div className="uppercase">
                          {printItemValue.author_name.slice(0, 3)}
                        </div>
                        <div>{printItemValue.title.slice(0, 1)}</div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
});

const BarcodeItem = ({ value }) => {
  const { inputRef } = useBarcode({
    value: value,
    options: { width: 2, height: 50 },
  });

  return <img ref={inputRef} />;
};

export default Barcode;
