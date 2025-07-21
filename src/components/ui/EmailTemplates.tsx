import { Article } from "@mui/icons-material"
import ViewEmailActionButton from "./ViewEmailActionButton"
import { useEffect, useRef, useState } from "react"
import TemplateModal from "./TemplateModal"

const EmailTemplates = (props) => {
  const { style, panelRef, saveTemplate, inputRef } = props
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLElement | null>(null)
  const [templateList, setTemplateList] = useState(false)
  const [modalPosition, setModalPosition] = useState({ top: 0, width: 0, left: 0 })
  const [templates, setTemplates] = useState<string[] | []>([])
  const [mouseOver, setMouseOver] = useState<boolean>(false)

  useEffect(() => {
    if (templateList) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
  }, [templateList])

  return (
    <>
      <div className="templateButton" ref={buttonRef} onClick={showTemplates}>
        <ViewEmailActionButton
          icon={Article}
          text="Templates"
          value=""
          style={style}
        /></div>
      {templateList ? (
        <TemplateModal position={modalPosition} templates={templates} saveTemplate={saveTemplate} inputRef={inputRef}
          modalRef={modalRef}
        />
      ) : (
        null
      )}
    </>
  )

  async function showTemplates() {
    const panel = panelRef.current
    const panelBounding = panel.getBoundingClientRect()

    const button = buttonRef.current
    if (button) {
      const position = button.getBoundingClientRect()
      await getTemplates()
      setModalPosition({ top: position.bottom - panelBounding.top, width: position.right - position.left, left: position.left })
      setTemplateList(true)
    }
  }

  async function getTemplates() {
    try {
      const response = await fetch("http://localhost:3000/api/templates", {
        credentials: 'include'
      })
      const templates = await response.json()
      setTemplates(templates)
    } catch (err) {
      console.log(err)
    }
  }

  function handleClickOutside(event) {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setTemplateList(false)
    }
  }
}

export default EmailTemplates
