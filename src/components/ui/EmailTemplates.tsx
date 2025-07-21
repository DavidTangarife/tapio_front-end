import { Article } from "@mui/icons-material"
import ViewEmailActionButton from "./ViewEmailActionButton"

const EmailTemplates = (props) => {
  const { style } = props
  return (
    <ViewEmailActionButton
      icon={Article}
      text="Templates"
      value=""
      style={style}
    />
  )
}

export default EmailTemplates
