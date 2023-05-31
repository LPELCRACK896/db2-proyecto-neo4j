import React, { useState } from 'react';
import './Home.css'

const Query = () => {

  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleQuerySubmit = () => {
    // Aquí puedes realizar alguna acción con la query, como enviarla a un servidor o procesarla localmente
    console.log(query);
  };
  
  return (
    <div className="inicio-container">
      <h1 className="titulo">Query</h1>
      <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <button onClick={handleQuerySubmit}>Enviar</button>
    </div>
    </div>
  )
}

export default Query;
