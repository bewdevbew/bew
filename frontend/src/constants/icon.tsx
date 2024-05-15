import { cn } from "@/utils/ui";
import {
  Combine,
  Globe,
  PenLine,
  Smile,
  SquareLibrary,
  Telescope,
  Video,
} from "lucide-react";
import { ReactNode } from "react";

interface IcProps {
  className?: string;
}

export const IcClose = ({ className }: IcProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeDasharray="12"
      strokeDashoffset="12"
      strokeLinecap="round"
      strokeWidth="2"
      d="M12 12L19 19M12 12L5 5M12 12L5 19M12 12L19 5"
    >
      <animate
        fill="freeze"
        attributeName="stroke-dashoffset"
        dur="0.4s"
        values="12;0"
      />
    </path>
  </svg>
);

export const IcEdit = ({ className }: IcProps) => (
  <PenLine className={className} />
);

export const IcImage = ({ className }: IcProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        strokeDasharray="66"
        strokeDashoffset="66"
        strokeWidth="2"
        d="M3 14V5H21V19H3V14"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.6s"
          values="66;0"
        />
      </path>
      <path
        strokeDasharray="26"
        strokeDashoffset="26"
        d="M3 16L7 13L10 15L16 10L21 14"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.6s"
          dur="0.4s"
          values="26;0"
        />
      </path>
    </g>
    <circle cx="7.5" cy="9.5" r="1.5" fill="currentColor" fillOpacity="0">
      <animate
        fill="freeze"
        attributeName="fill-opacity"
        begin="1s"
        dur="0.4s"
        values="0;1"
      />
    </circle>
  </svg>
);

export const IcSmile = ({ className }: IcProps) => (
  <Smile className={className} />
);
export const IcCollection = ({ className }: IcProps) => (
  <SquareLibrary className={className} />
);
export const IcAction = ({ className }: IcProps) => (
  <Combine className={className} />
);
export const IcGlobe = ({ className }: IcProps) => (
  <Globe className={className} />
);

export const IcBen = ({ className }: IcProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      fill="currentColor"
      d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
    />
  </svg>
);

export const IcGif = ({ className }: IcProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M18.75 3.5A3.25 3.25 0 0 1 22 6.75v10.503a3.25 3.25 0 0 1-3.25 3.25H5.25A3.25 3.25 0 0 1 2 17.253V6.75A3.25 3.25 0 0 1 5.25 3.5zm0 1.5H5.25A1.75 1.75 0 0 0 3.5 6.75v10.503c0 .966.784 1.75 1.75 1.75h13.5a1.75 1.75 0 0 0 1.75-1.75V6.75A1.75 1.75 0 0 0 18.75 5M8.015 8.871c.596 0 1.019.082 1.502.314a.625.625 0 1 1-.541 1.127c-.3-.144-.54-.19-.961-.19c-.867 0-1.504.796-1.504 1.872c0 1.077.638 1.876 1.504 1.876c.428 0 .791-.18.98-.501L9 13.354v-.734h-.376a.625.625 0 0 1-.618-.532L8 11.996c0-.314.231-.574.533-.619l.092-.006h1.002c.314 0 .573.23.618.532l.007.093l-.002 1.547l-.006.056l-.021.09l-.02.055c-.377.89-1.241 1.376-2.188 1.376c-1.626 0-2.754-1.413-2.754-3.126c0-1.713 1.127-3.123 2.754-3.123m4.614.122c.314 0 .574.232.618.533l.007.092v4.762a.625.625 0 0 1-1.243.093l-.007-.093V9.619c0-.345.28-.625.625-.625m2.996 0L17.622 9a.625.625 0 0 1 .088 1.244l-.092.006l-1.371-.005v1.754h1.123c.314 0 .574.232.618.534l.007.092a.625.625 0 0 1-.533.618l-.092.007l-1.123-.001v1.115a.625.625 0 0 1-.532.619l-.092.006a.625.625 0 0 1-.619-.532l-.006-.093V9.616A.625.625 0 0 1 15.532 9z"
    />
  </svg>
);
export const IcPoll = ({ className }: IcProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M7 11h7v2H7zm0-4h10.97v2H7zm0 8h13v2H7zM4 4h2v16H4z"
    />
  </svg>
);

export const IcVideo = ({ className }: IcProps) => (
  <Video className={className} />
);

export const IcExplore = ({ className }: IcProps) => (
  <Telescope className={className} />
);

export const IcEth = ({ className }: IcProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    className={className}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M12 3.428v6.335l5.357 2.396zm0 0l-5.357 8.73L12 9.764zm0 12.836v4.307l5.357-7.414zm0 4.307v-4.307l-5.357-3.107z"
    />
    <path
      fill="currentColor"
      d="m12 15.266l5.357-3.107L12 9.763zm-5.357-3.107L12 15.266V9.763z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m12 15.266l-5.357-3.107L12 3.428l5.357 8.73zm-5-3.36l4.916-8.01V9.72zm-.073.218l4.989-2.216v5.109zm5.16-2.216v5.109l4.984-2.893zm0-.188l4.916 2.186l-4.916-8.01z"
      clipRule="evenodd"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m12 16.196l-5.357-3.043L12 20.57l5.357-7.418zm-4.757-2.508l4.672 2.658v3.814zm4.843 2.658v3.814l4.671-6.472z"
      clipRule="evenodd"
    />
  </svg>
);

