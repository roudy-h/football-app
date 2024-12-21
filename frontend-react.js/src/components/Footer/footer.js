import React from 'react';
import "./footer.css"

/**
 * Composant Footer : affiche le footer du site
 * @returns {Element}
 * @constructor
 */
const Footer = () => {
  return (
    <footer className='footer'>
      <div className='container'>
        <p className='text'>© 2024 Site Football réalisé par Roudy, Swann, Elouan, Nathan et Titouan </p>
      </div>
    </footer>
  );
};

export default Footer;