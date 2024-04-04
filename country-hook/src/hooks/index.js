import axios from "axios";
import { useEffect, useState } from "react";

export const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useCountry = (name) => {
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (name !== "") {
      const fetchCountry = async () => {
        try {
          const response = await axios.get(
            `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`,
          );
          setCountry({
            data: {
              name: response.data.name.common,
              capital: response.data.capital,
              population: response.data.population,
              flag: response.data.flags.png,
            },
            found: true,
          });
        } catch (err) {
          console.error("Fetching country data failed", err);
          setCountry({ found: false });
        }
      };
      fetchCountry();
    } else {
      setCountry(null);
    }
  }, [name]);

  return country;
};
