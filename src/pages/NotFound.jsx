// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl mb-4">404</h1>
      <p className="mb-6">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-indigo-600 rounded-md">Go home</Link>
    </div>
  );
}
