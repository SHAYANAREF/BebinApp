import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faHome, faCogs, faBriefcase, faBlog, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './CustomNavbar.css';

const CustomNavbar = () => {
  const [activeTab, setActiveTab] = useState('');
  const [selectorStyle, setSelectorStyle] = useState({});
  const navbarRef = useRef(null);
  const horiSelectorRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop() || '/';
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    recalculateSelectorStyle(activeTab);
  }, [activeTab]);

  const recalculateSelectorStyle = (tabName) => {
    if (!navbarRef.current) return;

    const activeItem = navbarRef.current.querySelector(`[href='${tabName}']`);

    if (activeItem) {
      const activeItemRect = activeItem.getBoundingClientRect();
      const navbarRect = navbarRef.current.getBoundingClientRect();

      setSelectorStyle({
        top: activeItemRect.top - navbarRect.top + 'px',
        left: activeItemRect.left - navbarRect.left + 'px',
        height: activeItemRect.height + 'px',
        width: activeItemRect.width + 'px',
      });
    }
  };

  const handleNavbarClick = (e) => {
    if (e.target.tagName === 'A') {
      setActiveTab(e.target.getAttribute('href'));

      if (navbarRef.current) {
        const navbarCollapse = navbarRef.current.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const navbarToggler = navbarRef.current.querySelector('.navbar-toggler');
          if (navbarToggler) {
            navbarToggler.click(); // Simulate click to close the navbar
          }
        }
      }
    }
  };

  const colors = ['#00f0ff', '#d400ff'];
  const text = "bebin.app";
  const coloredText = text.split('').map((char, index) => (
    <span key={index} style={{ color: colors[index % colors.length] }}>{char}</span>
  ));

  return (
    <nav className="navbar navbar-expand-custom navbar-mainbg" ref={navbarRef}>
      <Link className="navbar-brand" to="/">
        <span className="navbar-brand-text">{coloredText}</span>
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <div className="hori-selector" style={selectorStyle} ref={horiSelectorRef}>
            <div className="left"></div>
            <div className="right"></div>
          </div>
          <li className="nav-item">
            <Link className={`nav-link text-neonBlue ${activeTab === '/' ? 'active' : ''}`} to="/" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonPurple ${activeTab === 'about' ? 'active' : ''}`} to="/about" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faInfoCircle} /> About
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonBlue ${activeTab === 'services' ? 'active' : ''}`} to="/services" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faCogs} /> Services
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonPurple ${activeTab === 'portfolio' ? 'active' : ''}`} to="/portfolio" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faBriefcase} /> Portfolio
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle text-neonBlue" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleNavbarClick}>
              VR Content
            </Link>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className={`dropdown-item text-neonPurple ${activeTab === 'ar' ? 'active' : ''}`} to="/ar" onClick={handleNavbarClick}>AR Scene</Link>
              <Link className={`dropdown-item text-neonBlue ${activeTab === 'shop' ? 'active' : ''}`} to="/shop" onClick={handleNavbarClick}>Shop</Link>
            </div>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonPurple ${activeTab === 'ai-content-generator' ? 'active' : ''}`} to="/ai-content-generator" onClick={handleNavbarClick}>
              AI Content
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonBlue ${activeTab === 'blog' ? 'active' : ''}`} to="/blog" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faBlog} /> Blog
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link text-neonPurple ${activeTab === 'contact' ? 'active' : ''}`} to="/contact" onClick={handleNavbarClick}>
              <FontAwesomeIcon icon={faEnvelope} /> Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default CustomNavbar;
