import Link from "next/link";
import React from "react";

const CardKatalog = ({ data }) => {
  const cardStyle = {
    backgroundImage: `url(${data.file})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "200px",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div className="max-w-sm border p-4 w-64 h-full max-h-[480px] rounded overflow-hidden shadow-lg mx-auto">
      <div className="bg-cover bg-center h-52 border" style={cardStyle}></div>
      <div className="px-6 py-4 h-28">
        <div className="font-bold text-lg mb-2">{data.title.length > 50 ? (data.title.slice(0, 40) + "...") :(data.title)}</div>
      </div>
      <Link href={`detailKatalog/${data.id}`} legacyBehavior>
        <a className="w-full bg-primary-300 border shadow hover:bg-primary-400 font-bold py-2 px-4 rounded inline-flex items-center">
          Read more info ...
        </a>
      </Link>
    </div>
  );
};

export default CardKatalog;
