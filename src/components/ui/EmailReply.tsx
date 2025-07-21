import { TextareaAutosize } from "@mui/material";
import ReplyBar from "./ReplyBar";
import "./EmailReply.css"
import { RefObject, useEffect, useRef, useState } from "react";
import ReplyGap from "./ReplyGap";
import "../../app/routes/ViewEmail.css";
import SendBar from "./SendBar";

interface EmailDetails {
  subject?: string;
  from?: string;
  isTapped?: boolean;
  projectId?: string;
  opportunityId?: string;
  date: string
}

type EmailReplyProps = {
  emailData: EmailDetails
  emailBody: string
  me: string
  containerRef: RefObject<HTMLElement>
}
const EmailReply = (props: EmailReplyProps) => {
  const { from, threadId, subject } = props.emailData
  const { emailBody, me, containerRef } = props
  const [to, setTo] = useState(from)
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      console.log('Current')
      inputRef.current!.focus()
    }
    //clear text input when sent
    if (inputRef.current && isSent) {
      inputRef.current.value = "";
    }
  }, [inputRef, isSent])

  useEffect(() => {
    console.log('Redraw')
  }, [inputRef.current?.value])

  return (
    <>
      <div className="reply-container" style={{ display: 'flex' }}>
        <div style={{ backgroundColor: 'white', color: '#181818', fontWeight: '500', position: 'relative', alignItems: "center", lineHeight: 1.5, width: '100%' }}>
          <div style={{ display: 'flex' }}>
            <label htmlFor="from-input" className="address-label">From </label>
            <input className="address-input" id="from-input" type="text" disabled={true} name="from" value={me} />
          </div>
          <div style={{ display: 'flex' }}>
            <label htmlFor="to-input" className="address-label">To </label>
            <input className="address-input" id="to-input" type="text" name="to" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div style={{ display: 'flex' }}>
            <label htmlFor="to-input" className="address-label">Cc </label>
            <input className="address-input" id="to-input" type="text" name="to" value={cc} onChange={(e) => setCc(e.target.value)} />
          </div>
          <div style={{ display: 'flex' }}>
            <label htmlFor="to-input" className="address-label">Bcc </label>
            <input className="address-input" id="to-input" type="text" name="to" value={bcc} onChange={(e) => setBcc(e.target.value)} />
          </div>
        </div>
        <div>
          <ReplyBar sendFunction={handleSend} saveTemplate={saveTemplate} inputRef={inputRef} />
        </div>
      </div>
      <TextareaAutosize
        className="replyField"
        minRows={4}
        autoFocus={true}
        ref={inputRef}
        style={{
          resize: 'none',
          width: '100%',
          backgroundColor: 'white',
          color: '#181818',
          border: 'none',
          fontFamily: '"Inter", sans serif',
          fontSize: '16px',
          outline: 'none',
          display: 'block',
          padding: '10px'
        }}
      />
      <SendBar sendFunction={handleSend} isSent={isSent} setIsSent={setIsSent} />
      <ReplyGap />
    </>
  )

  async function handleSend() {
    console.log(inputRef.current?.value)
    const req = await fetch("http://localhost:3000/api/send-email", {
      credentials: 'include',
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputRef.current?.value, addressees: { to, cc, bcc }, inReplyTo: threadId, subject: subject, replyChunk: formatEmailBody((emailBody)) })
    })
  }

  async function saveTemplate(templateName: string) {
    const text = inputRef.current?.value
    const response = await fetch('http://localhost:3000/api/save-template', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, templateName })
    })
    if (req.ok) {
      setIsSent(true);
    }
  }

  function formatEmailBody(body: string) {
    let processedBody = body.replace(' gmail_quote_container', '');
    processedBody = processedBody + '</body>'
    processedBody = processedBody.replace(/(\r\n|\n|\r)/gm, "")
    processedBody = `<div class="gmail_quote gmail_quote_container"><div class="gmail_attr" dir="ltr">${buildDate()}<br></div><blockquote class="gmail_quote" style="margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex">` + processedBody;
    processedBody = processedBody.replace('</blockquote></div></body>', '</blockquote></div></blockquote></div>')
    return processedBody
  }

  function buildDate() {
    const date = new Date(props.emailData.date)
    let dateData = date.toLocaleString('en-GB', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
    dateData = dateData.substring(0, dateData.length - 3) + '\u202F' + dateData.substring(dateData.length - 2)
    dateData = 'On ' + dateData.replace(' at', ',')
    dateData = dateData + ' ' + from!.replace(' ', ', ').replace('<', '<<href="mailto: jacobsemail">') + ' wrote:'
    return dateData
  }
};

export default EmailReply;
