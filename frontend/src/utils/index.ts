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

// export class BaseModule<T extends keyof DewModuleCore> {
//   _type = 0;
//   constructor(data: ModuleWithType<T>) {}
// }

// export class BaseModule<T extends keyof DewModuleCore> {
//   // _type: string;
//   // _scope: ModuleScope;
//   // private module: any;
//   // private data: any;

//   constructor(data: ModuleWithType<T>) {
//     _log({
//       d: data,
//       s: `Pour commencer ${data?.type}`,
//       i: 0,
//     });

//     try {
//       // this.module = data;
//       // Utiliser des assertions de type pour informer TypeScript du type attendu
//       // this.data = ((data as any)[data.type] ||
//       //   (data as any).value ||
//       //   data) as DewModuleCore[T]["default"];
//       // this._type = data.type;
//       // const recast = () =>
//       //   ({
//       //     className: () => {
//       //       this.data = typeof this.data === "string" ? this.data : "";
//       //     },
//       //     size: () => this.data as number,
//       //     variants: () => this.data as string,
//       //     modules: () => this.data as string,
//       //     ui: () => this.data as string,
//       //     style: () => this.data as string,
//       //     ux: () => this.data as string,
//       //     api: () => this.data as string,
//       //     button: () => this.data as string,
//       //   }[data.type as keyof DewModuleCore]);
//       // this._scope = this.initializeScope(this.data);
//       // recast();
//       // _log({
//       //   d: this.data,
//       //   s: `Après scope ${data?.type}`,
//       //   i: 1,
//       // });
//       // _log({
//       //   d: this.data,
//       //   s: `Après reorganisation ${data?.type}`,
//       //   i: 2,
//       // });
//       // _log({
//       //   d: this.data,
//       //   s: `Après value check ${data?.type}`,
//       //   i: 3,
//       // });
//       // _log({
//       //   d: this.data,
//       //   s: `Pour finir ${data?.type}`,
//       //   i: 4,
//       // });
//       // this.data = {};
//     } catch (error) {
//       throw new Error(`Error on ${"className"}`);
//     }
//   }

//   protected initializeScope(data: any): ModuleScope {
//     const scope: ModuleScope = {
//       module: [],
//       object: [],
//       boolean: [],
//       function: [],
//       array: [],
//       undefined: [],
//       text: [],
//     };
//     // try {
//     //   const _data = data?.value || data;
//     //   if (
//     //     typeof _data === "object" &&
//     //     _data !== null &&
//     //     !Array.isArray(_data)
//     //   ) {
//     //     for (const key in _data) {
//     //       if (
//     //         typeof _data[key] === "object" &&
//     //         _data[key] !== null &&
//     //         !Array.isArray(_data[key])
//     //       ) {
//     //         if (_data[key]?.type) {
//     //           scope.module.push(key as keyof DewModuleCore);
//     //         } else {
//     //           scope.object.push(key as keyof DewModuleCore);
//     //         }
//     //       } else if (typeof _data[key] === "undefined") {
//     //         scope.undefined.push(key as keyof DewModuleCore);
//     //       } else if (
//     //         typeof _data[key] === "number" ||
//     //         typeof _data[key] === "string" ||
//     //         typeof _data[key] === "symbol"
//     //       ) {
//     //         scope.text.push(key as keyof DewModuleCore);
//     //       } else {
//     //         scope[typeof _data[key] as keyof ModuleScope].push(
//     //           key as keyof DewModuleCore
//     //         );
//     //       }
//     //     }
//     //   }
//     // } catch (error) {
//     //   console.error("Error initialize scope :", error);
//     //   throw new Error(`Error on ${this.module.type}`);
//     // }
//     return scope;
//   }

//   // get<K extends keyof this>(key: K): this[K] {
//   //   return this.data[key] as this[K];
//   // }

//   // getValue<K extends keyof this>(key: K): this[K] {
//   //   return this.data[key] as this[K];
//   // }

//   // set<K extends keyof this>(key: K, value: this[K]): void {
//   //   this.data[key] = value as any;
//   // }
// }

// export class BaseModule {
//   type: string;
//   [key: string]: any;

//   constructor(type: string, data: any) {
//     this.type = type;
//     Object.assign(this, data);
//   }
// }

// Exemple de test type
