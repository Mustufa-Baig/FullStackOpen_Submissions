import { useState } from 'react'

const StatisticLine = ({text,value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good,neutral,bad}) => {
  const all=good+bad+neutral
  const average=(good-bad)/all
  const positive=100*good /all

  if (all==0){
    return (<p>No Feedback given</p>)
  }
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good}/>
        <StatisticLine text="neutral" value={neutral}/>
        <StatisticLine text="bad" value={bad}/>

        <StatisticLine text="all" value={all}/>
        <StatisticLine text="average" value={average}/>
        <StatisticLine text="positive" value={`${positive}%`}/>
      </tbody>
    </table>
  )
}

const Button = ({onClick,text}) => {
  return (<button onClick={onClick}>{text}</button>)
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={ ()=>setGood(good+1) } text="good" />
      <Button onClick={ ()=>setNeutral(neutral+1) } text="neutral" />
      <Button onClick={ ()=>setBad(bad+1) } text="bad" />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App