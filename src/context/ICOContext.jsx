
import React, { createContext, useCallback } from 'react';
import { useEthers } from '../hooks/useEthers';
import * as icoService from '../services/ico';

export const ICOContext = createContext(null);

export function ICOProvider({ children }) {
  const { signer, provider, account } = useEthers();

  const handleBuyTokens = useCallback((ethAmount) => {
    return icoService.buyTokens(signer, ethAmount);
  }, [signer]);

  const handleGetUserTokenBalance = useCallback(() => {
    return icoService.getUserTokenBalance(provider, account);
  }, [provider, account]);

  const handleGetICOInfo = useCallback(() => {
    return icoService.getICOInfo(provider);
  }, [provider]);

  const handleStartICO = useCallback(() => {
    return icoService.startICO(signer);
  }, [signer]);

  const handleStopICO = useCallback(() => {
    return icoService.stopICO(signer);
  }, [signer]);

  const handleWithdrawICOFunds = useCallback(() => {
    return icoService.withdrawICOFunds(signer);
  }, [signer]);

  return (
    <ICOContext.Provider value={{
      buyTokens: handleBuyTokens,
      getUserTokenBalance: handleGetUserTokenBalance,
      getICOInfo: handleGetICOInfo,
      startICO: handleStartICO,
      stopICO: handleStopICO,
      withdrawICOFunds: handleWithdrawICOFunds,
    }}>
      {children}
    </ICOContext.Provider>
  );
}


