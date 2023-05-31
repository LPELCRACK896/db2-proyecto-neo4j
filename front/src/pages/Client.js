import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Tablas.css'

const Client = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/clients/';

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
      name: 'NAME',
      selector: (row) => <Link to={`/client/${row.dpi.low}`}>{row.name}</Link>,
    },
    {
      name: 'PHONE',
      selector: (row) => row.phone,
    },
    {
      name: 'BIRTHDATE',
      selector: (row) => row.birthdate,
    },
    {
      name: 'OCUPATION',
      selector: (row) => row.ocupation,
    },
    {
      name: 'ADDRESSS',
      selector: (row) => row.address,
    },
    {
      name: 'NIT',
      selector: (row) => row.nit.low,
    },
    {
      name: 'DPI',
      selector: (row) => row.dpi.low,
    },
    {
      name: 'AVERAGE INCOME PM',
      selector: (row) => row.average_income_pm,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Client</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Client;
