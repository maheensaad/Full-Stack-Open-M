import React from 'react'

const Total = ({parts}) => {
  const total = parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <h4>Total of {total} exercises</h4>
    )
  }

export default Total