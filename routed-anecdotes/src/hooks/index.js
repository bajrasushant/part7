import { useState } from "react";

export const useField = (name) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };
  
  const onReset = () => {
    console.log(value);
    setValue("");
    console.log(value);
  };

  return {
    name,
    value,
    onChange,
    onReset
  };
};
