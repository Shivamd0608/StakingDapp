// src/components/ui/Layout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import WalletButton from "./WalletButton";

const NavLink = ({ to, children }) => {
  const loc = useLocation();
  const active = loc.pathname === to;
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-md text-sm ${
        active ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold">My Staking DApp</div>
            <nav className="hidden md:flex gap-2">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/staking">Staking</NavLink>
              <NavLink to="/ico">ICO</NavLink>
              <NavLink to="/tokens">Tokens</NavLink>
              <NavLink to="/admin">Admin</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <WalletButton />
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-12 text-center text-sm text-slate-500">
          Built with ❤️ — Dark theme • TailwindCSS
        </footer>
      </div>
    </div>
  );
}
