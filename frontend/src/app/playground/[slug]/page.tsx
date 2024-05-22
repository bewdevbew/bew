"use client";
import { TextLabel } from "@/components/common/text/TextLabel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@/context/form";

import { Paintbrush, Pencil, SquareAsterisk } from "lucide-react";
import React from "react";

const page = () => {
  const { set, getValue } = useForm();

  const patterns = [
    "magicpattern",
    "magicpattern1",
    "magicpattern2",
    "magicsky",
  ];
  return (
    <main className="flex items-center justify-center w-screen gap-20">
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 items-center justify-center h-full">
          <Button>Original button</Button>
          <Button
            className={`${getValue("className") || ""} ${
              getValue("pattern") || ""
            }`}
          >
            Modify me !
          </Button>
        </div>
      </div>

      <Card
        className="gap-4"
        header={{ title: "Playground", icon: <Pencil /> }}
      >
        <Input
          label={{ icon: <Paintbrush />, text: "Class Name" }}
          target="className"
          placeholder="Type here to modify className"
        />

        <div className="flex flex-col gap-2">
          <TextLabel icon={<SquareAsterisk />}>Pattern</TextLabel>
          <div className="flex gap-2">
            {patterns.map((el, i) => (
              <Button
                onClick={() => set("pattern", patterns[i])}
                key={`pattern-system-${i}`}
                className={`${
                  patterns[i]
                } on-hover-parent hover:opacity-100  p-10 ${
                  getValue("pattern") === i ? "opacity-100" : "opacity-50"
                }`}
              >
                <span className="on-hover-child">Click to apply</span>
              </Button>
            ))}
          </div>
        </div>

        <Button>Update</Button>
      </Card>
    </main>
  );
};

export default page;
