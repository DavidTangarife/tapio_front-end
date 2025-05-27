type ButtonProps = {
  buttonText: string;
  className?: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button className={props.className}>{ props.buttonText }</button>
    )
}
export default Button;


