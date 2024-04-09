import React from 'react'
import { useState } from 'react'
import './Accordion.css'

function Accordion() {

  const [selected, setSelected] = useState(null);
  const toggle = (index) => {
    if (selected === index) {
      return setSelected(null)
    }

    setSelected(index)
  }
  return (
    <>
      <h1 className='headingq'>Frequently Asked Questions</h1>
      <div className='wrapper'>
        <div className='accordion'>
          {data.map((item, index) => (
            <div className='item'>
              <div className='title' onClick={() => toggle(index)}>
                <h2>{item.question}</h2>
                <span>{selected === index ? '-' : '+'}</span>
              </div>
              <div className={selected === index ? 'content show' : 'content'}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const data = [{
  question: 'How to set up my calendar',
  answer: 'click the "+" sign'
},
{
  question: 'How can I change the template?',
  answer: 'click the "+" sign'
}]

export default Accordion
