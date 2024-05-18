import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";

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
