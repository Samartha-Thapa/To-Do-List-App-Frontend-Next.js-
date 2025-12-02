"use client"

import Calendar from 'react-calendar';
import React, { useState } from 'react'

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece]

const CalendarForm = () => {
      const [value, onChange] = useState<Value>(new Date());
  return (
    <Calendar 
            onChange={onChange} 
            value={value} 
            className="rounded-2xl shadow-lg p-4 border border-gray-200"
          />
  )
}

export default CalendarForm