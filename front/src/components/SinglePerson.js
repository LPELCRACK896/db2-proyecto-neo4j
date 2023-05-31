import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import '../pages/Home.css';
import Swal from 'sweetalert2';

const SinglePerson = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  const swalError = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      footer: '<a href="/">Back to main</a>'
    });
  };

  const getClient = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/persons/${id}`);
      const data = res.data;

      if (!data.data) {
        swalError("No se encontró una cuenta con el ID ingresado");
        return;
      }

      setClient(data.data);
    } catch (err) {
      swalError("Hubo un problema en la búsqueda de la cuenta");
      console.log(err);
    }
  };

  const handleDelete = () =>{
    //Delete
  }

  useEffect(() => {
    if (id) {
      getClient();
    } else {
      swalError("Hubo un problema al obtener el ID de la cuenta desde la URL ingresada");
    }
  }, []);

  if (!client) {
    return null; // Mostrar un loader o mensaje de carga mientras se obtiene la información del cliente
  }

  return (
    <div className="single-client-container">
      <h1 className="client-title">{client.name}</h1>
      <div className="client-buttons">
        <Link to={`/persons/${id}/edit`} className="edit-button-person">Editar</Link>
        <button onClick={handleDelete} className="delete-button-person">Eliminar</button>
      </div>
      <div className="client-info">
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Type:</strong> {client.type}</p>
        <p><strong>DPI:</strong> {client.dpi.low}</p>
      </div>
    </div>
  );
};

export default SinglePerson;