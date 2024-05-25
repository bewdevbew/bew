import { ReactNode } from "react";
import { DewUICore } from "./ui";

/**
 * API DeW Module
 * Chaque requête API à ce type.
 * Pour certaines requêtes, on autorisera la configuration de paramètres.
 */

type TDewModuleAPIParamsJSON = {
  type: "json";
  json:
    | JSON
    | {
        value: JSON;
      };
};
type TDewModuleAPIParamsText = {
  type: "text";
  text:
    | string
    | number
    | {
        value: string | number;
      };
};
type TDewModuleAPIParamsArray = {
  type: "array";

  array: string[] | number[];
};

type TDewModuleAPI =
  | {
      type: "https";
      https: {
        value: {
          method: "GET" | "POST";
          req: string;
          params?: {
            value: {
              param: string;
              payload:
                | TDewModuleAPIParamsJSON
                | TDewModuleAPIParamsText
                | TDewModuleAPIParamsArray;
            }[];
          };
          base_url: string;
        };
      };
    }
  | {
      type: "library";
      library: {
        value: {
          method: "GET" | "POST";
          req: string;
          params?: {
            param: string;
            payload:
              | TDewModuleAPIParamsJSON
              | TDewModuleAPIParamsText
              | TDewModuleAPIParamsArray;
          }[];

          version?: string;
          service: "octokit";
        };
      };
    };

export type DewModuleAPI = {
  type: "api";
  api: { value: TDewModuleAPI };
};

/**
 * Style System DeW Module
 * Chaque module de style à ce type.
 * Pour certains modules, on autorisera la configuration de paramètres.
 */

type TSyleSheet = {
  type: "stylesheet";
  stylesheet: {
    value: {
      style: StyleSheet;
    };
  };
};

type TComponent = {
  type: "component";
  component: {
    value: {
      children?: ReactNode;
      className?: string | DewUICore["CLASSNAME"];
      style?: StyleSheet | TSyleSheet;
      module?: {
        api?: DewModuleAPI;
        component?: DewModuleUI;
      };
    };
  };
};

type DewModuleUI = {
  type: "modules";
  modules: {
    value: {
      className: DewUICore["CLASSNAME"];
      style: TSyleSheet;
      variants: DewUICore["VARIANTS"];
      size: DewUICore["SIZE"];
    };
  };
};

type DewModuleUX = {
  type: "ux";
  ux: {
    value: {
      layout_id?: string;
      page?: string;
      children?: ReactNode | TComponent;
    };
  };
};

export type DewModule =
  | {
      type: "api_system";
      api_system: { value: DewModuleAPI };
    }
  | {
      type: "ui_system";
      ui_system: { value: DewModuleUI };
    }
  | {
      type: "ux_system";
      ux_system: { value: DewModuleUX };
    };

export interface DewModuleSystem {
  api_system: DewModuleAPI;
  ui_system: DewModuleUI;
  ux_system: DewModuleUX;
}
// export interface DewButton {
//   type: "button";
//   button: {
//     value: DewModuleCore["modules"];
//   };
// }

export interface DewModules {
  type: "modules";
  modules: {
    value: {
      ui: DewModuleSystem["ui_system"] | undefined;
      ux: DewModuleSystem["ux_system"] | undefined;
      api: DewModuleSystem["api_system"] | undefined;
    };
  };
}

export type ModuleTyped<T extends keyof DewModuleCore> = {
  type: T;
} & DewModuleCore[T]["default"];

export type ModuleValue<T extends keyof DewModuleCore> =
  DewModuleCore[T]["default"][keyof DewModuleCore[T]["default"]] extends {
    value: infer V;
  }
    ? V
    : never;

export interface DewModuleCore {
  className: {
    type: "default";
    default: {
      type: "className";
      className: { value: string };
    };
  };
  size: {
    type: "default";
    default: DewModuleSystem["ui_system"]["modules"]["value"]["size"];
  };
  variants: {
    type: "default";
    default: DewModuleUI["modules"]["value"]["variants"];
  };
  style: {
    type: "default";
    default: {
      type: "style";
      style: { value: React.CSSProperties };
    };
  };
  ui: {
    type: "default";
    default: {
      type: "ui";
      ui: {
        value: {
          type: "modules";
          modules: {
            value: {
              className: DewModuleCore["className"]["default"];
              style: DewModuleCore["style"]["default"];
              variants: DewModuleCore["variants"]["default"];
              size: DewModuleCore["size"]["default"];
            };
          };
        };
      };
    };
  };
  button: {
    type: "default";
    default: {
      type: "button";
      button: {
        value: {
          type: "modules";
          modules: {
            value: {
              ui: DewModuleSystem["ui_system"]["modules"]["value"];
              // ux: DewModuleSystem["ux_system"]["modules"]["value"];
              // api: DewModuleSystem["api_system"]["modules"]["value"];
            };
          };
        };
      };
    };
    // admin: DewModuleBtn["default"];
    // dev: DewModuleBtn["custom"];
    // custom: DewModuleBtn["custom"];
  };
  card: {
    type: "default";
    default: {
      type: "card";
      button: {
        value: {
          type: "ui";
          ui: {
            value: DewModuleSystem["ui_system"]["modules"]["value"];
          };
        };
      };
    };
    // admin: DewModuleBtn["default"];
    // dev: DewModuleBtn["custom"];
    // custom: DewModuleBtn["custom"];
  };

  // modules: {
  //   type: "default";
  //   default: DewModules;
  // };

  // className1: {
  //   type: "default";
  //   default: {
  //     type: "className1";
  //     className: { value: string };
  //   };
  // };

  // style: {
  //   type: "default";
  //   default: DewModuleUI["modules"]["value"]["style"];
  // };
  // ux: {
  //   type: "default";
  //   default: DewModuleSystem["ux_system"]["ux"];
  // };

  // api: {
  //   type: "default";
  //   default: DewModuleSystem["api_system"]["api"];
  // };
}

// export type ModuleTyped<T extends keyof DewModuleCore> = {
//   type: T;
// } & {
//   [K in T]: DewModuleCore[K]["default"][]['value'];
// };
