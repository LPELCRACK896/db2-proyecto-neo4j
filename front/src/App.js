import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Fraude from './pages/Fraude';
import Query from './pages/Query';
import Client from './pages/Client';
import Visualizacion from './pages/Visualizacion';
import Footer from './components/Footer';
import Account from './pages/Account';
import Deposit from './pages/Deposit';
import Fraud_Behavior from './pages/Fraud_Behavior';
import Person from './pages/Person';
import Transfer from './pages/Transfer';
import Withdrawal from './pages/Withdrawal';
import SingleClient from './components/SingleClient';

function App(){
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/fraude' element={<Fraude/>}/>
          <Route path='/query' element={<Query/>}/>
          <Route path='/client' element={<Client/>}/>
          <Route path='/visualizacion' element={<Visualizacion/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/deposit' element={<Deposit/>}/>
          <Route path='/fraudbehavior' element={<Fraud_Behavior/>}/>
          <Route path='/person' element={<Person/>}/>
          <Route path='/transfer' element={<Transfer/>}/>
          <Route path='/withdrawal' element={<Withdrawal/>}/>
          <Route path='/client/:id' element={<SingleClient/>}/>
        </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
