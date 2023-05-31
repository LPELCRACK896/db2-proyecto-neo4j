import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreateTransfer = () => {
  const [newTransfer, setNewTransfer] = useState({
    amount: '',
    motive: '',
    number_origin: '',
    number_destiny: '',
    type: ''
  });

  const swalError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      footer: '<a href="/">Back to main</a>',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransfer((prevTransfer) => ({
      ...prevTransfer,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
        await axios.post('http://localhost:5000/api/v1/transfers', newTransfer);
    
    Swal.fire({
        icon: 'success',
        title: 'Transferencia creada',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista deseada
    } catch (err) {
      swalError('Hubo un problema al crear la transferencia');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Transferencia</h1>
      <div className="client-info">
        <p>
          <strong>Amount:</strong>{' '}
          <input
            type="text"
            name="amount"
            value={newTransfer.amount}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Motive:</strong>{' '}
          <input
            type="text"
            name="motive"
            value={newTransfer.motive}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Type:</strong>{' '}
          <input
            type="text"
            name="type"
            value={newTransfer.type}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Cuenta Origen:</strong>{' '}
          <input
            type="text"
            name="number_origin"
            value={newTransfer.number_origin}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Cuenta Destino:</strong>{' '}
          <input
            type="text"
            name="number_destiny"
            value={newTransfer.number_destiny}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveChanges}>Crear Transferencia</button>
        <Link to="/transfer" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateTransfer;
