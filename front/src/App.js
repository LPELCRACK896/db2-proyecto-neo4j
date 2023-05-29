import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Fraude from './pages/Fraude';
import Diseño from './pages/Diseño';
import Base from './pages/Base';
import Footer from './components/Footer';

function App(){
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path='/fraude' element={<Fraude/>}/>
          <Route path='/diseño' element={<Diseño/>}/>
          <Route path='/base' element={<Base/>}/>
        </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
