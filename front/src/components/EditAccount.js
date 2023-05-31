import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const EditAccount = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [editedClient, setEditedClient] = useState(null);

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
    setEditedClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/v1/accounts/${id}`, editedClient);
      Swal.fire({
        icon: 'success',
        title: 'Cambios guardados',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar los cambios');
      console.log(err);
    }
  };

  useEffect(() => {
    const getClient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/accounts/${id}`);
        const data = res.data;

        if (!data.data) {
          swalError('No se encontró una cuenta con el ID ingresado');
          return;
        }

        setClient(data.data);
        setEditedClient(data.data);
      } catch (err) {
        swalError('Hubo un problema en la búsqueda de la cuenta');
        console.log(err);
      }
    };

    if (id) {
      getClient();
    } else {
      swalError('Hubo un problema al obtener el ID de la cuenta desde la URL ingresada');
    }
  }, [id]);

  if (!client) {
    return null; // Mostrar un loader o mensaje de carga mientras se obtiene la información del cliente
  }

  return (
    <div className="single-client-container">
      <h1 className="client-title">{client.name}</h1>
      <div className="client-info">
        <p>
          <strong>Number:</strong>{' '}
          <input
            type="text"
            name="number"
            value={editedClient.number}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Closing Date:</strong>{' '}
          <input
            type="text"
            name="closingdate"
            value={editedClient.closing_date}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Account Type:</strong>{' '}
          <input
            type="text"
            name="accountype"
            value={editedClient.account_type}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Balance:</strong>{' '}
          <input
            type="text"
            name="balance"
            value={editedClient.balance}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Expected Incoming PM:</strong>{' '}
          <input
            type="text"
            name="expectedincomingpm"
            value={editedClient.expected_incoming_pm}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>State:</strong>{' '}
          <input
            type="text"
            name="nit"
            value={editedClient.state}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>Create Date:</strong>{' '}
          <input
            type="text"
            name="average_income_pm"
            value={editedClient.create_date}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSaveChanges}>Guardar Cambios</button>
        <Link to={`/accounts/${id}`} className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default EditAccount;