import { EditOutlined } from "@mui/icons-material"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import TextField from '@mui/material/TextField';

type BoardHeadingProps = {
  title: string;
  currentFocus: HTMLInputElement | null;
  setCurrentFocus: (e: HTMLInputElement) => void;
  columnId: string;
}

const BoardHeading = (props: BoardHeadingProps) => {
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.title)
  const [tempTitle, setTempTitle] = useState(props.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setCurrentFocus, currentFocus } = props

  // This refreshes the element when it goes into edit mode and sets the parent state
  // to accept this as the currently editing input
  useEffect(() => {
    setHovering(false)
    if (inputRef.current) {
      inputRef.current.focus()
      setCurrentFocus(inputRef.current)
    }
  }, [editing])


  // This resets the element when another element gets selected for editing.
  // This will reset the input to the state it was in prior to editing.
  useEffect(() => {
    if (currentFocus !== inputRef.current) {
      setEditing(false)
    }
  }, [currentFocus])


  // This puts the element in edit mode
  const editTitle = () => {
    setEditing(true)
  }

  // This submits the change to the server
  const submitTitle = async (e) => {
    e.preventDefault()
    setTitle(e.target[0].value)
    const response = await fetch('http://localhost:3000/api/update-column', {
      credentials: 'include',
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.columnId, name: e.target[0].value }),
    })
    console.log(response)
    setEditing(false)
  }

  // This handles the user cancelling the change if they press escape
  const handleKey = (e) => {
    if (e.key === 'Escape') {
      setTitle(title)
      setEditing(false)
    }
  }

  const loseFocus = () => {
    setEditing(false)
  }



  return (
    <div className="headerContainer" onMouseEnter={() => { if (!editing) { setHovering(true) } }} onMouseLeave={() => { setHovering(false) }} onClick={editTitle}>
      {editing ? (
        <form onSubmit={e => submitTitle(e)} onKeyDown={e => handleKey(e)}>
          <TextField
            inputRef={inputRef}
            size={'small'}
            variant="standard"
            className="editField"
            sx={{ input: { color: '#f5f5f5' } }}
            InputProps={{
              disableUnderline: true, // <== added this
              defaultValue: title
            }}
            onBlur={loseFocus}
            onSubmit={submitTitle}
            onChange={async (e) => {
              setTempTitle(e.target.value)
            }} />
        </form>
      ) : (<h2 className="boardTitle">{title}</h2>)
      }
      {hovering ? (<EditOutlined className="editButton" />) : (<></>)} </div >

  )
}

export default BoardHeading
