import { useContext } from 'react';
import { EthersContext } from '../context/EthersContext';

export const useEthers = () => useContext(EthersContext);