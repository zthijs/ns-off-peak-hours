import type { SVGProps } from "react";

export const Info = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 1a9 9 0 1 1 0 18 9 9 0 0 1 0-18" />
    <path d="M12 10.5c-.28 0-.5.22-.5.5v6c0 .28.22.5.5.5s.5-.22.5-.5v-6c0-.28-.22-.5-.5-.5M12 6.75a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8" />
  </svg>
);
