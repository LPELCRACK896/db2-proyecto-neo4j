import React, { useState } from 'react';
import './Home.css'

const Fraude = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedSubOption, setSelectedSubOption] = useState('');
  const [fraudDetected, setFraudDetected] = useState(false);
  const [additionalData, setAdditionalData] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedSubOption('');
  };

  const handleSubOptionChange = (event) => {
    setSelectedSubOption(event.target.value);
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
            <option value="Deposit">Cuenta</option>
            <option value="Person">Cuenta</option>
            <option value="Transfer">Cuenta</option>
            <option value="Withdrawal">Cuenta</option>
            <option value="Todo">Todo</option>
          </select>
        </label>
      </div>

      {selectedOption && (
        <div>
          <label>
            Subopción:
            <select value={selectedSubOption} onChange={handleSubOptionChange}>
              <option value="">Seleccione una subopción</option>
              {selectedOption === 'transferencia' && (
                <>
                  <option value="opcion1">Opción 1</option>
                  <option value="opcion2">Opción 2</option>
                  <option value="opcion3">Opción 3</option>
                </>
              )}
              {selectedOption === 'cliente' && (
                <>
                  <option value="opcion4">Opción 4</option>
                  <option value="opcion5">Opción 5</option>
                  <option value="opcion6">Opción 6</option>
                </>
              )}
              {selectedOption === 'cuenta' && (
                <>
                  <option value="opcion7">Opción 7</option>
                  <option value="opcion8">Opción 8</option>
                  <option value="opcion9">Opción 9</option>
                </>
              )}
              {selectedOption === 'todo' && (
                <>
                  <option value="opcion10">Opción 10</option>
                  <option value="opcion11">Opción 11</option>
                  <option value="opcion12">Opción 12</option>
                </>
              )}
            </select>
          </label>
        </div>
      )}

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