import { TextareaAutosize } from "@mui/material";
import ReplyBar from "./ReplyBar";
import { useEffect, useRef, useState } from "react";
import ReplyGap from "./ReplyGap";
import "./EmailReply.css"

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
  
}
const EmailReply = (props: EmailReplyProps) => {
  const { from, threadId, subject } = props.emailData
  const { emailBody } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const date = new Date(props.emailData.date)
  const [isSent, setIsSent] = useState(false);
  let dateData = date.toLocaleString('en-GB', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
  dateData = dateData.substring(0, dateData.length - 3) + '\u202F' + dateData.substring(dateData.length - 2)
  dateData = 'On ' + dateData.replace(' at', ',')
  dateData = dateData + ' ' + from.replace(' ', ', ').replace('<', '<<href="mailto: jacobsemail">') + ' wrote:'


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

  return (
    <>
     <div className="reply-container">
        <div style={{ backgroundColor: 'white', color: '#181818', fontWeight: '500', position: 'relative', alignItems: "center", lineHeight: 1.5, width: '100%' }}>
          <div>From: {props.emailData.from}</div>
          <div>To:  {props.emailData.from}</div>
          <div>Cc: </div>
          <div>Bcc: </div>
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
          margin: '40px 0 40px 0',
        }}
        />
        <ReplyBar sendFunction={handleSend} isSent={isSent} setIsSent={setIsSent} />
     </div>
      <ReplyGap />
    </>
  )

  async function handleSend() {
    console.log(inputRef.current?.value)
    const req = await fetch("http://localhost:3000/api/send-email", {
      credentials: 'include',
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputRef.current?.value, to: from, inReplyTo: threadId, subject: subject, replyChunk: formatEmailBody((emailBody)) })
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
