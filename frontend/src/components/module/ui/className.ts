import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";

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
export class ClassNameModule extends BaseModule<"className"> {
  constructor(classNameValue: string) {
    const classNameType: ModuleTyped<"className"> = {
      type: "className",
      className: { value: classNameValue },
    };
    super(classNameType);
  }
}
