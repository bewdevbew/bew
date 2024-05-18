// "use client";

import { BaseModule } from "../module";

import { DewModuleCore, ModuleTyped } from "@/types/dew/module";
import { ClassNameModule } from "../module/ui/className";

// import * as React from "react";
// import { Slot } from "@radix-ui/react-slot";
// import { cva, type VariantProps } from "class-variance-authority";

// import { cn } from "@/utils/ui";
// import { DewModuleBtn } from "@/types/dew/module_btn";
// import { BaseModule } from "@/utils";
// import { DewButton, DewModuleSystem } from "@/types/dew/module";
// import { DewUICore } from "@/types/dew/ui";
// import { DEW_MODULE_DEFAULT } from "../module";
// import { DEW_MODULE_UI_DEFAULT } from "../module/ui";

// const defaultButton = {
//   type: "button",
//   button: {
//     value: {
//       module_ux: undefined,
//       module_api: undefined,
//       module_ui: {
//         type: "ui",
//         ui: {
//           value: {
//             dew_variants: {
//               type: "variants",
//               variants: {
//                 value: {
//                   state: "default",
//                   default:
//                     "bg-primary text-primary-foreground hover:bg-primary/90",
//                   destructive:
//                     "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//                   outline:
//                     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//                   secondary:
//                     "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//                   ghost: "hover:bg-accent hover:text-accent-foreground",
//                   link: "text-primary underline-offset-4 hover:underline",
//                 },
//               },
//             },
//             dew_className: undefined,
//             // dew_api: undefined,
//             dew_size: {
//               type: "size",
//               size: {
//                 value: {
//                   state: "default",
//                   default: "h-10 px-4 py-2",
//                   sm: "h-9 rounded-md px-3",
//                   lg: "h-11 rounded-md px-8",
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   },
// };

// class BtnModule extends BaseModule<"button"> {
//   ui?: BaseModule<"ui">;
//   // ux?: BaseModule<"ux">;
//   // api?: BaseModule<"api">;

//   constructor(data: DewModuleCore["button"]["default"]) {
//     super(data);
//     // this.initializeData(data);
//   }
// }

// // let module = new BtnModule((DEW_MODULE_DEFAULT as any).button);
// let module = "";

// // type ModuleBtn = DewButton["button"]["value"] & ModuleObject;

// // const test = new BtnModule({
// //   type: "button",
// //   button: {
// //     value: {
// //       module_ux: undefined,
// //       module_api: undefined,
// //       module_ui: {
// //         type: "ui",
// //         ui: {
// //           value: {
// //             dew_variants: {
// //               type: "variants",
// //               variants: {
// //                 value: {
// //                   state: "default",
// //                   default:
// //                     "bg-primary text-primary-foreground hover:bg-primary/90",
// //                   destructive:
// //                     "bg-destructive text-destructive-foreground hover:bg-destructive/90",
// //                   outline:
// //                     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
// //                   secondary:
// //                     "bg-secondary text-secondary-foreground hover:bg-secondary/80",
// //                   ghost: "hover:bg-accent hover:text-accent-foreground",
// //                   link: "text-primary underline-offset-4 hover:underline",
// //                 },
// //               },
// //             },
// //             dew_className: undefined,
// //             // dew_api: undefined,
// //             dew_size: {
// //               type: "size",
// //               size: {
// //                 value: {
// //                   state: "default",
// //                   default: "h-10 px-4 py-2",
// //                   sm: "h-9 rounded-md px-3",
// //                   lg: "h-11 rounded-md px-8",
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       },
// //     },
// //   },
// // });

// const v =
//   defaultButton.button.value.module_ui.ui.value.dew_variants.variants.value;
// const s = defaultButton.button.value.module_ui.ui.value.dew_size.size.value;

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default: v.default,
//         destructive: v.destructive,
//         outline: v.outline,
//         secondary: v.secondary,
//         ghost: v.ghost,
//         link: v.link,
//       },
//       size: {
//         default: s.default,
//         sm: s.sm,
//         lg: s.lg,
//         icon: "h-10 w-10",
//       },
//     },
//     // defaultVariants: {
//     //   variant: v.state,
//     //   size: s.state,
//     // },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant, size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button";

//     console.log({
//       // moduleBtn: getModuleVa@lue(defaultButton),
//       // test: DEW_MODULE_UI_DEFAULT.button,
//       // moduleBtnWithModule: test,
//       // test: test?.["module_ui"],
//       // moduleUi: test?.["module_ui"],
//       // test: test?.getValue?.("module_ui"),
//     });
//     return <></>;
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );
// Button.displayName = "Button";

// export { Button, buttonVariants };

// const classNameModule: ModuleTyped<"button"> = {
//   type: "button",
//   button: {
//     value: {
//       type: "modules",
//       modules: {
//         value: {
//           style: {
//             type: "style",
//             style: {
//               value: {
//                 color: "red",
//               },
//             },
//           },
//           variants: {
//             type: "variants",
//             variants: {
//               value: {
//                 state: "default",
//                 default:
//                   "bg-primary text-primary-foreground hover:bg-primary/90",
//                 destructive:
//                   "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//                 outline:
//                   "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//                 secondary:
//                   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//                 ghost: "hover:bg-accent hover:text-accent-foreground",
//                 link: "text-primary underline-offset-4 hover:underline",
//               },
//             },
//           },
//           size: {
//             type: "size",
//             size: {
//               value: {
//                 state: "default",
//                 default: "h-10 px-4 py-2",
//                 sm: "h-9 rounded-md px-3",
//                 lg: "h-11 rounded-md px-8",
//               },
//             },
//           },
//           className: {
//             type: "className",
//             className: {
//               value: "text-xs",
//             },
//           },
//         },
//       },
//     },
//   },
// };

// const test = new BaseModule(classNameModule);

const check = new ClassNameModule("text-xs");
export const Button = () => {
  console.log({
    check: check.getValue(),
    // moduleBtn: getModuleVa@lue(defaultButton),
    // value: test.getValue(),
    // // check: check.default,
    // test,
    // scope: test._getScope(),

    // className: DEW_MODULE_UI_DEFAULT.button.className,
    // module: module,

    // btn,
    // btnDefault: btn.value.modules.value.ui.value,
    // button: DEW_MODULE_DEFAULT.button,

    // moduleBtnWithModule: test,
    // test: test?.["module_ui"],
    // moduleUi: test?.["module_ui"],
    // test: test?.getValue?.("module_ui"),
  });
  return <div style={{ width: "10px" }}></div>;
};
