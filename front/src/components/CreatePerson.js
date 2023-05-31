import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../pages/Home.css';
import Swal from 'sweetalert2';

const CreatePerson = () => {
  const [newPerson, setNewPerson] = useState({
    name: '',
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
    setNewPerson((prevPerson) => ({
      ...prevPerson,
      [name]: value,
    }));
  };

  const handleSavePerson = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/persons', newPerson);
      Swal.fire({
        icon: 'success',
        title: 'Persona creada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
      // Redireccionar a la vista anterior
      // window.history.back(); // Opción 1: Usar la función back del navegador
    } catch (err) {
      swalError('Hubo un problema al guardar la persona');
      console.log(err);
    }
  };

  return (
    <div className="single-client-container">
      <h1 className="client-title">Crear Persona</h1>
      <div className="client-info">
        <p>
          <strong>Name:</strong>{' '}
          <input
            type="text"
            name="name"
            value={newPerson.name}
            onChange={handleInputChange}
          />
        </p>
        <p>
          <strong>DPI:</strong>{' '}
          <input
            type="text"
            name="dpi"
            value={newPerson.dpi}
            onChange={handleInputChange}
          />
        </p>
      </div>
      <div className="client-buttons">
        <button onClick={handleSavePerson}>Guardar Persona</button>
        <Link to="/person" className="cancel-button">
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreatePerson;
