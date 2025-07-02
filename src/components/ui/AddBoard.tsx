import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import './AddBoard.css'
import { TextField } from '@mui/material';

type AddBoardProps = {
  currentFocus: HTMLInputElement | null;
  setCurrentFocus: (e: HTMLInputElement) => void;
  setBoards: (e) => void;
  boards: unknown[]
}

const AddBoard = (props: AddBoardProps) => {
  const { currentFocus, setCurrentFocus, setBoards, boards } = props
  const [creatingNew, setCreatingNew] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      setCurrentFocus(inputRef.current)
    }
  }, [creatingNew])

  const createNewStage = () => {
    setCreatingNew(true)
  }

  const submitNew = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newStageTitle: string = e.target[0].value
    try {
      const response = await fetch('http://localhost:3000/api/create-column', {
        credentials: 'include',
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newStageTitle })
      })
      if (response.status === 200) {
        const result = await response.json()
        const newStatus = result.status
        setCreatingNew(false)
        setBoards([...boards, { ...newStatus, opportunities: [] }])
      } else {
        throw new Error('Unable to create New Stage')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Escape') {
      setCreatingNew(false)
    }
  }

  return (
    <div className="addBoardContainer" onClick={createNewStage} >
      {creatingNew ? (
        <form onSubmit={e => submitNew(e)} onKeyDown={e => handleKey(e)}>
          <TextField
            inputRef={inputRef}
            size={'small'}
            variant="standard"
            className="editField"
            sx={{ input: { color: '#f5f5f5' } }}
            InputProps={{
              disableUnderline: true
            }}
            onBlur={() => { setCreatingNew(false) }}
          //onSubmit={submitTitle}
          /*onChange={async (e) => {
            setTempTitle(e.target.value)
          }}*/ />
        </form>
      ) : (<h3 className="addBoardText">New Stage <strong>+</strong></h3>)}
    </div >
  )

}

export default AddBoard;
