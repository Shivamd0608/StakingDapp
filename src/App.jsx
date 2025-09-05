import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "../config";

import Layout from "./components/ui/Layout";
import Dashboard from "./pages/Dashboard";
import Staking from "./pages/Staking";
import ICO from "./pages/ICO";
import Tokens from "./pages/Tokens";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Layout>
          <Dashboard />
          <Staking />
          <ICO />
          <Tokens />
          <Admin />
          <NotFound />
        </Layout>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
