import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";
import { BaseUIModule } from ".";

/**
 * @example
 * * const sizeType: ModuleTyped<"size"> = {
 * *   type: "size",
 * *   size: {
 * *     value: {
 * *       state: "default",
 * *       default: "h-10 px-4 py-2",
 * *       sm: "h-9 rounded-md px-3",
 * *       lg: "h-11 rounded-md px-8",
 * *     },
 * *   },
 * * };
 * *
 * * const exempleSizeModule = new BaseModule(sizeType);
 */

type SizeValue = DewModuleCore["size"]["default"]["size"]["value"];

export class SizeModule extends BaseUIModule<"size"> {
  default: SizeValue["default"];
  state: SizeValue["state"];
  lg: SizeValue["lg"];
  sm: SizeValue["sm"];
  constructor(value: SizeValue | string) {
    if (typeof value === "string") {
      value = {
        default: value,
        state: "default",
        lg: value,
        sm: value,
      };
    }
    super("size", value);

    this.default = value.default;
    this.state = value.state;
    this.lg = value.lg;
    this.sm = value.sm;

    if (typeof this[this.state] !== "string") {
      throw new Error(`Error DEW_MODULE: type is not supported  {
            type : ${typeof this[this.state]},
            module:'size',
        }`);
    }
  }
  toString(): string {
    return this[this.state];
  }
}
