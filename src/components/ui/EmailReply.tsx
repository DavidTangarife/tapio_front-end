import { TextareaAutosize } from "@mui/material";

const EmailReply = () => {
  return (
    <>
      <div>REPLY</div>
      <TextareaAutosize
        className="replyField"
        minRows={5}
        style={{
          resize: 'none',
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          border: 'none',
          fontFamily: '"Darker Grotesque", sans serif',
          outline: 'none',
        }}
      />
    </>
  )
};

export default EmailReply;
