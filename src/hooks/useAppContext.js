import React, { createContext, useContext } from "react";
import { useMenuProvider } from "./providers/useMenuProvider";
import { useBasicProvider } from "./providers/useBasicProvider";
import { useUserProvider } from "./providers/useUserProvider";
import { useRoleProvider } from "./providers/settings/useRoleProvider";
import { useBannerProvider } from "./providers/banner/useBannerProvider";
import { useBookCategoryProvider } from "./providers/book/useBookCategory";
import { useBookCatalogProvider } from "./providers/book/useBookCatalog";
import { useBookDetailProvider } from "./providers/book/useBookDetail";
import { useMemberProvider } from "./providers/member/useMember";
import { useAccountProvider } from "./providers/settings/useAccountProvider";
import { useConfigRfidProvider } from "./providers/settings/useConfigRfidProvider";

const appContext = createContext();

export const AppProvider = ({ children }) => {
  const menu = useMenuProvider();
  const basic = useBasicProvider();
  const user = useUserProvider();

  // Settings
  const role = useRoleProvider();
  const account = useAccountProvider();
  const config = useConfigRfidProvider();

  //Book
  const bookCategory = useBookCategoryProvider();
  const bookCatalog = useBookCatalogProvider();
  const bookDetail = useBookDetailProvider();

  // Banner
  const banner = useBannerProvider();

  //Member
  const member = useMemberProvider();

  return (
    <appContext.Provider
      value={{
        account,
        basic,
        banner,
        bookCatalog,
        bookCategory,
        bookDetail,
        config,
        menu,
        member,
        user,
        role,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(appContext);
};
