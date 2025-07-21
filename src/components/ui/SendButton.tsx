import { Send } from "@mui/icons-material"
import "./SendButton.css";

interface SendButtonProps  {
    icon: React.ElementType,
    text: string,
    onClick: () => void,
}

const SendButton = ({text, onClick}: SendButtonProps) => {
return (
  <>
    <button className="send-button" onClick={onClick}>
        <Send sx={{color: "#181818"}}/>
       {text}
    </button>
  </>
)

}
export default SendButton;