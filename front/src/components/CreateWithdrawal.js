import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreateWithdrawal = () => {
  const [newWithdrawal, setNewWithdrawal] = useState({
    amount: '',
    motive: '',
    location: {
      x: '',
      y: '',
    },
    account_number: '',
    dpi: '',
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
    setNewWithdrawal((prevWithdrawal) => ({
      ...prevWithdrawal,
      [name]: value,
    }));
  };

  const handleSaveWithdrawal = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/withdrawals', newWithdrawal);
      Swal.fire({
        icon: 'success',
        title: 'Retiro creado exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar el retiro');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Retiro</h1>
      <div className="client-info">
        <p>
          <strong>Amount:</strong>{' '}
          <input
            type="text"
            name="amount"
            value={newWithdrawal.amount}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Motive:</strong>{' '}
          <input
            type="text"
            name="motive"
            value={newWithdrawal.motive}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Location X:</strong>{' '}
          <input
            type="text"
            name="locationx"
            value={newWithdrawal.location.x}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Location Y:</strong>{' '}
          <input
            type="text"
            name="locationy"
            value={newWithdrawal.location.y}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI:</strong>{' '}
          <input
            type="text"
            name="id"
            value={newWithdrawal.dpi}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Account Number:</strong>{' '}
          <input
            type="text"
            name="state"
            value={newWithdrawal.account_number}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Type:</strong>{' '}
          <input
            type="text"
            name="type"
            value={newWithdrawal.type}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveWithdrawal}>Guardar Retiro</button>
        <Link to="/withdrawal" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateWithdrawal;
