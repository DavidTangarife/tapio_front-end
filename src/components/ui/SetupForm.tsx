import type { ChangeEvent } from 'react'

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
      <h3>{props.label}</h3>
      <input
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
