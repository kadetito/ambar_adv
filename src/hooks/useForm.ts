// import { FC, ReactElement, useState } from "react";

// export const useForm = (initialForm = {}) => {
//   const [formState, setFormState] = useState(initialForm);

//   const onInputChange = ({ target }: any) => {
//     const { name, value } = target;
//     setFormState({
//       ...formState,
//       [name]: value,
//     });
//   };

//   const onResetForm = () => {
//     setFormState(initialForm);
//   };

//   return {
//     ...formState,
//     formState,
//     onInputChange,
//     onResetForm,
//   };
// };

import { ChangeEvent, useState } from "react";

export const useForm = <T>(initialForm: T) => {
  const [formState, setFormState] = useState(initialForm);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormState({ ...initialForm });
  };

  const isValidEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  return {
    ...formState,

    // properties
    formState,

    // Methods
    isValidEmail,
    onInputChange,
    resetForm,
  };
};
