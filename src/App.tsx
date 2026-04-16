import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EuropeMap from "@/pages/EuropeMap";
import Partners from "@/pages/Partners";
import PartnerDetail from "@/pages/PartnerDetail";
import Events from "@/pages/Events";
import ActionCenter from "@/pages/ActionCenter";
import Alerts from "@/pages/Alerts";
import WebsiteAnalysis from "@/pages/WebsiteAnalysis";
import Notes from "@/pages/Notes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<EuropeMap />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/actions" element={<ActionCenter />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/website-analysis" element={<WebsiteAnalysis />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
