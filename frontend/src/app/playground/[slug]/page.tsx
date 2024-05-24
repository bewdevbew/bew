"use client";
import { TextLabel } from "@/components/common/text/TextLabel";
import { MODULE_UI_DEFAULT } from "@/components/module/ui";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@/context/form";
import { useModule } from "@/hooks/useModule";
import { DewModuleCore } from "@/types/dew/module";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Paintbrush, Pencil, SquareAsterisk } from "lucide-react";
import React, { useEffect } from "react";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Callout } from "@tremor/react";
import { APP } from "@/constants/app";
import Link from "next/link";

const page = () => {
  const { set, getValue } = useForm();

  const patterns = [
    "magicpattern",
    "magicpattern1",
    "magicpattern2",
    "magicsky",
  ];

  const { set: setModule, data: module } = useModule();

  useEffect(() => {
    (async () => {
      const data = await fetch("/api/ai/button");
      console.log({ test: await data.json(), check: data });
    })();
  }, []);

  return (
    <main className="flex p-20 justify-center w-screen gap-20">
      <div className="flex flex-col gap-3">
        <div className="bg-primary/10  p-2 shadow  flex gap-2 rounded-lg shadow w-fit">
          <Button
            variant={getValue("tabs-view") !== 1 ? "default" : "outline"}
            onClick={() => set("tabs-view", 0)}
            module="ADMIN"
          >
            Button
          </Button>
          <Button
            variant={getValue("tabs-view") === 1 ? "default" : "outline"}
            onClick={() => set("tabs-view", 1)}
            module="ADMIN"
          >
            Card
          </Button>
        </div>
        <Callout title="How it's work ?" color="indigo">
          {APP.name} use tailwind for his design system, you can modify the
          className
          <br /> of each component to change the style of the component.
          <br /> You can do it for yourself or for the whole community by
          posting your design on Lens.
          <br />
          <a
            className="underline font-bold"
            onClick={() => window.open("https://tailwindcss.com/", "_blank")}
          >
            Learn more about tailwind
          </a>
        </Callout>
        <div className="flex gap-10">
          <Card className=" gap-10 items-center justify-center h-full magicpattern">
            {
              [
                <>
                  <Button
                    onClick={() => {
                      const data = MODULE_UI_DEFAULT.className(``);

                      setModule("button", data);
                    }}
                    module="ADMIN"
                  >
                    Refresh style
                  </Button>
                  <Button>Current button</Button>
                  <Button
                    className={`${getValue("className") || ""} ${
                      getValue("pattern") || ""
                    }`}
                    module="DEV"
                  >
                    Modify me !
                  </Button>
                </>,
                <>
                  <Card
                    onClick={() => {
                      const data = MODULE_UI_DEFAULT.className(``);
                      setModule("card", data);
                    }}
                    module="ADMIN"
                  >
                    Refresh style
                  </Card>
                  <Card>Current Card</Card>
                  <Card
                    className={`${getValue("className") || ""} ${
                      getValue("pattern") || ""
                    }`}
                    module="DEV"
                  >
                    Modify me !
                  </Card>
                </>,
              ]?.[getValue("tabs-view") || 0]
            }
          </Card>
          <SyntaxHighlighter
            className="w-[700px]"
            language="javascript"
            style={dark}
          >
            {`<${
              ["Button", "Card"]?.[getValue("tabs-view") || 0]
            } className={"${getValue("className") || ""}"} >
    {children}
<${["Button", "Card"]?.[getValue("tabs-view") || 0]}/>`}
          </SyntaxHighlighter>
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
                module="ADMIN"
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

        <Button
          onClick={() => {
            const data = MODULE_UI_DEFAULT.className(
              `${getValue("className") || ""} ${getValue("pattern") || ""}`
            );

            setModule(
              ["button", "card"]?.[getValue("tabs-view") || 0] as any,
              data
            );
          }}
        >
          Click to save
        </Button>
      </Card>
    </main>
  );
};

export default page;
