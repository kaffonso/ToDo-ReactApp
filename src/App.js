import React , { useState, useEffect } from 'react'

import api from './services/api'

import './styles/app.css'
import './styles/global.css'
import './styles/main.css'
import './styles/sidebar.css'

import Notes from './components/Notes'
import RadioButton from './components/RadioButton'

//componente = estrutura de codigo que retorna um html, css ou js
//propriedades = "props" informacoes passadas para componentes ( de pai para filho)
//estado = "state" funcao que armazena uma informacao e manipula  a mesma

function App() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [allNotes, setAllNotes] = useState([''])
  const [selectedValue, setSelectedValue] = useState('all')

  useEffect (() => {
    getAllNotes()
  }, [])
  
  async function handleDelete(id){
    const deleteNote = await api.delete(`/annotations/${id}`)
    
    if (deleteNote){
      setAllNotes(allNotes.filter(note => note._id !== id))
    }
  }
  
  async function getAllNotes() {
    const res = await api.get('/annotations')

    setAllNotes(res.data) 
  }

  async function handleChangePriority(id){
    const changedNote = await api.post(`/priorities/${id}`)

    if(changedNote){
      getAllNotes()
    }
  }

  async function handleSubmit(e){
    e.preventDefault();

    const res = await api.post('/annotations', {
      title,
      notes,
      priority: false
    })

    setTitle('');
    setNotes('');

    setAllNotes([...allNotes, res.data])
  }

  async function loadNotes(option){
    const params = { priority: option }

    const res =  await api.get('/priorities', {params})

    if (res){
      setAllNotes(res.data)
    }

  }

  async function handleChange(e){
    setSelectedValue(e.value)

    if (e.checked && e.value !== 'all'){
      loadNotes(e.value)
    } else {
      getAllNotes()
    }
  } 

  useEffect(() => {
    function enableSubmit(){
      let btn = document.getElementById('btn-submit');
      btn.style.background = '#FFD3CA'

      if(title && notes){
        btn.style.background = '#EB8F7A'
      }
    }
    enableSubmit()
  },[title, notes])

  return (
    <div id="app">
      <aside>
        <strong>Caderno de Notas</strong>
        <form onSubmit={handleSubmit}>
          <div className='input-block'>
            <label htmlFor="title">Titulo</label>
            <input 
              required 
              maxLength={30}
              value = {title} 
              onChange = { 
              e => setTitle(e.target.value)}/>
          </div>

          <div className='input-block'>
            <label htmlFor="note">Anotação</label>
            <textarea 
              required 
              value = {notes}
              onChange = { e => setNotes(e.target.value)}/>
          </div>

          <button id='btn-submit' type="submit">Salvar</button>
        </form>
        <RadioButton 
          selectedValue = {selectedValue}
          handleChange = {handleChange}/>
      </aside>

      <main>
        <ul>
          {allNotes.map(data => (
            <Notes 
            key={data.id}
            data = {data}
            handleDelete = {handleDelete}
            handleChangePriority = {handleChangePriority}/>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;