import { EditOutlined } from "@mui/icons-material"
import { FormEvent, useEffect, useRef, useState } from "react"
import TextField from '@mui/material/TextField';
import { Board } from "../../types/types";

type BoardHeadingProps = {
  title: string;
  _id: string
  dragging: boolean;
  board: Board;
}

const BoardHeading = (props: BoardHeadingProps) => {
  const { dragging, _id, board } = props
  const [hovering, setHovering] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(props.title)
  const inputRef = useRef<HTMLInputElement>(null)

  // This refreshes the element when it goes into edit mode and sets the parent state
  // to accept this as the currently editing input
  useEffect(() => {
    setHovering(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])


  // This puts the element in edit mode
  const editTitle = () => {
    setEditing(true)
  }

  // This submits the change to the server
  // TODO: Change the form to use form data state and resolve typescript errors
  const submitTitle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e)
    if (e.target[0].value === "") {
      setEditing(false)
      return
    }
    setTitle(e.target[0].value)
    board.title = e.target[0].value
    await fetch('http://localhost:3000/api/update-column', {
      credentials: 'include',
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: _id, name: e.target[0].value }),
    })
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
    <div className="headerContainer" onMouseEnter={() => { if (!editing && !dragging) { setHovering(true) } }} onMouseLeave={() => { setHovering(false) }} onClick={editTitle}>
      {editing ? (
        <form onSubmit={e => submitTitle(e)} onKeyDown={e => handleKey(e)}>
          <TextField
            name="BoardName"
            inputRef={inputRef}
            // fontSize={'20px'}
            variant="standard"
            className="editField"
            sx={{ input: { color: '#f5f5f5', fontSize: '24px', fontFamily: 'var(--font-stylised)', fontWeight: '600' } }}
            InputProps={{
              disableUnderline: true,
              defaultValue: title
            }}
            onBlur={loseFocus}
          />
        </form>
      ) : (<h2 className="boardTitle">{title}</h2>)
      }
      {hovering ? (<EditOutlined className="editButton" />) : (<></>)} </div >

  )
}

export default BoardHeading
