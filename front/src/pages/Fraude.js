import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './Home.css';

const Fraude = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [fraudDetected, setFraudDetected] = useState(false);
  const [fraudData, setFraudData] = useState([]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleDetectFraud = async () => {
    try {
      setFraudDetected(true);

      let apiUrl = `http://localhost:5000/api/v1/frauds/${selectedOption.toLowerCase()}`;

      // Realizar la llamada al API para obtener los datos del fraude
      const response = await fetch(apiUrl);
      const data = await response.json();
      setFraudData(data.data);
    } catch (error) {
      console.error('Error al detectar el fraude:', error);
    }
  };

  useEffect(() => {
    // Realizar cualquier acción adicional al cargar el componente
  }, []);

  let columns = [
    {
      name: 'MOTIVE',
      selector: (row) => row.motive,
    },
    {
      name: 'ALERT LEVEL',
      selector: (row) => row.alert_level.low,
    },
  ];

  if (selectedOption === 'User') {
    columns = [
      {
        name: 'NAME',
        selector: (row) => row.name,
      },
      {
        name: 'NUM FRAUDS',
        selector: (row) => row.numFrauds,
      },
    ];
  }

  return (
    <div className="inicio-container">
      <h1 className="titulo">Fraude</h1>
      <div>
        <div>
          <label>
            <select value={selectedOption} onChange={handleOptionChange}>
              <option value="">Seleccione una opción</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Transfer">Transfer</option>
              <option value="Withdrawal">Withdrawal</option>
              <option value="Saldo">Saldo</option>
              <option value="Deposit">Deposit</option>
              <option value="User">User</option>
            </select>
          </label>
        </div>

        <button onClick={handleDetectFraud}>Detectar Fraude</button>

        {fraudDetected && (
          <div>
            <h3 className="letra">Resultado:</h3>
            <p className="letra">Fraude detectado.</p>
            <DataTable columns={columns} data={fraudData} pagination />
          </div>
        )}
      </div>
    </div>
  );
};

export default Fraude;
