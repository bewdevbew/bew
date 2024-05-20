import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getForkedColor = (value: number) => {
  // Clamping the value between 0 and 100
  value = Math.max(0, Math.min(100, value));

  // Calculate the red and green components
  const red = Math.round((value / 100) * 255);
  const green = Math.round(((100 - value) / 100) * 255);

  // Convert to hex and ensure two digits
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");

  // Return the color in hex format
  return `#${redHex}${greenHex}00`;
};
