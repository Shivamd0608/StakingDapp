import { useContext } from 'react';
import { ICOContext } from '../context/ICOContext.jsx';

export const useICO = () => useContext(ICOContext);