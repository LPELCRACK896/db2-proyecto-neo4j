import DataTable from 'react-data-table-component';
import React, { useState, useEffect } from 'react';
import './Tablas.css'
import { Link } from 'react-router-dom';


const Account = () => {
  const [users, setUsers] = useState([]);

  const URL = 'http://localhost:5000/api/v1/accounts/';

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
      name: 'NUMBER',
      selector: (row) => <Link to={`/accounts/${row.number}`}>{row.number}</Link>,
    },
    {
      name: 'ACCOUNT TYPE',
      selector: (row) => row.account_type,
    },
    {
      name: 'BALANCE',
      selector: (row) => row.balance,
    },
    {
      name: 'EXPECTED INCOMING PM',
      selector: (row) => row.expected_incoming_pm,
    },
    {
      name: 'STATE',
      selector: (row) => row.state,
    },
    {
      name: 'CREATE DATE',
      selector: (row) => row.create_date,
    },
    {
      name: 'CLOSING DATE',
      selector: (row) => row.closing_date,
    },
  ];

  return (
    <div className="inicio-container">
      <h1 className="titulo">Account</h1>
      <DataTable columns={columns} data={users} pagination />
    </div>
  );
};

export default Account;
