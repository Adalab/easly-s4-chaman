import React, { Component } from 'react';
import './Footer.scss';
import accenture from '../../icons/accenture.png'

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <a target="blank" href="https://www.accenture.com/es-es/service-liquid-squad-accenture-digital">
                    <img className="logo-footer" src={accenture}
                        alt="logo-accenture" />
                </a>

                <a className="copy-link" target="blank" href="https://www.iconfinder.com/Neolau1119"><small className="copyright-footer">© Yun Liu</small></a>

            </div>
        );
    }
}

export default Footer;
