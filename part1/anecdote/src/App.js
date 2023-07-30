import { useState } from 'react'


const Anecdote = ({text, votes}) =>
  <div>
    <p>{text}</p>
    <p>has {votes} votes</p>
  </div>

const Most = ({anecdotes, allVotes}) => {
  const highestVotes = Math.max(...allVotes)
  const mostIndex = allVotes.indexOf(highestVotes) //returns the position of the first occurrence of a value in a string
  const most = anecdotes[mostIndex]

  return (
    <div>
      <p>{most}</p>
      <p>has {highestVotes} votes</p>
    </div>
  )
}

const Button = ({ onClick, text }) =>
  <button onClick = {onClick}>{text}</button>

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

    const [selected, setSelected] = useState(0)
    const [allVotes, setAllVotes] = useState(Array(8).fill(0))
  
    const handleVoteClick = () => {
      const newAllVotes = [...allVotes]
      newAllVotes[selected] += 1
      setAllVotes(newAllVotes)
    }
  
    const handleAnecdoteClick = () => {
      const arrayIndex = Math.floor(Math.random() * anecdotes.length)
      setSelected(arrayIndex)
    }
  
    return (
      <div>
        <h1>Anecdote of the day</h1>
        <Anecdote votes = {allVotes[selected]} text = {anecdotes[selected]} />
        <Button onClick = {handleVoteClick} text = "vote"/>
        <Button onClick = {handleAnecdoteClick} text = "Next anecdote"/>
  
        <h1>Anecdote with most votes</h1>
        <Most anecdotes = {anecdotes} allVotes = {allVotes} />
      </div>
    )
  }


export default App
