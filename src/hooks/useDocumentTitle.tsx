import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const BASE_TITLE = "Let's Umrah Dashboard";

const pathTitles: Record<string, string> = {
  "/": BASE_TITLE,
  "/packages": `Packages - ${BASE_TITLE}`,
  "/auth": `Login - ${BASE_TITLE}`,
  "/dashboard": `My Dashboard - ${BASE_TITLE}`,
  "/faq": `FAQ - ${BASE_TITLE}`,
  "/about": `About Us - ${BASE_TITLE}`,
  "/contact": `Contact - ${BASE_TITLE}`,
  "/admin": `Admin - ${BASE_TITLE}`,
};

export const useDocumentTitle = (customTitle?: string) => {
  const location = useLocation();

  useEffect(() => {
    if (customTitle) {
      document.title = `${customTitle} - ${BASE_TITLE}`;
      return;
    }
    const basePath = "/" + location.pathname.split("/").filter(Boolean)[0] ?? "";
    const title = pathTitles[location.pathname] ?? pathTitles[basePath] ?? BASE_TITLE;
    document.title = title;
  }, [location.pathname, customTitle]);
};
