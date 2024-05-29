import { Logo } from "@/components/assets/Logo";
import { Modal } from "@/components/ui/alert-dialog";
import { AppProvider, useAuth } from "@/context/app";
import { TokenBalances, TokenReputationType } from "@/types/dew/contract";
import React from "react";
import { TokenAvatar } from "./TokenAvatar";
import { ProfileAvatar } from "../profile/ProfileAvatar";
import { formatNumber } from "@/utils/ux";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TextLabel } from "@/components/common/text/TextLabel";
import { ArrowRightLeft } from "lucide-react";
import { Select } from "@/components/ui/select";

import { useForm } from "@/context/form";

import { Input } from "@/components/ui/input";
import { CategoryBar } from "@tremor/react";
import { useContract } from "@/hooks/useContract";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/use-toast";
import { TokenReputation } from "../../../../contract/typechain";

export const TokenBtnFundReputation = ({
  token,
  className,
  balance,
}: {
  balance: TokenBalances<"current" | "guest">;
  token: TokenReputationType;
  className?: string;
}) => {
  const { data: session } = useAuth();

  const { set, getValue } = useForm();

  const { toast } = useToast();

  const target: "personal" | "temporary" =
    balance.address[balance.type] === session.token.admin
      ? "personal"
      : "temporary";

  const target2: "personal" | "temporary" =
    target === "personal" ? "temporary" : "personal";

  const infoTx: Record<
    `0x${string}`,
    {
      label: string;
      value: {
        label: string;
        fns: Record<`0x${string}`, keyof TokenReputation>;
        balance: `${number}`;
      }[];
    }
  > = {
    [session.token.admin]: {
      label: "Wallet",
      value: [
        {
          label: "My Wallet",
          balance: balance.wallet[target],
          fns: {
            [session.token.admin]: "transfer",
            [token.admin]: "transfer",
            [session.token.address]: "withdrawReputation",
          },
        },
      ],
    },

    [session.token.address]: {
      label: `Network ${session.token.name}`,
      value: [
        {
          label: `Reputation ${session.token.name}`,
          balance: balance.reputation[target],
          fns: {
            [session.token.admin]: "depositReputationFromWallet",
            [token.address]: "depositReputation",
            [session.token.address]: "depositReputation",
          },
        },
        {
          label: `Governance`,
          balance: balance.governance[target],
          fns: {
            [session.token.admin]: "depositOnGovernance",
          },
        },
        {
          label: `Sponsor ${session.token.name}`,
          balance: balance.sponsor[balance.type][target],
          fns: {
            [session.token.admin]: "addReserveSponsor",
          },
        },
        {
          label: `Sponsor ${token.name}`,
          balance: balance.sponsor[balance.type][target2],
          fns: {
            [session.token.admin]: "addReserveSponsor",
          },
        },
      ],
    },

    [token.address]: {
      label: `Network ${token.name}`,

      value: [
        {
          label: `Reputation ${session.token.name}`,
          balance: balance.reputation[target2],
          fns: {
            [session.token.admin]: "depositReputationFromWallet",
            [token.address]: "depositReputation",
            [session.token.address]: "depositReputation",
          },
        },
        {
          label: `Governance`,
          balance: balance.governance[target2],
          fns: {
            [session.token.admin]: "depositOnGovernance",
          },
        },
        {
          label: `Sponsor ${session.token.name}`,
          balance:
            balance.sponsor[balance.type === "current" ? "guest" : "current"][
              target
            ],
          fns: {
            [session.token.admin]: "addReserveSponsor",
          },
        },
        {
          label: `Sponsor ${token.name}`,
          balance:
            balance.sponsor[balance.type === "current" ? "guest" : "current"][
              target2
            ],
          fns: {
            [session.token.admin]: "addReserveSponsor",
          },
        },
      ],
    },
  };

  const data: {
    label: string;
    address: `0x${string}`;
    items: {
      label: string;
      balance: `${number}`;
    }[];
  }[] = [
    {
      label: infoTx[session.token.admin].label,
      items: infoTx[session.token.admin].value,
      address: session.token.admin,
    },
    {
      label: infoTx[session.token.address].label,
      items: infoTx[session.token.address].value,
      address: session.token.address,
    },
    {
      label: infoTx[token.address].label,
      address: session.token.address,
      items: infoTx[token.address].value,
    },
  ];

  let tokenAddress = data[getValue("from")?.split("-")?.[0] || 0].address;
  if (tokenAddress === session.token.admin) {
    tokenAddress = data[getValue("to")?.split("-")?.[0] || 0].address;
    if (tokenAddress === session.token.admin) {
      tokenAddress = session.token.address;
    }
  }

  const {
    post: postToken,

    contract: tokenContract,
  } = useContract("token");

  const form = {
    from: getValue("from")
      ? data[getValue("from").split("-")?.[0]].items[
          getValue("from").split("-")?.[1]
        ]
      : data[0].items[0],
    amount: getValue("transfer-amount") || "0",
    to: getValue("to")
      ? data[getValue("to").split("-")?.[0]].items[
          getValue("to").split("-")?.[1]
        ]
      : data[0].items[0],
  };

  const transfer = async () => {
    const from = data[getValue("from")?.split("-")?.[0] || 0];

    const to = data[getValue("to")?.split("-")?.[0] || 0];
    let fromAddress = from.address;

    const toAddress = to.address;

    const infoTo = infoTx[toAddress];

    const indexesTo: [number, number] = getValue("to").split("-");
    const fn = infoTo.value[Number(indexesTo[1])].fns[fromAddress];
    if (fromAddress === session.token.admin) {
      if (fromAddress === toAddress) {
        throw new Error("Can't transfer to yourself");
      }
      fromAddress = toAddress;
    }

    if (!Number(form.amount))
      return toast({
        title: "Error Transaction",
        description: "Amount must be greater than 0",
        variant: "destructive",
      });
    const amount = ethers.parseEther(form.amount);

    const token =
      balance.type === "current"
        ? balance.address.tokenCurrent
        : balance.address.tokenGuest;

    if (!fn) {
      toast({
        title: "Error Transaction",
        description: "We cannot found function for this transaction",
        variant: "destructive",
      });
    }
    const args = (
      {
        depositOnGovernance: [token, amount],
        addReserveSponsor: [token, amount],
        depositReputationFromWallet: [amount],
        withdrawReputation: [amount],
      } as any
    )[fn as string];
    if (!args) {
      toast({
        title: "Error Transaction",
        description: "We cannot found arguments for this transaction",
        variant: "destructive",
      });
    }

    try {
      const allowance = await tokenContract.allowance(
        session.token.admin,
        session.token.address
      );

      if (allowance < amount) {
        await postToken("approve", [token, amount]);
      }
      await postToken(fn as any, args);
    } catch (error) {
      console.log("Error transaction :", error);
    }
  };

  return (
    <Modal variant={"default"} className={className} trigger={"Transfer"}>
      <div className="flex justify-between items-center w-full">
        <Logo size={60} />
        <div className="flex gap-2 p-2 bg-muted w-fit shadow rounded-lg">
          <Button
            onClick={() => set("tabs-fund", 0)}
            variant={getValue("tabs-fund") !== 1 ? "default" : "outline"}
          >
            Transfer
          </Button>

          <Button
            onClick={() => set("tabs-fund", 1)}
            variant={getValue("tabs-fund") === 1 ? "default" : "outline"}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-10 my-10 w-[800px] relative">
        <div className="flex p-5 flex-col gap-3 w-full border rounded-lg shadow">
          <div className="flex justify-between">
            <TextLabel icon={<ArrowRightLeft className="text-destructive" />}>
              Transfer
            </TextLabel>
            <p className="items-center flex gap-2 text-muted-foreground">
              Available balance
              <span className="font-black text-info">
                {formatNumber(form.from.balance)}
              </span>
            </p>
          </div>

          <div className=" w-full border p-3 flex justify-between text-xl">
            <div className="flex gap-2 items-center">
              {form?.from.label === "My Wallet" ? (
                <ProfileAvatar
                  size={50}
                  profile={session.lens}
                  address={session.token.admin}
                />
              ) : (
                <TokenAvatar size={50} seed={token.address} />
              )}

              <Select
                target="from"
                title="Select a balance"
                className="border-0 font-black text-2xl w-full"
                groups={data
                  .map((el, i) => ({
                    label: el.label,
                    items: el.items
                      .map((o, j) => ({
                        value: `${i}-${j}`,
                        balance: o.balance,
                        label: o.label,
                      }))
                      .filter((o) => Number(o.balance) > 0),
                  }))
                  .filter((el) => el.items.length)}
              />
            </div>

            <Input
              showInfo={false}
              type="number"
              classNameInput="border-0 font-black text-2xl text-end w-fit"
              placeholder={"Amount"}
              max={form?.from?.balance || "0"}
              target="transfer-amount"
            />
          </div>
          <CategoryBar
            className="w-full mt-5"
            showLabels={false}
            values={[
              Number(form.from.balance) - (Number(form.amount) || 0),

              Number(token.supply) -
                Number(form.from.balance) -
                (Number(form.amount) || 0),
            ]}
            colors={["emerald", "red"]}
            markerValue={Number(form.to.balance)}
          />
          <div className="flex justify-between items-center">
            <Button
              onClick={() => set("transfer-amount", `${form.from.balance}`)}
              variant={"secondary"}
            >
              Max
            </Button>

            <p className="font-bold text-muted-foreground">
              From {data[getValue("from")?.split("-")?.[0] || 0].label}
            </p>
          </div>
        </div>
        <div
          onClick={() => set("tabs-fund", getValue("tabs-fund") === 1 ? 0 : 1)}
          className="rounded-full border-y absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-background "
        >
          <span
            className={`border transition  flex items-center justify-center w-[80px] h-[80px] min-w-[80px] min-h-[80px] rounded-full text-white ${
              getValue("tabs-fund") === 1
                ? "rotate-180 bg-green-600"
                : "rotate-0 bg-destructive"
            }`}
          >
            <ArrowRightLeft className="rotate-90 " />
          </span>
        </div>
        <div className="flex p-5 flex-col gap-3 w-full border rounded-lg shadow">
          <div className="flex justify-between">
            <TextLabel icon={<ArrowRightLeft className="text-success" />}>
              Recipient
            </TextLabel>
            <p className="items-center flex gap-2 text-muted-foreground">
              Current balance
              <span className="font-black text-info">
                {formatNumber(form.to.balance)}
              </span>
            </p>
          </div>

          <div className=" w-full border p-3 flex flex-col justify-between text-xl">
            <div className="flex gap-2 items-center">
              {form?.to.label === "My Wallet" ? (
                <ProfileAvatar
                  size={50}
                  profile={session.lens}
                  address={session.token.admin}
                />
              ) : (
                <TokenAvatar size={50} seed={token.address} />
              )}

              <Select
                target="to"
                title="Select a recipient"
                className="border-0 font-black text-2xl w-full"
                groups={data.map((el, i) => ({
                  label: el.label,
                  items: el.items.map((o, j) => ({
                    value: `${i}-${j}`,
                    label: o.label,
                  })),
                }))}
              />
            </div>
          </div>
          <CategoryBar
            className="w-full mt-5"
            showLabels={false}
            values={[
              Number(form.to.balance),
              Number(form.amount),
              Number(token.supply) -
                Number(form.to.balance) -
                Number(form.amount),
            ]}
            colors={["emerald", "blue", "red"]}
            markerValue={Number(form.to.balance)}
          />
        </div>
      </div>

      <p className="my-10">
        Funds will be transferred from your wallet to the network.
        <br />
        Once your token is on Network, please be sure to know the rules of the
        Network. <br />
        In some Network, Admin could use your token
      </p>
      <Button onClick={transfer} variant="default">
        Transfer Funds
      </Button>
      <div className="text-xs-text-muted-foreground text-center font-light">
        By using ZeroDay Protocol, you agree to the{" "}
        <Link href={"#"} className="font-black text-black underline">
          Terms of use
        </Link>
        <br />
        and{" "}
        <Link className="font-black text-black underline" href={"#"}>
          Privacy Policy
        </Link>
      </div>
    </Modal>
  );
};
