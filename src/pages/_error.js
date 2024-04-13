import React from "react";
import Router from "next/router";

const ErrorPage = ({ statusCode }) => {
  let errorMessage = "Oops! Something went wrong.";
  switch (statusCode) {
    case 404:
      errorMessage = "Oops! The page you're looking for cannot be found.";
      break;
    case 500:
      errorMessage = "Oops! Internal server error occurred.";
      break;
    default:
      errorMessage = "Oops! Something went wrong.";
      break;
  }

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-9xl font-bold">{statusCode}</h1>
        <p className="text-lg mb-4">{errorMessage}</p>
        <button
          onClick={() => Router.back()}
          className="bg-transparent hover:bg-primary-300 text-primary-300 hover:text-white rounded-full shadow-lg py-2 px-6 border-2 border-primary-300 hover:border-transparent transition duration-300 ease-in-out transform hover:scale-105"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
