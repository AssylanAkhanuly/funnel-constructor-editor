"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

function PageMobileHeader(props: {
  onBackClick?: () => void;
  onBurgerClick?: () => void;
  burger: "true" | "false";
  back: "true" | "false";
  logo: "true" | "false";
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        `relative flex justify-center items-center`,
        props.className
      )}
    >
      {props.back === "true" && (
        <button
          onClick={props.onBackClick}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="_Glyphs / Nav &#38; Toolbar / Close">
              <g id="arrow-left">
                <path
                  id="Vector"
                  d="M16.1483 21C15.9268 21 15.7052 20.9273 15.5303 20.7716L7.92708 14.0025C6.69097 12.9019 6.69097 11.0955 7.92708 9.99495L15.5303 3.22581C15.8684 2.92473 16.4282 2.92473 16.7664 3.22581C17.1045 3.52689 17.1045 4.02523 16.7664 4.32632L9.16318 11.0955C8.60343 11.5938 8.60343 12.4036 9.16318 12.9019L16.7664 19.6711C17.1045 19.9722 17.1045 20.4705 16.7664 20.7716C16.5914 20.9169 16.3699 21 16.1483 21Z"
                  fill="currentColor"
                />
              </g>
            </g>
          </svg>
        </button>
      )}
      {props.logo === "true" && (
        <Image width={143} height={28.67} alt="logo" src={"https://d7pqxnw01lpes.cloudfront.net/media/quiz_funnel/logo.webp"} />
      )}
      {props.burger === "true" && (
        <button
          onClick={props.onBurgerClick}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Menu Icon/1">
              <line
                id="Line 12"
                x1="2.825"
                y1="6.175"
                x2="21.175"
                y2="6.175"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
              />
              <line
                id="Line 13"
                x1="2.825"
                y1="12.175"
                x2="21.175"
                y2="12.175"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
              />
              <line
                id="Line 14"
                x1="2.825"
                y1="18.175"
                x2="21.175"
                y2="18.175"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </button>
      )}
    </div>
  );
}

export default PageMobileHeader;
