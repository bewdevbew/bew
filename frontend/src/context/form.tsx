// FormContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Définition du type pour le contexte du formulaire
interface FormContextType {
  set: (target: string, value: any) => void;
  get: () => any;
  getValue: (target: string) => any;
}

// Création du contexte avec les types définis
const FormContext = createContext<FormContextType | undefined>(undefined);

// Fournisseur du contexte du formulaire
export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formState, setFormState] = useState<Record<string, any>>({});

  const set = (target: string, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [target]: value,
    }));
  };

  const getValue = (target: string) => {
    return formState[target];
  };

  const get = () => formState;
  return (
    <FormContext.Provider value={{ set, get, getValue }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook pour utiliser le contexte du formulaire
export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
