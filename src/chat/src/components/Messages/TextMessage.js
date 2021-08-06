import React from 'react'
import { NavLink } from 'react-bootstrap'

const TextMessage = (props) => {
  if (props.author === 'me') {
    return (
      <div className="sc-message--text">
        <NavLink target="_blank" style={{ color: 'black' }}>
          {props.data.text}
        </NavLink>
        <NavLink style={{ color: 'black', fontSize: '10px' }}>
          {'Yo\n'}
          {props.fecha}
        </NavLink>
        {/*
        <Button size="sm" style={{ backgroundColor: 'transparent' }} variant="outline-danger">
          <FaTrash />
        </Button>
        */}
      </div>
    )
  } else {
    return (
      <div className="sc-message--text">
        <NavLink target="_blank" style={{ color: 'black' }}>
          {props.data.text}
        </NavLink>
        <NavLink style={{ color: 'black', fontSize: '10px' }}>
          {props.author}
          {'\n'}
          {props.fecha}
        </NavLink>
        {/*
        <Button size="sm" style={{ backgroundColor: 'transparent' }} variant="outline-danger">
          <FaTrash />
        </Button>
        */}
      </div>
    )
  }
}

export default TextMessage
