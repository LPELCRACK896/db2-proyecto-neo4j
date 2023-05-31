import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreateClient = () => {
  const [newClient, setNewClient] = useState({
    name: '',
    nit: '',
    average_income_pm: '',
    dpi: '',
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
    setNewClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleSaveClient = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/clients', newClient);
      Swal.fire({
        icon: 'success',
        title: 'Cliente creado exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar el cliente');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Cliente</h1>
      <div className="client-info">
        <p>
          <strong>Name:</strong>{' '}
          <input
            type="text"
            name="name"
            value={newClient.name}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Nit:</strong>{' '}
          <input
            type="text"
            name="nit"
            value={newClient.nit}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Average Income PM:</strong>{' '}
          <input
            type="text"
            name="average_income_pm"
            value={newClient.average_income_pm}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI:</strong>{' '}
          <input
            type="text"
            name="dpi"
            value={newClient.dpi}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveClient}>Guardar Cliente</button>
        <Link to="/client" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateClient;
