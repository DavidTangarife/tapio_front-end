import ViewEmailActionButton from "./ViewEmailActionButton";
import { Attachment, Send } from "@mui/icons-material"

type ReplyBarProps = {
  sendFunction: () => void
}
const ReplyBar = (props: ReplyBarProps) => {
  const { sendFunction } = props;
  return (
    <div className="email-action-btn-panel">
      <ViewEmailActionButton
        icon={Send}
        text="Send"
        value=""
        onClick={sendFunction}
        style={{ width: "60px", height: "60px" }}
      />
    </div>
  )
}

export default ReplyBar
