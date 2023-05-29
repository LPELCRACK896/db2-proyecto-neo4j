import { Link } from 'react-router-dom';
import logo from '../components/logo_trans.png';
import './Home.css';

const Home = () => {
  return (
    <div className="inicio-container">
      <h1 className="titulo">CrossHair FrauD</h1>
      <img src={logo} alt="Logo" className="logo-rotating" />
      <Link to="/fraude" className="btn-empezar">Empezar</Link>
    </div>
  );
}

export default Home;
