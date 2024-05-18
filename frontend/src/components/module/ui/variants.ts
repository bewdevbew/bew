import { ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";

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
