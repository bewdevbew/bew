import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";
import { BaseUIModule } from ".";

/**
 * @example
 * * const variantsType: ModuleTyped<"variants"> = {
 * *   type: "variants",
 * *   variants: {
 * *     value: {
 * *       state: "default",
 * *       default: "bg-primary text-primary-foreground hover:bg-primary/90",
 * *       destructive:
 * *         "bg-destructive text-destructive-foreground hover:bg-destructive/90",
 * *       outline:
 * *         "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
 * *       secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
 * *       ghost: "hover:bg-accent hover:text-accent-foreground",
 * *       link: "text-primary underline-offset-4 hover:underline",
 * *     },
 * *   },
 * * };
 * *
 * * const exempleVariantsModule = new BaseModule(variantsType);
 */

type VariantsValue = DewModuleCore["variants"]["default"]["variants"]["value"];

export class VariantsModule extends BaseUIModule<"variants"> {
  default: VariantsValue["default"];
  state: VariantsValue["state"];
  destructive: VariantsValue["destructive"];
  outline: VariantsValue["outline"];
  secondary: VariantsValue["secondary"];
  ghost: VariantsValue["ghost"];
  link: VariantsValue["link"];

  constructor(value: VariantsValue) {
    super("variants", value);

    this.state = value.state || "default";
    this.default =
      value.default || "bg-primary text-primary-foreground hover:bg-primary/90";
    this.destructive =
      value.destructive ||
      "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    this.outline =
      value.outline ||
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    this.secondary =
      value.secondary ||
      "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    this.ghost = value.ghost || "hover:bg-accent hover:text-accent-foreground";
    this.link = value.link || "text-primary underline-offset-4 hover:underline";

    if (typeof this[this.state] !== "string") {
      throw new Error(`Error DEW_MODULE: type is not supported  {
            type : ${typeof this[this.state]},
            module:'variants',
        }`);
    }
  }
  toString(): string {
    return this[this.state];
  }
}
