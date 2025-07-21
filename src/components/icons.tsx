import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 17.25V13.5C9 12.6716 9.67157 12 10.5 12H13.5" />
      <path d="M14 12H19.5L21.75 17.25H16.5" />
      <path d="M4.5 17.25H15.75" />
      <path d="M6 17.25V10.5C6 8.01472 8.01472 6 10.5 6H13.5" />
      <circle cx="7.5" cy="17.25" r="2.25" />
      <circle cx="16.5" cy="17.25" r="2.25" />
    </svg>
  ),
};
