import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import '../pages/Home.css';
import Swal from 'sweetalert2';

const SingleClient = () => {
    const {id} = useParams()
    const [client, setClient] = useState(null);
    const swalError = (message) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: message,
          footer: '<a href="/">Back to main</Link>'
        });
      };
    const getClient = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/v1/clients/${id}`);
          const data = res.data;
          console.log(data.data)
    
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
    
      useEffect(() => {
        if (id) {
          getClient();
        } else {
          swalError("Hubo un problema al obtener el ID de la cuenta desde la URL ingresada");
        }
      }, []);
    
  
  
    return (
    <div>SingleClient</div>
  )
}

export default SingleClient