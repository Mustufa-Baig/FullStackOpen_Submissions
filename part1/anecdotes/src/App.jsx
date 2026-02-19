import { useState } from 'react'

const TopAnecdote = (props) => {
  if (props.top.votes>0){
    return (
      <>
        <h2>Anecdote with most votes</h2>
        <p>{props.anecdotes[props.top.index]}</p>
        <p>has {props.top.votes} votes</p>
      </>
    )
  }
  return (<></>)
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [highest,setHighest] = useState({index:0,votes:0})
  const [votes,setVotes] = useState(new Uint8Array(anecdotes.length))

  const nextAnecdote = ()=> { setSelected(Math.floor(Math.random()*anecdotes.length)) }
  function upvote(index){ 
    const copy=[...votes]
    copy[index]+=1
    setVotes(copy)

    if (copy[index]>highest.votes){
      setHighest({index:index,votes:copy[index]})
    }
  }


  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={()=>upvote(selected)}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>

      <TopAnecdote top={highest} anecdotes={anecdotes} />

    </div>
  )
}

export default App