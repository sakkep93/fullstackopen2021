import React, { useState } from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}> {text} </button>

const StatisticLine = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>
const Statistics = (props) => {
    const {good, neutral, bad, all, avg, pos} = props

    if (all === 0) { return ( <div><p>No feedback given</p></div> ) }
    return (
        <div>
            <table>
                <tbody>
                    <StatisticLine text="good" value={good} />
                    <StatisticLine text="neutral" value={neutral} />
                    <StatisticLine text="bad" value={bad} />
                    <StatisticLine text="all" value={all} />
                    <StatisticLine text="average" value={avg} />
                    <StatisticLine text="positive" value={`${pos} %`} />
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setGoodToValue = newValue => { setGood(newValue) }
  const setNeutralToValue = newValue => { setNeutral(newValue) }
  const setBadToValue = newValue => { setBad(newValue) }

  /*
    "Sovelluksen tila säilytetään edelleen juurikomponentissa App" (1.10).
    Alla olevat muuttujat riippuvat good, neutral ja bad muuttujien tilasta,
    siksi laskutoimitukset juurikomponentissa. Mainittakoon, että aluksi jätin
    laskutoimitukset (all, avg, pos) Statistics komponentin vastuulle...
  */
  const all = good + neutral + bad
  const avg = (good + neutral*0 + bad * -1 ) / all
  const pos = (good / all) * 100

  return (
    <div>
        <h1>give feedback</h1>
        <Button handleClick={() => setGoodToValue(good+1)} text="good" />
        <Button handleClick={() => setNeutralToValue(neutral+1)} text="neutral" />
        <Button handleClick={() => setBadToValue(bad+1)} text="bad" />
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={avg} pos={pos} />
    </div>
  )
}

export default App
