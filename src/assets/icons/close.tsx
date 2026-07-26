import type { SVGProps } from "react";

export const Close = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
