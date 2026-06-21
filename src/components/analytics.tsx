import Script from "next/script";

export const Analytics = () => (
  <Script
    defer
    data-domain={process.env.NEXT_PUBLIC_PAGES_DOMAIN}
    src={process.env.NEXT_PUBLIC_VINCE_SCRIPT_URL}
  />
);
