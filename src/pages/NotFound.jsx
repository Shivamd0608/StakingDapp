import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="connect-message">
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</h1>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
