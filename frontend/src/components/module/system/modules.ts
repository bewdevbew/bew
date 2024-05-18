import { ModuleTyped } from "@/types/dew/module";
import { BaseModule } from "..";

/**
 * @example
 * * const modulesType: ModuleTyped<"ui"> = {
 * *   type: "ui",
 * *   ui: {
 * *     value: {
 * *       type: "modules",
 * *       modules: {
 * *         value: {
 * *           style: {
 * *             type: "style",
 * *             style: {
 * *               value: {
 * *                 color: "red",
 * *               },
 * *             },
 * *           },
 * *           variants: {
 * *             type: "variants",
 * *             variants: {
 * *               value: {
 * *                 state: "default",
 * *                 default:
 * *                   "bg-primary text-primary-foreground hover:bg-primary/90",
 * *                 destructive:
 * *                   "bg-destructive text-destructive-foreground hover:bg-destructive/90",
 * *                 outline:
 * *                   "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
 * *                 secondary:
 * *                   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
 * *                 ghost: "hover:bg-accent hover:text-accent-foreground",
 * *                 link: "text-primary underline-offset-4 hover:underline",
 * *               },
 * *             },
 * *           },
 * *           size: {
 * *             type: "size",
 * *             size: {
 * *               value: {
 * *                 state: "default",
 * *                 default: "h-10 px-4 py-2",
 * *                 sm: "h-9 rounded-md px-3",
 * *                 lg: "h-11 rounded-md px-8",
 * *               },
 * *             },
 * *           },
 * *           className: {
 * *             type: "className",
 * *             className: {
 * *               value: "text-xs",
 * *             },
 * *           },
 * *         },
 * *       },
 * *     },
 * *   },
 * * };
 * *
 * * const exempleModulesModule = new BaseModule(modulesType);
 */
