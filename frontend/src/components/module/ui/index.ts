import { DewModuleCore } from "@/types/dew/module";
import { BaseModule } from "..";
// import { BaseModule, ModuleWithType } from "@/utils";
// import { VariantsModule } from "./variants";
// import { SizeModule } from "./size";
// import { ClassNameModule } from "./className";

type UIModuleValues =
  DewModuleCore["ui"]["default"]["ui"]["value"]["modules"]["value"];

type ModuleValue<T extends keyof DewModuleCore["ui"]> =
  DewModuleCore["ui"]["default"]["ui"]["value"][T][keyof DewModuleCore["ui"][T]["default"]] extends {
    value: infer V;
  }
    ? V
    : never;

class UIModule<K extends keyof UIModuleValues> extends BaseModule<"ui"> {
  constructor(key: K, value: UIModuleValues[K]) {
    const uiModule: ModuleTyped<"ui"> = {
      type: "ui",
      ui: {
        modules: {
          value: {
            [key]: { value },
          } as any, // Type assertion pour contourner le typage strict
        },
      },
    };
    super(uiModule);
  }

  getValue<K extends keyof UIModuleValues>(key: K): UIModuleValues[K]["value"] {
    return (this.module.ui.modules.value as any)[key].value;
  }
}

// export const uiButtonModule = new UIModule({
//   type: "ui",
//   ui: {
//     value: {
//       type: "modules",
//       modules: {
//         value: {
//           variants: DEW_MODULE_UI_DEFAULT.button.variants,
//           className: DEW_MODULE_UI_DEFAULT.button.className,
//           style: DEW_MODULE_UI_DEFAULT.button.style, // dew_api: undefined,
//           size: DEW_MODULE_UI_DEFAULT.button.size,
//         },
//       },
//     },
//   },
// });
