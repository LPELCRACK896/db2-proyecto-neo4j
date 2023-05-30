import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import './Home.css';
import Swal from 'sweetalert2';

const Visualizacion = () => {
    const [account, setAccount] = useState(null);
    const [person, setPerson] = useState(null);
    const [client, setClient] = useState(null);
    const [fraudbehavior, setFraudBehavior] = useState(null);
    const [deposit, setDeposit] = useState(null);
    const [withdrawal, setWithdrawalt] = useState(null);
    const [transfer, setTransfer] = useState(null);

    const [popUp, setPopUp] = useState(false);
    
  
    const { id } = useParams();
  
    const swalError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
        footer: '<a href="/">Back to main</Link>'
      });
    };
  
    const getAccount = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/clients/${id}`);
        const data = res.data;
  
        if (!data.success || !data.data) {
          swalError("No se encontró una cuenta con el ID ingresado");
          return;
        }
  
        setAccount(data.data);
      } catch (err) {
        swalError("Hubo un problema en la búsqueda de la cuenta");
        console.log(err);
      }
    };
  
    useEffect(() => {
      if (id) {
        getAccount();
      } else {
        swalError("Hubo un problema al obtener el ID de la cuenta desde la URL ingresada");
      }
    }, []);


    return (
    <div className="inicio-container">
      <h1 className="titulo">Visualizacion</h1>
    </div>
  );
}

export default Visualizacion;