import { useEffect, useRef, useState } from "react"

const TemplateModal = (props) => {
  const { position, templates, saveTemplate, inputRef, modalRef } = props
  const [savingTemplate, setSavingTemplate] = useState<boolean>(false)
  const templateNameRef = useRef<HTMLInputElement | null>(null)


  return (
    <div className="templateModal"
      style={{ color: 'black', top: position.top + 8, left: -20, width: '106%' }} ref={modalRef}>
      {savingTemplate ? (
        <>
          <label htmlFor="templateName">Template Name</label>
          <input ref={templateNameRef} style={{ width: '70%', marginTop: '4px', color: 'white', outline: 'none', border: 'none', borderRadius: '4px', paddingLeft: '4px', paddingRight: '4px' }} type="text" name="templateName" />
          <button style={{ marginLeft: '8px' }} onClick={executeSave}>Save</button>
        </>
      ) : (
        <ul style={{ listStyle: 'none', textAlign: 'center' }}>
          {templates.map(item => (
            <li key={item._id} onClick={() => { activateTemplate(item._id) }}>{item.templateName}</li>
          ))}
          <li onClick={nameTemplate}>Save As Template</li>
        </ul>
      )
      }
    </div >
  )

  async function nameTemplate() {
    setSavingTemplate(true)
  }
  async function executeSave() {
    const templateName = templateNameRef.current!.value;
    await saveTemplate(templateName)
    setSavingTemplate(false)
  }
  function activateTemplate(id: string) {
    const template = templates.find(item => item._id === id)
    inputRef.current.value = template.text
    console.log(template.text)
  }

}

export default TemplateModal
