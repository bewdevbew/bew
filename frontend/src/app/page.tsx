"use client";

import { TextWriterEffectSmooth } from "@/components/common/text/TextWritterEffectSmooth";

import { Card } from "@/components/ui/card";
import { CardHoverable } from "@/components/ui/card-hoverable";

import { GoogleGeminiEffect } from "@/sections/ui/GoogleGemini";
import { Mockup } from "@/sections/ui/Mockup";
import { Radar } from "@/sections/ui/Radar";
import { SectionHighlight } from "@/sections/ui/SectionHiglight";
import { HomeCardIntegration } from "@/sections/views/Home/HomeCardIntegration";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lock, Mail, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <main className="w-screen bg-dot-thick-neutral-300 dark:bg-dot-thick-neutral-800 relative">
      <div
        className="h-[400vh] z-10  w-full dark:border border rounded-md relative pt-40 overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>

      <div className="w-full z-10 relative py-20 gap-10 flex flex-col items-center justify-center mb-20">
        <TextWriterEffectSmooth className="scale-[.50]" highlight="tools">
          Made with tools you ❤️
        </TextWriterEffectSmooth>

        <div className="flex flex-col gap-5 ">
          <CardHoverable
            className="w-full items-start bg-gradient-to-tr from-primary  to-info text-primary-foreground"
            title="ZeroDay Protocol"
            description="Internet will never be the same again. Where trust meets innovation"
            images={[{ img: "/logo.webp" }]}
          ></CardHoverable>
          <div className="flex   gap-10">
            <div className="flex flex-col gap-4">
              <CardHoverable
                className="magicpattern"
                title="Lens Protocole"
                description="Enjoy the power of Lens Protocole. Publish your free or payable
            content"
                images={[{ img: "/lens-logo.jpeg" }]}
              >
                <img
                  src="examples/publications.png"
                  className="w-[500px] rounded-lg"
                />
              </CardHoverable>

              <CardHoverable
                className="magicpattern1 text-white"
                title="Kleros"
                description="Trade, hire and pay secured by trustless dispute resolution with Kleros court protection"
                images={[{ img: "/kleros.png" }]}
              ></CardHoverable>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <CardHoverable
                title="ChatGPT"
                className="magicpattern1 text-white"
                description="Generate a workflow development and building roadmap with ChatGPT"
                images={[{ img: "/gpt.webp", className: "border-transparent" }]}
              >
                <img
                  src="examples/graph-workflow.png"
                  className="w-[500px] rounded-lg"
                />
              </CardHoverable>

              <CardHoverable
                className="magicpattern"
                title="Github + Notion"
                description="Generate To do list based with your github repositories"
                images={[
                  { img: "/github.webp" },
                  { img: "/notion.png", className: "border-primary" },
                ]}
              >
                <Mockup className="mt-10 mr-10 " />
              </CardHoverable>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[80vw] xs:w-[90vw] items-center mx-auto">
        <SectionHighlight
          btn={{
            children: "Mint handle",
            onClick: () => window.open("https://www.lens.xyz/mint", "_blank"),
          }}
          highlight={"On-chain social"}
          description={
            <>
              With Lens you can mint a secret content
              <br />
              and share it with your consumers
            </>
          }
          label={"Why Lens protocol ?"}
          color="#F778BA"
          icon={<Mail size={80} />}
        >
          <div className="flex gap-10 h-fit w-fit">
            <HomeCardIntegration />

            <Card
              height=""
              padding="p-0"
              className="w-[300px] magicpattern flex flex-col relative"
            >
              {/* <ShaderGradient containerClassName="bg-info" color="magenta" /> */}
              <div className="h-full relative px-3 py-10 text-2xl  font-bold ">
                Bring your
                <br />
                experience onchain
              </div>
              <motion.img
                initial={{ right: "-50%" }}
                whileHover={{ right: 0 }}
                src="/examples/profile.png"
                transition={{
                  type: "spring",
                  duration: 1,
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-[600px] absolute bottom-0  transition-all "
              />
            </Card>
          </div>
        </SectionHighlight>
        <SectionHighlight
          highlight={"AI Assistant"}
          btn={{ children: "Try Aly", href: "/create/project" }}
          description={
            <>
              <Sparkles />
              Aly is a powerful AI assistant that can help you to
              <br />
              generate a workflow development and building roadmap
            </>
          }
          label={"Who is Aly ?"}
          color="#7042C4"
          icon={<Image alt="AI logo" src={"/aly.png"} width={80} height={80} />}
        >
          <div className="flex  bg-dot-thick-neutral-500/10  flex-col bg-primary rounded-lg">
            <Radar />
            <div className=" p-10 gap-10 w-fit flex rounded-lg shadow text-primary-foreground my-10 magicpattern1">
              <div className="w-fit">
                <h6 className="text-3xl font-bold ">How it Works ?</h6>
                <p className="font-light opacity-60 w-[500px] my-5">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi
                  quisquam quod provident quis dolore ab laudantium omnis, quo
                  accusantium. Inventore ipsa quidem, expedita cum ab id quod
                  tenetur? Iste, quis?
                </p>

                <div className="flex gap-5 w-fit">
                  <div className="w-[400px] py-10 px-5 border border-secondary/30 rounded-lg  bg-gradient-to-br from-info/80 to-primary relative overflow-visible">
                    <h6 className="text-2xl font-bold mb-10">For Developers</h6>
                    <p className="opacity-80 ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Cupiditate consequatur fugiat vero ex facilis veritatis
                      impedit voluptates in laboriosam magnam, eligendi dolor
                      sapiente accusantium! Consequuntur vero iure ex corporis
                      aperiam!
                    </p>
                    <div className="absolute w-2 rounded-xl bg-secondary top-10 -translate-x-1/2  left-0 h-10" />
                  </div>
                  <div className=" w-[400px] py-10 px-5  rounded-lg border border-secondary/30  bg-gradient-to-br from-[#6E6EF6] to-primary relative overflow-visible">
                    <h6 className="text-2xl font-bold mb-10">For Enterprise</h6>
                    <p className="opacity-80 ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Cupiditate consequatur fugiat vero ex facilis veritatis
                      impedit voluptates in laboriosam magnam, eligendi dolor
                      sapiente accusantium! Consequuntur vero iure ex corporis
                      aperiam!
                    </p>
                    <div className="absolute w-2 rounded-xl bg-secondary top-10 -translate-x-1/2  left-0 h-10" />
                  </div>
                </div>
              </div>

              <div className="w-[400px] py-10 px-5 border border-secondary/30 rounded-lg shadow-xl   bg-gradient-to-br from-error to-primary relative overflow-visible">
                <h6 className="text-2xl font-bold mb-10">For Everyone</h6>
                <p className="opacity-80 ">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Cupiditate consequatur fugiat vero ex facilis veritatis
                  impedit voluptates in laboriosam magnam, eligendi dolor
                  sapiente accusantium! Consequuntur vero iure ex corporis
                  aperiam! Lorem ipsum dolor sit amet consectetur, adipisicing
                  elit. Repellat autem adipisci suscipit expedita doloremque
                  quasi debitis praesentium perspiciatis dolor ab. Iste
                  similique est sequi dolorem repellendus! Veritatis est
                  expedita quisquam!
                </p>
                <div className="absolute w-2 rounded-xl bg-secondary top-10 -translate-x-1/2  left-0 h-10" />
              </div>
            </div>
          </div>
        </SectionHighlight>
      </div>
    </main>
  );
}
