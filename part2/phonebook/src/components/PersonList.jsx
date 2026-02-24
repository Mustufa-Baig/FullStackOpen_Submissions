import {useState} from 'react'
import personService from '../services/persons'

const Person = ({person,deletePerson}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={()=>deletePerson(person)}>Delete</button>
    </div>
  )
}


const PersonList = ({persons,setPersons,searchName}) =>{

  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name} ?`)){
      personService.Delete(person.id)
      .then(response =>{
        console.log(person.name,'deleted')
        setPersons(persons.filter(p=> p.id!=person.id))
      })
    }
  }
  
  return(
    <>
      {persons.filter((person) => person.name.toLowerCase().includes(searchName.toLowerCase()))
      .map(person => <Person key={person.name} person={person} deletePerson={deletePerson}/>)}
    </>
  )
}

export default PersonList