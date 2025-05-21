type ButtonProps = {
  buttonText: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button>{ props.buttonText }</button>
    )
}
export default Button;


