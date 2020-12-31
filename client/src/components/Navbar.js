import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    };
    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
                <a href="/" className="brand-logo">Мой fullStack сайт, ни*уя себе</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Обо мне че-нить</NavLink></li>
                    <li><NavLink to="/links">Здесь сслыки всякие</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>ну да, пошел я наахер</a></li>
                </ul>
            </div>
        </nav>
    )
}