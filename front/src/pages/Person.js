import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import './Tablas.css'
import { Link } from 'react-router-dom';

const Person = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/persons/';

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
      name: 'TYPE',
      selector: (row) => row.type,
    },
    {
      name: 'NAME',
      selector: (row) => <Link to={row.type === 'Person' ? `/persons/${row.dpi.low}` : `/client/${row.dpi.low}` }>{row.name}</Link>,
    },
    {
      name: 'DPI',
      selector: (row) => row.dpi.low,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Person</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Person;
