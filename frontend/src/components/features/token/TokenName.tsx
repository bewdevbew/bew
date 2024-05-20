import { TextH } from "@/components/common/text/TextH";
import { Skeleton } from "@/components/ui/skeleton";
import { useToken } from "@/hooks/useContract";
import { cn } from "@/utils/ui";
import Link from "next/link";
import React from "react";

export const TokenName = ({
  address,
  symbol,
  className,
}: {
  className?: string;
  symbol?: boolean;
  address: `0x${string}`;
}) => {
  const { data: token, isSuccess } = useToken({ address, auto: true });

  return (
    <div className={cn("flex flex-col w-fit", className)}>
      {isSuccess ? (
        <Link className="hover:text-info" href={`/token/${address}`}>
          <TextH className="text-xl">{token?.name}</TextH>
          {symbol && <p className=" text-muted-foreground">{token?.symbol}</p>}
        </Link>
      ) : (
        <>
          <Skeleton className="w-40 h-6 mb-2" />
          <Skeleton className="w-16 h-3" />
        </>
      )}
    </div>
  );
};
