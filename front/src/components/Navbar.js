import React from 'react'
import Logo from './logo_gris.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
    <div className="container-fluid">
        <Link className="navbar-brand" to="#">
            <img src={Logo} alt="Logo" width="30" height="28" className="d-inline-block align-text-top"/>
            CrosshairFraud
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
            <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to ='/home'>Home</Link>
            </li>
            <li className="nav-item">
            <Link className="nav-link" to ='/fraude'>Fraude</Link>
            </li>
            <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to ='/ref' role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Base de Datos
            </Link>
            <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to ='/client'>Client</Link></li>
                <li><Link className="dropdown-item" to ='/person'>Person</Link></li>
                <li><Link className="dropdown-item" to ='/account'>Account</Link></li>
                <li><Link className="dropdown-item" to ='/fraudbehavior'>Fraud Behavior</Link></li>
                <li><Link className="dropdown-item" to ='/deposit'>Deposit</Link></li>
                <li><Link className="dropdown-item" to ='/withdrawal'>Withdrawal</Link></li>
                <li><Link className="dropdown-item" to ='/transfer'>Transfer</Link></li>
            </ul>
            </li>
        </ul>
        </div>
    </div>
    </nav>
    
    </>
  )
}

export default Navbar
