"use client";
import { Calendar } from "@/components/ui/calendar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

function formatDate(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

function isValidDate(dateString: string) {
  // Regular expression to check format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the regex pattern
  if (!regex.test(dateString)) {
    return false;
  }

  // Parse the date parts to integers
  const [year, month, day] = dateString.split("-").map(Number);

  // Create a new Date object
  const date = new Date(dateString);

  // Check if the parsed date components match the original input
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return false;
  }

  return true;
}

function DateRangePicker() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleRangeChange: SelectRangeEventHandler = (
    range: DateRange | undefined
  ) => {
    setRange(range);
  };

  const updateParams = () => {
    // const params = new URLSearchParams(searchParams);
    // if (range?.from) {
    //   params.set("from", formatDate(range.from));
    // } else {
    //   params.delete("from");
    // }
    //
    // if (range?.to) {
    //   params.set("to", formatDate(range.to));
    // } else {
    //   params.delete("to");
    // }
    // replace(`${pathname}?${params.toString()}`);
    //
    // const fromParam = searchParams.get("from");
    // let from =
    //   typeof fromParam === "string" && isValidDate(fromParam)
    //     ? new Date(fromParam)
    //     : undefined;
    //
    // const toParam = searchParams.get("to");
    // let to =
    //   typeof toParam === "string" && isValidDate(toParam)
    //     ? new Date(toParam)
    //     : undefined;
    //
    // if (from && to && from > to) {
    //   from = undefined;
    //   to = undefined;
    // }
    console.log("updating search params");
    const params = new URLSearchParams();
    if (range?.from) {
      params.set("from", formatDate(range?.from));
    }
    if (range?.to) {
      params.set("to", formatDate(range?.to));
    }

    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const fromParam = searchParams.get("from");
    let from =
      typeof fromParam === "string" && isValidDate(fromParam)
        ? new Date(fromParam)
        : undefined;

    const toParam = searchParams.get("to");
    let to =
      typeof toParam === "string" && isValidDate(toParam)
        ? new Date(toParam)
        : undefined;

    setRange({ from, to });
  }, [searchParams.get("to"), searchParams.get("from")]);

  return (
    <div>
      <p>
        {range?.from?.toISOString()} {range?.to?.toISOString()}
      </p>
      <Calendar mode="range" selected={range} onSelect={handleRangeChange} />
      <Button className="mb-4" onClick={updateParams}>
        Update table
      </Button>
    </div>
  );
}

export default DateRangePicker;
