type ButtonProps = {
  buttonText: string;
  className?: string;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  return (
    <button className={ props.className } 
            onClick={props.onClick}>
            { props.buttonText }
    </button>
    )
}
export default Button;


