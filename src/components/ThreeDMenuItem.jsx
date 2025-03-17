import React from 'react';
import { Link } from 'react-router-dom';

const ThreeDMenuItem = ({ route }) => {
  return (
    <li>
      <Link to={route.path} className="three-d">
        {route.name}
        <span aria-hidden="true" className="three-d-box">
          <span className="front">{route.name}</span>
          <span className="back">{route.name}</span>
        </span>
      </Link>
    </li>
  );
};

export default ThreeDMenuItem;
