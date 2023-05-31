import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreateDeposit = () => {
  const [newDeposit, setNewDeposit] = useState({
    dpi: '',
    account_number: '',
    location: {
      x: '',
      y: '',
    },
    amount: '',
    motive: '',
    type: '',
  });

  const swalError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      footer: '<a href="/">Volver al inicio</a>',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeposit((prevDeposit) => ({
      ...prevDeposit,
      [name]: value,
    }));
  };

  const handleSaveDeposit = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/deposits', newDeposit);
      Swal.fire({
        icon: 'success',
        title: 'Depósito creado exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar el depósito');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Depósito</h1>
      <div className="client-info">
        <p>
          <strong>Amount:</strong>{' '}
          <input
            type="text"
            name="amount"
            value={newDeposit.amount}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Motive:</strong>{' '}
          <input
            type="text"
            name="motive"
            value={newDeposit.motive}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Location X:</strong>{' '}
          <input
            type="text"
            name="locationx"
            value={newDeposit.location.x}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Location Y:</strong>{' '}
          <input
            type="text"
            name="locationy"
            value={newDeposit.location.y}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI:</strong>{' '}
          <input
            type="text"
            name="id"
            value={newDeposit.dpi}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Account Number:</strong>{' '}
          <input
            type="text"
            name="state"
            value={newDeposit.account_number}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Type:</strong>{' '}
          <input
            type="text"
            name="type"
            value={newDeposit.type}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveDeposit}>Guardar Depósito</button>
        <Link to="/deposit" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateDeposit;
