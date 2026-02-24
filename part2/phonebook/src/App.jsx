import { useState,useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState({text:null,success:null})
  
  const [searchName, setSearchName] = useState('')
  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])


  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message}/>
      <Filter searchName={searchName} handleSearchNameChange={handleSearchNameChange}/>

      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage}/>

      <h2>Numbers</h2>
      <PersonList persons={persons} setPersons={setPersons} searchName={searchName}/>
    </div>
  )
}

export default App 