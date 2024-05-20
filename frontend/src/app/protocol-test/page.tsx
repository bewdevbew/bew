"use client";
import { TextAddressEvm } from "@/components/common/text/TextAddressEvm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { useProtocol } from "@/hooks/useContract";

import { ethers } from "ethers";
import { useAccount } from "wagmi";

const page = () => {
  const { address } = useAccount();
  const { data } = useProtocol({});
  console.log({ data, address });

  return (
    <main className="w-full flex flex-col items-center justify-center">
      <div className="w-2/3">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold">Protocol Market</h1>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-lg opacity-70">Total Assets</span>
              <span className="text-lg font-bold">{data?.length}</span>
            </div>
          </div>
        </div>

        <div className="w-full border shadow rounded-lg mt-10 pb-5">
          <div className="flex p-5 items-center border-b">
            <h6 className="font-semibold">Assets</h6>
            <Input
              className="ml-auto w-[200px]"
              placeholder="Search token ..."
            />
          </div>

          <Table
            caption={"A list of all tokens reputation"}
            heads={["Asset", "Admin", "Total supplied", "Max Cap", ""]}
            body={data?.tokens?.map((el) => ({
              customClassName:
                address == el.info.admin
                  ? "border bg-info/30 border-info"
                  : undefined,
              children: [
                <div className="flex flex-col">
                  <span className="font-bold text-xl">{el?.info?.name}</span>
                  <span className="font-light">{el?.info?.symbol}</span>
                </div>,
                <TextAddressEvm>{el.info.admin}</TextAddressEvm>,
                ethers.formatEther(el.info.totalSupply),
                ethers.formatEther(el.info.rules.maxSupply),
                <Button>View more</Button>,
              ],
            }))}
          />
        </div>
      </div>
    </main>
  );
};

export default page;
