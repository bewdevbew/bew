import { DewModuleCore } from "@/types/dew/module";
import { DewUICore } from "@/types/dew/ui";

const __debug: Record<string, number> = {};

export type ModuleWithType<T extends keyof DewModuleCore> = {
  type: T;
} & DewModuleCore[T]["default"];

// Type pour les descripteurs de propriété
interface PropertyDescriptors<T> extends PropertyDescriptorMap, ThisType<T> {}

// Classe Module

const allowance = "undefined";
const target = 0;
const _for = undefined;
const _log = ({
  d,
  s,
  i = 0,
  t = target,
  f = _for,
  a = allowance,
}: {
  f?: string;
  d: any;
  s: string;
  i?: number;
  t?: number;
  a?: "more" | "less" | "equal" | "undefined";
}) => {
  // récupérer le dernier mot de la string
  let string: string = s.split(" ") as any;
  string = string[string.length - 1];
  if (__debug[string] === undefined) {
    __debug[string] = 0;
  }

  if (!!f && f != string) {
    return;
  } else if (
    { less: i <= t, more: i >= t, equal: i == t, undefined: true }[a] ||
    (f == string &&
      { less: i <= t, more: i >= t, equal: i == t, undefined: true }[a])
  ) {
    __debug[string] += 1;
    console.log({
      string: s,
      data: d,
      index: i,
      target: t,
      __debug,
      test: string,
    });
  }
};

interface ModuleObject {
  get: <K extends keyof this>(key: K) => this[K];
  getValue: <K extends keyof this>(key: K) => this[K];
  set: <K extends keyof this>(key: K, value: this[K]) => void;
}
// Interface ModuleScope
interface ModuleScope {
  module: (keyof DewModuleCore)[];
  object: (keyof DewModuleCore)[];
  boolean: (keyof DewModuleCore)[];
  function: (keyof DewModuleCore)[];
  array: (keyof DewModuleCore)[];
  undefined: (keyof DewModuleCore)[];
  text: (keyof DewModuleCore)[];
}
