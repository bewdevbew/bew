import { BaseModule } from "@/components/module";
import { DewModule, DewModuleCore, ModuleValue } from "@/types/dew/module";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


/**
 * 
 * @notice Les Modules sont 
 * 
 */

export const useModule = () => {
  const get = () => {
    if (typeof window === "undefined") return {};
    const system = JSON.parse(localStorage.getItem("system") || "{}");
    return system;
  };

  const clean = (target: "all" | "ids") => {
    if (typeof window === "undefined") return {};
    if (target === "all") {
      localStorage.removeItem("system");
    } else {
      const newSystem = { ...o.data, [target]: undefined };
      localStorage.setItem("system", JSON.stringify(newSystem));
    }
  };

  const [queryIndex, setQueryIndex] = useState(0);
  const set = <K extends keyof DewModuleCore>(
    module: K,
    value: BaseModule<K>
  ) => {
    if (typeof window === "undefined") return {};
    localStorage.setItem(
      "system",
      JSON.stringify({
        ...o.data,
        [module]: value?.getModule?.() || value,
      } as ModuleValue<K>)
    );
    setQueryIndex(queryIndex + 1);
  };

  const o = useQuery({
    queryKey: ["module", queryIndex],
    queryFn: get,
    enabled: true,
  });
  return {
    ...o,
    data: o.data,
    set: set as typeof set,
    clean: clean as typeof clean,
  };
};
