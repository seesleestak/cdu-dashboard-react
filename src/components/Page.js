import React from 'react'

export default function Page({ children, ...rest }) {
  return (
    <div className="pg" {...rest}>
      {children}
    </div>
  );
}
