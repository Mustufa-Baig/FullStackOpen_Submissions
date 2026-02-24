import {useState} from 'react'
import personService from '../services/persons'


const PersonForm = ({persons,setPersons,setMessage}) =>{
  const [newPerson,setNewPerson] = useState({name:'',number:'',id:''})

  const handleNameChange = (event) => {
    setNewPerson({...newPerson, name:event.target.value})
  }
  const handleNumberChange = (event) => {
    setNewPerson({...newPerson, number:event.target.value})
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson=persons.find((person) => person.name==newPerson.name)
    if (existingPerson){
      if(confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)){
        const personIndex=existingPerson.id
        const syncdPerson={...newPerson,id:personIndex}
        personService.update(personIndex,syncdPerson)
        .catch( error => {
          setMessage({text:`Information of ${newPerson.name} has already been removed from the server`,success:false})
          setPersons(persons.filter(p=> p.name!=newPerson.name))
          setTimeout(()=>{setMessage({text:null,success:null})},2000)
        })
        setPersons(persons.map(person => person.id===personIndex ? syncdPerson:person ))
      }
    }
    else{
      personService.create({name:newPerson.name,number:newPerson.number})
      .then(data=>{
        const syncdPerson={...newPerson,id:data.id}
        setNewPerson(syncdPerson)
        setPersons(persons.concat(syncdPerson))
        setMessage({text:`Added ${newPerson.name}`,success:true})
        setNewPerson({name:'',number:'',id:''})
        setTimeout(()=>{setMessage({text:null,success:null})},2000)
      })
    }
  }

  return(
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newPerson.name} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newPerson.number} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm