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
  type: "ui";
  ui: {
    value: {
      dew_className?: DewUICore["CLASSNAME"];
      dew_style?: TSyleSheet;
      dew_variants?: DewUICore["VARIANTS"];
      dew_size?: DewUICore["SIZE"];
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
export interface DewButton {
  type: "button";
  button: {
    value: {
      module_ui?: DewModuleSystem["ui_system"];
      module_ux?: DewModuleSystem["ux_system"];
      module_api?: DewModuleSystem["api_system"];
    };
  };
}
export interface DewModuleCore {
  BUTTON: DewButton;
}
