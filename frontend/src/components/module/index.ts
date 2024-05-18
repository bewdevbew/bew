import { DewModuleCore, ModuleTyped, ModuleValue } from "@/types/dew/module";
import { createModuleType } from "./ui";

interface ModuleScope {
  module: (keyof DewModuleCore)[];
  object: (keyof DewModuleCore)[];
  boolean: (keyof DewModuleCore)[];
  function: (keyof DewModuleCore)[];
  array: (keyof DewModuleCore)[];
  undefined: (keyof DewModuleCore)[];
  text: (keyof DewModuleCore)[];
}
export class BaseModule<T extends keyof DewModuleCore> {
  private module: ModuleTyped<T>;

  constructor(module: ModuleTyped<T>) {
    this.module = module;
  }

  getModule(): ModuleTyped<T> {
    return this.module;
  }

  _getScope(): ModuleScope {
    return this.initializeScope(this.getModule());
  }

  protected initializeScope(data: any): ModuleScope {
    const scope: ModuleScope = {
      module: [],
      object: [],
      boolean: [],
      function: [],
      array: [],
      undefined: [],
      text: [],
    };

    const cast = {
      string: () => {
        scope.text.push(data.type);
      },
      bigint: () => {
        scope.text.push(data.type);
      },
      number: () => {
        scope.text.push(data.type);
      },
      symbol: () => {
        scope.text.push(data.type);
      },
      object: () => {
        for (const key in data.value) {
          if (
            typeof data.value[key] === "object" &&
            data.value[key] !== null &&
            !Array.isArray(data.value[key])
          ) {
            if (data.value[key]?.type) {
              scope.module.push(key as keyof DewModuleCore);
            } else {
              scope.object.push(key as keyof DewModuleCore);
            }
          } else if (typeof data.value[key] === "undefined") {
            scope.undefined.push(key as keyof DewModuleCore);
          } else if (
            typeof data.value[key] === "number" ||
            typeof data.value[key] === "string" ||
            typeof data.value[key] === "symbol"
          ) {
            scope.text.push(key as keyof DewModuleCore);
          } else {
            scope[typeof data.value[key] as keyof ModuleScope].push(
              key as keyof DewModuleCore
            );
          }
        }
      },

      boolean: () => {
        scope.text.push(data.type);
      },
      function: () => {
        scope.text.push(data.type);
      },
      array: () => {
        scope.array.push(data.type);
      },
      undefined: () => {
        console.log(data);
        scope.undefined.push(data.type);
      },
    }[typeof data[data.type].value];

    cast();

    return scope;

    // try {
    //   const _data = data?.value || data;
    //   if (
    //     typeof _data === "object" &&
    //     _data !== null &&
    //     !Array.isArray(_data)
    //   ) {
    //     for (const key in _data) {
    //       if (
    //         typeof _data[key] === "object" &&
    //         _data[key] !== null &&
    //         !Array.isArray(_data[key])
    //       ) {
    //         if (_data[key]?.type) {
    //           scope.module.push(key as keyof DewModuleCore);
    //         } else {
    //           scope.object.push(key as keyof DewModuleCore);
    //         }
    //       } else if (typeof _data[key] === "undefined") {
    //         scope.undefined.push(key as keyof DewModuleCore);
    //       } else if (
    //         typeof _data[key] === "number" ||
    //         typeof _data[key] === "string" ||
    //         typeof _data[key] === "symbol"
    //       ) {
    //         scope.text.push(key as keyof DewModuleCore);
    //       } else {
    //         scope[typeof _data[key] as keyof ModuleScope].push(
    //           key as keyof DewModuleCore
    //         );
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error initialize scope :", error);
    //   throw new Error(`Error on ${this.module.type}`);
    // }
    return scope;
  }

  // Méthode pour obtenir la valeur en utilisant le type utilitaire
  getValue(): ModuleValue<T> {
    const key = this.module.type;
    return (this.module as any)[key].value;
  }
}
