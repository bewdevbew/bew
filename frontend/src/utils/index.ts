import { DewButton, DewModuleCore } from "@/types/dew/module";
import { DewUICore } from "@/types/dew/ui";

// Fonction utilitaire pour vérifier si un objet a une propriété "value"
function hasValueProperty(obj: any): obj is { value: any } {
  return obj && typeof obj === "object" && "value" in obj;
}

// Utility type to extract the value type based on the module's type property
type ModuleValue<T> = T extends { value: infer U } ? U : never;

// Définir le type pour le module avec le type
type ModuleWithType = {
  type: keyof DewModuleCore | keyof DewUICore | keyof DewButton | string;
  [key: string]:
    | DewModuleCore
    | DewButton
    | DewUICore
    | string
    | ModuleWithType;
};

// Utiliser ce type pour obtenir la valeur d'un module
export function getModuleValue<T extends ModuleWithType>(
  module: T
): ModuleValue<T[T["type"]]> {
  const moduleType = module.type;
  const moduleData = module[moduleType];

  if (moduleData && hasValueProperty(moduleData)) {
    return moduleData.value as ModuleValue<T[T["type"]]>;
  }

  throw new Error(`Module value not found for type "${moduleType}"`);
}

// Interface ModuleScope
interface ModuleScope {
  module: ModuleWithType["type"][];
  object: ModuleWithType["type"][];
  boolean: ModuleWithType["type"][];
  function: ModuleWithType["type"][];
  array: ModuleWithType["type"][];
  undefined: ModuleWithType["type"][];
  text: ModuleWithType["type"][];
}

// Type pour les descripteurs de propriété
type PropertyDescriptors<T> = {
  [K in keyof T]: {
    value?: T[K];
    writable?: boolean;
    enumerable?: boolean;
    configurable?: boolean;
    get?: () => T[K];
    set?: (value: T[K]) => void;
  };
};
// Classe Module
export class Module<T extends ModuleWithType> {
  _type: string;
  _scope: ModuleScope;
  private module: T;
  private data: any;

  constructor(data: T) {
    this.module = data;
    this.data = getModuleValue(data);

    this._type = this.module.type;
    this._scope = this.initializeScope();
    this.populateScope(this.data);

    if (
      typeof this.data === "object" &&
      this.data !== null &&
      !Array.isArray(this.data)
    ) {
      this.data = Object.keys(this.data).reduce((acc: any, key) => {
        if (this.data[key] !== undefined) {
          if (
            this.determineType({
              type: this.getPrimitiveType(this.data[key]),
              value: this.data[key],
            }) === "module"
          ) {
            acc[key] = new Module(this.data[key] as T); // cast à T pour respecter le type générique
          } else {
            acc[key] = this.data[key];
          }
        }
        return acc;
      }, {});
    }

    const descriptors: PropertyDescriptors<any> = Object.keys(this.data).reduce(
      (acc, key) => {
        acc[key as keyof any] = {
          get: () =>
            (this.data[key] as any).type
              ? getModuleValue(this.data[key] as any)
              : this.data[key],
          set: (value: any) => {
            this.data[key] = value;
          },
          enumerable: true,
          configurable: true,
        };
        return acc;
      },
      {} as PropertyDescriptors<any>
    );

    Object.defineProperties(this, descriptors);
    Object.assign(this, this.data);
  }

  private determineType(data: ModuleWithType): string {
    return data[data.type] ? "module" : this.getPrimitiveType(data.value);
  }

  private getPrimitiveType(value: any): string {
    if (Array.isArray(value)) return "array";
    if (value === null || value === undefined) return "undefined";
    return typeof value;
  }

  private initializeScope(): ModuleScope {
    return {
      module: [],
      object: [],
      boolean: [],
      function: [],
      array: [],
      undefined: [],
      text: [],
    };
  }

  private populateScope(data: any): void {
    if (Array.isArray(data)) {
      for (const item of data) {
        const itemType = this.determineType({
          type: this.getPrimitiveType(item),
          value: item,
        });
        this._scope[itemType].push(item.toString());
      }
    } else if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const itemType = this.determineType({
            type: this.getPrimitiveType(data[key]),
            value: data[key],
          });
          this._scope[itemType].push(key);
        }
      }
    } else {
      const itemType = this.getPrimitiveType(data);
      this._scope[itemType].push(data.toString());
    }
  }

  getValue<K extends keyof T>(key: K): T[K] {
    const moduleData = this.data[key];

    if (moduleData) {
      return moduleData as T[K];
    }

    throw new Error(`Module value not found for key "${key}"`);
  }
}
