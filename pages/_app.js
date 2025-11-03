import '../styles/globals.css';
import React from 'react';
import { Web3Provider } from '../src/providers/Web3Provider';
import { ContractProvider } from '../src/providers/ContractProvider';

function MyApp({ Component, pageProps }) {
  return (
    <React.StrictMode>
      <Web3Provider>
        <ContractProvider>
          <Component {...pageProps} />
        </ContractProvider>
      </Web3Provider>
    </React.StrictMode>
  );
}

export default MyApp;
