import React from 'react'

const Header = ({ name }) => <h1>{name}</h1>
const Part = ({ part }) => <li>{part.name} {part.exercises}</li>
const Total = ({ parts }) => {
    const total = parts.reduce( (s, p) => s + p.exercises, 0)
    return (
        <p><b>total of {total} exercises</b></p>
    )
}
const Content = ({ parts }) => {
    return (
        <div>
            <ul>
                {parts.map(p =>
                    <Part key={p.id} part={p} />
                )}
            </ul>
            <Total parts={parts} />
        </div>
    )
}

const Course = ({course}) => {
    return (
        <div>
            <Header name={course.name} />
            <Content parts={course.parts} />
        </div>
    )
}

export default Course
