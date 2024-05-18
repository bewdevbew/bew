import { DewButton, DewModule, DewModuleSystem } from "@/types/dew/module";
import { DewUICore } from "./ui";

// interface DewButtonAdmin extends DewButton {
//   type: "button";
//   button: {
//     value: {
//       module_ui: {
//         type: "ui";
//         ui: {
//           value: {
//             dew_variants: DewUICore["VARIANTS"];
//             dew_className: DewUICore["CLASSNAME"] | undefined;
//             dew_api: DewModuleSystem["api_system"] | undefined;
//             dew_size: DewUICore["SIZE"];
//           };
//         };
//       };
//       module_ux: DewModuleSystem["ux_system"] | undefined;
//       module_api: DewModuleSystem["api_system"] | undefined;
//     };
//   };
// }
// interface DewButtonSafe extends DewButton {
//   button: {
//     value: {
//       module_ui: {
//         type: "ui";
//         ui: {
//           value: {
//             dew_className?: DewModuleSystem["ui_system"]["ui"]["value"]["dew_className"];
//             dew_style?: DewModuleSystem["ui_system"]["ui"]["value"]["dew_style"];
//             dew_variants?: DewModuleSystem["ui_system"]["ui"]["value"]["dew_variants"];
//           };
//         };
//       };
//       module_ux: {
//         type: "ux";
//         ux: {
//           value: {
//             layout_id?: DewModuleSystem["ux_system"]["ux"]["value"]["layout_id"];
//             page?: undefined;
//             children?: undefined;
//           };
//         };
//       };
//       module_api?: undefined;
//     };
//   };
// }

// interface DewButtonStrict extends DewButton {
//   button: {
//     value: {
//       module_ui?: undefined;
//       module_ux: {
//         type: "ux";
//         ux: {
//           value: {
//             layout_id?: DewModuleSystem["ux_system"]["ux"]["value"]["layout_id"];
//             page?: undefined;
//             children?: undefined;
//           };
//         };
//       };
//       dew_api?: undefined;
//     };
//   };
// }

// export type DewModuleBtn = {
//   default: DewButtonAdmin;
//   custom?:
//     | {
//         type: "safe";
//         safe: DewButtonSafe;
//       }
//     | {
//         type: "dangerous";
//         dangerous: DewButton;
//       }
//     | {
//         type: "dev";
//         dangerous: DewButton;
//       }
//     | {
//         type: "strict";
//         strict: DewButtonStrict;
//       };
// };
