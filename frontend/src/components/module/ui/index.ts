import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";

type UIModuleKeys =
  keyof DewModuleCore["ui"]["default"]["ui"]["value"]["modules"]["value"];

type UIModuleValues = {
  [K in UIModuleKeys]: DewModuleCore["ui"]["default"]["ui"]["value"]["modules"]["value"][K];
};

type UIAccepted = "string" | "object" | "undefined";

export class BaseUIModule<
  K extends keyof UIModuleValues
> extends BaseModule<K> {
  __type: UIAccepted;
  private value: any;
  constructor(key: K, value: any) {
    const moduleData = {
      type: key,
      [key]: { value } as any,
    } as ModuleTyped<K>;
    super(moduleData);
    this.value = value;

    this.__type = typeof value as UIAccepted;
  }

  toString(): string {
    if (
      typeof this.value != "string" &&
      typeof this.value != "symbol" &&
      typeof this.value != "number" &&
      typeof this.value != "bigint"
    ) {
      throw new Error(
        `Error DEW_MODULE: type is not supported  {
            type : ${typeof this.value}
        }`
      );
    }
    return String(this.value);
  }
}

export const MODULE_UI_DEFAULT = {
  className: (s: string) => new BaseUIModule("className", s),
};
