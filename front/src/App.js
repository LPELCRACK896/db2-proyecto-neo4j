import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Fraude from './pages/Fraude';
import Client from './pages/Client';
import Footer from './components/Footer';
import Account from './pages/Account';
import Deposit from './pages/Deposit';
import FraudBehavior from './pages/FraudBehavior';
import Person from './pages/Person';
import Transfer from './pages/Transfer';
import Withdrawal from './pages/Withdrawal';
import SingleClient from './components/SingleClient';
import EditClient from './components/EditClient';
import EditPerson from './components/EditPerson';
import SinglePerson from './components/SinglePerson';

function App(){
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/fraude' element={<Fraude/>}/>
          <Route path='/client' element={<Client/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/deposit' element={<Deposit/>}/>
          <Route path='/fraudbehavior' element={<FraudBehavior/>}/>
          <Route path='/person' element={<Person/>}/>
          <Route path='/transfer' element={<Transfer/>}/>
          <Route path='/withdrawal' element={<Withdrawal/>}/>
          <Route path='/client/:id' element={<SingleClient/>}/>
          <Route path='/clients/:id/edit' element={<EditClient/>}/>
          <Route path='/persons/:id' element={<SinglePerson/>}/>
          <Route path='/persons/:id/edit' element={<EditPerson/>}/>       
        </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
