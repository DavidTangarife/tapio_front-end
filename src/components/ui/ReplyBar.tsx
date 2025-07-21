import SendButton from "./SendButton";
import { Attachment, Send, Close } from "@mui/icons-material"
import "./ReplyBar.css"

type ReplyBarProps = {
  sendFunction: () => void,
  isSent: boolean
  setIsSent: (value: boolean) => void
}

const ReplyBar = (props: ReplyBarProps) => {
  const { sendFunction, isSent, setIsSent } = props;
  
  //Close sent message when clicking 'x'
  const closeSentMessage = () => {
  setIsSent(false);
}

  return (
    <>
    <div className="send-btn-container">
      <SendButton
        icon={Send}
        text="Send"
        onClick={sendFunction} />
       {isSent ? <p className="reply-sent-msg">Message Sent<Close className="close-x" onClick={closeSentMessage}/></p> : ""}
    </div>
   
     </>
  )
}

export default ReplyBar
