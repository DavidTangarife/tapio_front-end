import type { ChangeEvent } from 'react'
import "./SetupForm.css"

type FormInputProps = {
  label: string,
  type: "text" | "date"
  name: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string 
}

export const FormInput = (props: FormInputProps) => {
  return (
    <>
      <h3 className="setup-form-title">{props.label}</h3>
      <input
        className="setup-usr-input"
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        autoFocus
        required
        placeholder={props.placeholder} />
    </>

  )
}
