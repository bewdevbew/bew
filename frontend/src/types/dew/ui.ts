export type DewUICore = {
  SIZE: {
    type: "size";
    size: {
      value: {
        state: "default" | "sm" | "lg";
        default: string;
        sm: string;
        lg: string;
      };
    };
  };
  VARIANTS: {
    type: "variants";
    variants: {
      value: {
        state:
          | "default"
          | "ghost"
          | "outline"
          | "destructive"
          | "link"
          | "secondary";
        default: string;
        destructive: string;
        outline: string;
        secondary: string;
        ghost: string;
        link: string;
      };
    };
  };
  CLASSNAME: {
    type: "className";
    className: {
      value: string;
    };
  };
};
