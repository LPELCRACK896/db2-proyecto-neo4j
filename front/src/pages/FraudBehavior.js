import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import './Tablas.css'
import './Home.css'

const Fraud_Behavior = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/fraud/';

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
      name: 'OCCUPATION',
      selector: (row) => row.occupation,
    },
    {
      name: 'ADDRESS',
      selector: (row) => row.address,
    },
    {
      name: 'BIRTHDATE',
      selector: (row) => row.birthdate,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Fraud Behavior</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Fraud_Behavior;