export const IcGithub = ({ className }: IcProps) => (
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
    className={cn("lucide lucide-github", className)}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const IcNotion = ({ className }: IcProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 256 256"
    className={className}
  >
    <g fill="none">
      <g clipPath="url(#skillIconsNotionLight0)">
        <path
          fill="#f4f2ed"
          d="M196 0H60C26.863 0 0 26.863 0 60v136c0 33.137 26.863 60 60 60h136c33.137 0 60-26.863 60-60V60c0-33.137-26.863-60-60-60"
        />
        <g clipPath="url(#skillIconsNotionLight1)">
          <path
            fill="#fff"
            d="m50.53 47.548l96.832-7.152c11.895-1.02 14.951-.333 22.43 5.105l30.91 21.775c5.098 3.745 6.796 4.765 6.796 8.843v119.425c0 7.485-2.718 11.912-12.233 12.588l-112.448 6.811c-7.14.337-10.54-.683-14.28-5.448l-22.762-29.6C41.692 174.448 40 170.37 40 165.603V59.448c0-6.12 2.718-11.223 10.53-11.9"
          />
          <path
            fill="#000"
            fillRule="evenodd"
            d="M147.362 40.398L50.53 47.55C42.718 48.225 40 53.33 40 59.448v106.155c0 4.765 1.692 8.843 5.775 14.292l22.762 29.598c3.74 4.765 7.14 5.787 14.28 5.448l112.45-6.808c9.508-.677 12.232-5.104 12.232-12.587V76.12c0-3.867-1.527-4.982-6.025-8.282L169.792 45.5c-7.478-5.438-10.535-6.125-22.43-5.105zM85.36 74.165c-9.182.618-11.265.758-16.48-3.482L55.622 60.137c-1.347-1.364-.67-3.067 2.725-3.407l93.088-6.802c7.817-.682 11.888 2.042 14.945 4.422l15.965 11.568c.682.344 2.38 2.38.338 2.38L86.55 74.085zm-10.705 120.36V93.142c0-4.427 1.36-6.47 5.43-6.812L190.5 79.865c3.745-.337 5.437 2.043 5.437 6.463v100.707c0 4.428-.682 8.173-6.795 8.511l-105.66 6.125c-6.112.337-8.825-1.698-8.825-7.146zm104.3-95.947c.678 3.063 0 6.125-3.062 6.475l-5.093 1.01v74.853c-4.422 2.38-8.493 3.739-11.894 3.739c-5.438 0-6.796-1.703-10.868-6.802l-33.302-52.395v50.692l10.535 2.386s0 6.125-8.5 6.125l-23.433 1.359c-.682-1.365 0-4.765 2.375-5.442l6.12-1.698v-67.025l-8.493-.687c-.683-3.063 1.015-7.485 5.775-7.828l25.142-1.692l34.65 53.072v-46.953l-8.832-1.015c-.682-3.75 2.035-6.475 5.43-6.807z"
            clipRule="evenodd"
          />
        </g>
      </g>
      <defs>
        <clipPath id="skillIconsNotionLight0">
          <path fill="#fff" d="M0 0h256v256H0z" />
        </clipPath>
        <clipPath id="skillIconsNotionLight1">
          <path fill="#fff" d="M40 40h175v175H40z" />
        </clipPath>
      </defs>
    </g>
  </svg>
);

export const IcLinkedin = ({ className }: IcProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    className={className}
    height="1em"
    viewBox="0 0 256 256"
  >
    <g fill="none">
      <rect width="256" height="256" fill="#fff" rx="60" />
      <rect width="256" height="256" fill="#0a66c2" rx="60" />
      <path
        fill="#fff"
        d="M184.715 217.685h29.27a4 4 0 0 0 4-3.999l.015-61.842c0-32.323-6.965-57.168-44.738-57.168c-14.359-.534-27.9 6.868-35.207 19.228a.32.32 0 0 1-.595-.161V101.66a4 4 0 0 0-4-4h-27.777a4 4 0 0 0-4 4v112.02a4 4 0 0 0 4 4h29.268a4 4 0 0 0 4-4v-55.373c0-15.657 2.97-30.82 22.381-30.82c19.135 0 19.383 17.916 19.383 31.834v54.364a4 4 0 0 0 4 4M38 59.628c0 11.864 9.767 21.626 21.632 21.626c11.862-.001 21.623-9.769 21.623-21.631C81.253 47.761 71.491 38 59.628 38C47.762 38 38 47.763 38 59.627m6.959 158.058h29.307a4 4 0 0 0 4-4V101.66a4 4 0 0 0-4-4H44.959a4 4 0 0 0-4 4v112.025a4 4 0 0 0 4 4"
      />
    </g>
  </svg>
);
