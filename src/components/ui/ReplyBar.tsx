import { RefObject, useRef } from "react";
import EmailTemplates from "./EmailTemplates";

type ReplyBarProps = {
  sendFunction: () => void
  saveTemplate: () => void
  inputRef: RefObject<HTMLTextAreaElement>
  templateSetter: unknown
}

const ReplyBar = (props: ReplyBarProps) => {
  const { sendFunction, saveTemplate, inputRef, templateSetter } = props;
  const panelRef = useRef<HTMLDivElement | null>(null)
  return (
    <>
      <div className="email-action-btn-panel" ref={panelRef}>
        <EmailTemplates
          style={{ width: "150px", height: "60px" }}
          panelRef={panelRef}
          saveTemplate={saveTemplate}
          inputRef={inputRef}
          templateSetter={templateSetter}
        />
      </div>
    </>
  )
}

export default ReplyBar
