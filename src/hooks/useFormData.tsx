import type { ChangeEvent } from 'react';
import { useState } from 'react';

type FormData = {
  fullName: string,
  projectName: string,
  searchDate: string
}

  export const useFormData = (defaultData: FormData = {
    fullName: "",
    projectName: "",
    searchDate: "",
  }) => {
    const [formData, setFormData] = useState(defaultData);

    const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      //console.log(`Updating ${name}:`, value);
      setFormData((prevInput) => ({...prevInput, [name]: value }));
    };

    return { formData, updateFormData };
  };
    
  
  
