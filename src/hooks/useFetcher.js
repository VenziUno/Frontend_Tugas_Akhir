import useSWR from "swr";
import axios from "axios";
import { useAppContext } from "./useAppContext";

const fetcher = async (url) => {
  const token = sessionStorage.getItem("token");
  return await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export function useFetcher(path, page, filter) {
  const { basic } = useAppContext();
  const { search } = basic;

  let linkUrl;

  const url = `${
    typeof window === "undefined"
      ? process.env.API_URL_SSR
      : process.env.API_URL
  }/api/${path}`;

  if (page) {
    // case 1 : WANT pagination, WANT filtering, WANT searching --- useFetcher("url", "page", "filter")
    if (filter) {
      linkUrl = `${url}?page=${page}&search=${search}&${filter}`;
    }
    // case 2 : WANT pagination, no filtering, WANT searching --- useFetcher("url", "page", false) / useFetcher("url", "page")
    else {
    // linkUrl = `${url}?page=${page}&search=${search}`;
      linkUrl = `${url}?page=${page}&search=${search}`;
    }
  } else {
    // case 3 : no pagination, WANT filtering, WANT searching --- useFetcher("url", false, "filter")
    if (filter) {
      linkUrl = `${url}?search=${search}&${filter}`;
    }
    // case 4 : no pagination, no filtering, WANT searching --- useFetcher("url", false, false)
    else if (filter === false) {
      linkUrl = `${url}?search=${search}`;
    }
    // case 5 : no pagination, no filtering, no searching --- useFetcher("url") -------> for PILIHAN
    else {
      linkUrl = url;
    }
  }

  const { data, error } = useSWR(linkUrl, fetcher);
  return {
    res: data,
    isLoading: !error && !data,
    isError: error,
  };
}