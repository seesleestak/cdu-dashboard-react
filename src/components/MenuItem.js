import React from 'react'
import { Link } from 'react-router-dom'

export default function MenuItem({ name }) {
  return (
    <Link to={name} className="uppercase">
      {name}
    </Link>
  );
}
