import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";
import { BaseUIModule } from ".";

/**
 * @example
 * * const classNameType: ModuleTyped<"className"> = {
 * *   type: "className",
 * *   className: { value: "text-xs" },
 * * };
 * * const defaultClassNameModule = new BaseModule(classNameType); // defaultClassNameModule.getValue() return text-xs
 * *
 * * const exempleClassNameModule = new ClassNameModule("text-xs"); // return text-xs
 */
export class ClassNameModule extends BaseUIModule<"className"> {
  constructor(value: string) {
    super("className", value);
  }
}
