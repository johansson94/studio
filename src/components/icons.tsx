import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 17h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3" />
      <path d="M8 17h2a2 2 0 0 0 2-2v-3" />
      <path d="m16 17-3-3" />
      <path d="m2 12 4-4" />
      <path d="m6 12-4 4" />
      <circle cx="18" cy="17" r="2" />
      <circle cx="6" cy="17" r="2" />
    </svg>
  ),
};
