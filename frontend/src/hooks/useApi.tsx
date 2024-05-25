"use client";
import { AuthAppType } from "@/context/app";
import { useQuery } from "@tanstack/react-query";
import { TokenReputationType } from "@/types/dew/contract";
import { useToast } from "@/components/ui/use-toast";

interface APIResponseType {
  ["/token/data"]: TokenReputationType;
  ["/ai/translate"]: string;
}

export const api = async <P extends keyof APIResponseType>({
  path,
  params,
  onError,
}: {
  path: P;
  params?: { [key: string]: string | any };
  onError: (error: { title: string; description: string }) => void;
}) => {
  try {
    const res = await fetch(
      `/api/${path}${params ? "?" + new URLSearchParams(params) : ""}`
    );
    const data = await res.json();

    return data.result as APIResponseType[P];
  } catch (error) {
    console.error("Use API", { error });
    onError({
      title: `Error ${path}`,
      description: (error as any).message || "Error API Get",
    });
  }
};

export const useApi = <P extends keyof APIResponseType>({
  path,
  params,
  enabled = true,
}: {
  enabled?: boolean;
  path: P;
  params?: { [key: string]: string };
}) => {
  const { toast } = useToast();

  const get = async () => {
    return await api({ path, params, onError: toast });
  };

  const o = useQuery({
    queryKey: [path, "api"],
    queryFn: get,
    enabled: path && (path as any) !== "" && enabled,
  });

  return {
    ...o,
    execute: async () => await get(),
  };
};
