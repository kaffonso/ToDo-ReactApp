import React , { useState } from "react";
import { AiOutlineExclamationCircle , AiTwotoneDelete} from 'react-icons/ai'
import api from "../../services/api";
import './styles.css'
import './styles-priority.css'


function Notes({data, handleDelete, handleChangePriority}){
  const [changedNote, setChangedNote] = useState(' ')

  async function handleSave(e, notes){
    e.style.cursor = 'default'
    e.style.border = '0px'
    if(changedNote && changedNote !== notes){
      await api.post(`/content/${data._id}`,{
        notes : changedNote} 
      )
    } 
  }

  async function handleEdit(e, priority){
    e.style.cursor = 'text'

    if (priority === true){
      e.style.borderLeft = '1px solid #fabbad'
    } else {
      e.style.borderLeft = '1px solid #acacac'
    }
  }

  return(
    <>
      <li className={data.priority ? "notepad-infos-priority" : "notepad-infos"}> 
        <div>
          <strong>{data.title}</strong>
          <div onClick={() => handleDelete(data._id)}>
            < AiTwotoneDelete size="20"/> 
          </div>
        </div>
        <textarea 
          defaultValue = {data.notes}
          onClick= {e => handleEdit(e.target, data.priority)}
          onChange = {e => setChangedNote(e.target.value)}
          onBlur = {e => handleSave(e.target, data.notes)}/>
        <span onClick={() => handleChangePriority(data._id)}> 
          <AiOutlineExclamationCircle size="20"/> 
        </span>
      </li>
    </>
  )
}

export default Notes