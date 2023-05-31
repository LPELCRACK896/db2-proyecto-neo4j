import React, { useState } from 'react';
import './Home.css'

const Fraude = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [fraudDetected, setFraudDetected] = useState(false);
  const [additionalData, setAdditionalData] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleDetectFraud = () => {
    // Aquí puedes realizar la lógica para detectar el fraude según las opciones seleccionadas
    // y obtener los datos adicionales desde la base de datos
    // Por ahora, simplemente estableceremos los valores de ejemplo

    setFraudDetected(true);
    setAdditionalData('Datos adicionales sobre el fraude detectado');
  };
  return (
    <div className="inicio-container">
      <h1 className="titulo">Fraude</h1>
      <div>
      <div>
        <label>
          Opción:
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="">Seleccione una opción</option>
            <option value="Account">Transferencia</option>
            <option value="Client">Cliente</option>
            <option value="Deposit">Deposit</option>
            <option value="Person">Person</option>
            <option value="Transfer">Transfer</option>
            <option value="Withdrawal">Withdrawal</option>
          </select>
        </label>
      </div>

      <button onClick={handleDetectFraud}>Detectar Fraude</button>

      {fraudDetected && (
        <div>
          <h3 className="letra">Resultado:</h3>
          <p className="letra">Fraude detectado.</p>
          <p className="letra">{additionalData}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Fraude