import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Tablas.css'
import './Home.css'

const Transfer = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/transfers/';

  const showData = async () => {
    try {
      const response = await fetch(URL);
      let data = await response.json();
      data = data.data
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    showData();
  }, []);

  const columns = [
    {
      name: 'ID',
      selector: (row) => <Link to={`/transfers/${row.id}`}>{row.id}</Link>,
    },
    {
      name: 'AMOUNT',
      selector: (row) => row.amount,
    },
    {
      name: 'MOTIVE',
      selector: (row) => row.motive,
    },
    {
      name: 'STATE',
      selector: (row) => row.state,
    },
    {
      name: 'TYPE',
      selector: (row) => row.type,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Transfer</h1>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
	      <div className="client-buttons">
        <Link to={`/transfers/create`} className="btn btn-success">Crear</Link>
        </div>
      </div>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Transfer;