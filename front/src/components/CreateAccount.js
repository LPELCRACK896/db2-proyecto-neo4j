import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreateAccount = () => {
  const [newAccount, setNewAccount] = useState({
    accountype: '',
    balance: '',
    expectedincomingpm: '',
    dpi: '',
    dpi_inh: '',
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
    setNewAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };

  const handleSaveAccount = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/accounts', newAccount);
      Swal.fire({
        icon: 'success',
        title: 'Cuenta creada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar la cuenta');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Cuenta</h1>
      <div className="client-info">
        <p>
          <strong>Account Type:</strong>{' '}
          <input
            type="text"
            name="accountype"
            value={newAccount.accountype}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Balance:</strong>{' '}
          <input
            type="text"
            name="balance"
            value={newAccount.balance}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Expected Incoming PM:</strong>{' '}
          <input
            type="text"
            name="expectedincomingpm"
            value={newAccount.expectedincomingpm}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI:</strong>{' '}
          <input
            type="text"
            name="state"
            value={newAccount.dpi}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI Heredero:</strong>{' '}
          <input
            type="text"
            name="create_date"
            value={newAccount.dpi_inh}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveAccount}>Guardar Cuenta</button>
        <Link to="/account" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateAccount;
