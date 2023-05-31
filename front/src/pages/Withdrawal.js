import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import './Tablas.css'
import { Link } from 'react-router-dom';

const Withdrawal = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/withdrawals/';

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
      name: 'AMOUNT',
      selector: (row) => row.amount,
    },
    {
      name: 'MOTIVE',
      selector: (row) => row.motive,
    },
    {
      name: 'LOCATION',
      selector: (row) => `x = ${row.location.x}, y = ${row.location.y} `
    },
    {
      name: 'ID',
      selector: (row) => <Link to={`/withdrawals/${row.id}`}>{row.id}</Link>,
    },
    {
      name: 'State',
      selector: (row) => row.state,
    },
    {
      name: 'Type',
      selector: (row) => row.type,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Withdrawal</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Withdrawal;
