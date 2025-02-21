import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-UK", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export function multiFormatRelativeDateString(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);

  const diffMs = now.getTime() - past.getTime();

  if (diffMs < 0) {
    return "In the future";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) {
    return "Just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }

  let years = now.getFullYear() - past.getFullYear();
  let months = now.getMonth() - past.getMonth();
  let totalMonths = years * 12 + months;

  if (now.getDate() < past.getDate()) {
    totalMonths--;
  }

  if (totalMonths < 12) {
    return totalMonths === 1 ? "1 month ago" : `${totalMonths} months ago`;
  }

  const diffYears = Math.floor(totalMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export function formatNumbers(likes: number): string {

  if (likes < 1000) {
    return likes.toString();
  }

  if (likes < 1_000_000) {
    const formatted = (likes / 1_000).toFixed(1);
    return removeTrailingDecimal(formatted) + "K";
  }

  if (likes < 1_000_000_000) {
    const formatted = (likes / 1_000_000).toFixed(1);
    return removeTrailingDecimal(formatted) + "M";
  }

  const formatted = (likes / 1_000_000_000).toFixed(1);
  return removeTrailingDecimal(formatted) + "B";
}

function removeTrailingDecimal(value: string): string {
  return value.replace(/\.0$/, "");
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);