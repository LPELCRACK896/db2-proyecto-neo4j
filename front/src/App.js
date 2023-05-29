import './App.css';
import DataTable from 'react-data-table-component';
import 'styled-components'
import React, {useState, useEffect} from 'react'


const App = () => {


  const [users, setUsers] = useState ( [] )
  const URL = 'https://restcountries.com/v3.1/all'
  const showdata = async () => {
    const response = await fetch(URL)
    const data = await response.json()
    console.log(data)
    setUsers(data)
  }

  useEffect( ()=>{
    showdata()
  }, [])

  const columns = [
    {
      name: 'NOMBRE',
      selector : row => row.name.common
    },
    {
      name: 'CAPITAL',
      selector : row => row.capital
    },
    {
      name: 'REGION',
      selector : row => row.region
    }
  ]

  return (
    <div className="App">
      <h1>TABLA TEST</h1>
      <DataTable
        columns={columns}
        data={users}
        pagination
      /> 
    </div>
  );
}

export default App;
