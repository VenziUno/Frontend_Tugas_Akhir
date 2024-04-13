import React, { forwardRef } from "react";
import { useBarcode } from "next-barcode";

const Barcode = forwardRef(({ printItem, printItemValue }, ref) => {
  return (
    <div ref={ref}>
      {printItem &&
        printItem.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            {[...Array(parseInt(item.current_stock))].map((_, i) => (
              <React.Fragment key={`${item.id}-${i}`}>
                <BarcodeItem
                  key={i}
                  value={`${item.isbn_issn}${(i + 1)
                    .toString()
                    .padStart(3, "0")}`}
                />
              </React.Fragment>
            ))}
          </div>
        ))}
      {printItemValue && (
        <div className="grid grid-cols-3 gap-4">
          {printItemValue.current_stock === undefined ? (
            <BarcodeItem value={printItemValue.isbn_issn} />
          ) : (
            <React.Fragment>
              {[...Array(parseInt(printItemValue.current_stock))].map(
                (_, index) => (
                  <BarcodeItem
                    key={index}
                    value={`${printItemValue.isbn_issn}${(index + 1)
                      .toString()
                      .padStart(3, "0")}`}
                  />
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
