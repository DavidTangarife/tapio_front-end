import { RefObject, useRef } from "react";
import EmailTemplates from "./EmailTemplates";
import ViewEmailActionButton from "./ViewEmailActionButton";
import { Attachment, Send } from "@mui/icons-material"

type ReplyBarProps = {
  sendFunction: () => void
  saveTemplate: () => void
  inputRef: RefObject<HTMLTextAreaElement>
}
const ReplyBar = (props: ReplyBarProps) => {
  const { sendFunction, saveTemplate, inputRef } = props;
  const panelRef = useRef<HTMLDivElement | null>(null)
  return (
    <>
      <div className="email-action-btn-panel" ref={panelRef}>
        <EmailTemplates
          style={{ width: "80px", height: "60px" }}
          panelRef={panelRef}
          saveTemplate={saveTemplate}
          inputRef={inputRef}
        />
        <ViewEmailActionButton
          icon={Send}
          text="Send"
          value=""
          onClick={sendFunction}
          style={{ width: "60px", height: "60px" }}
        />
      </div>
    </>
  )
}

export default ReplyBar
