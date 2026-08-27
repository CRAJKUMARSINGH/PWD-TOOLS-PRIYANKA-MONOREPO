import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuditReplyPage from "@/pages/AuditReplyPage";
import BankCommunication from "@/pages/BankCommunication";
import BillForm from "@/pages/BillForm";
import ContractorRegistration from "@/pages/ContractorRegistration";
import CorrespondencePage from "@/pages/Correspondence";
import DocumentGenerator from "@/pages/DocumentGenerator";
import EnrollmentDataForm from "@/pages/EnrollmentDataForm";
import EotLetterPage from "@/pages/EotLetterPage";
import Home from "@/pages/Home";
import ImageCompressor from "@/pages/ImageCompressor";
import LegalCorrespondencePage from "@/pages/LegalCorrespondence";
import NotFound from "@/pages/not-found";
import NoticePage from "@/pages/NoticePage";
import RescissionNoticePage from "@/pages/RescissionNoticePage";
import ToolViewer from "@/pages/ToolViewer";
import WorkOrderPage from "@/pages/WorkOrderPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, Router as WouterRouter } from "wouter";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tool/:id" component={ToolViewer} />
      {/* ── Correspondence ── */}
      <Route path="/audit-reply" component={AuditReplyPage} />
      <Route path="/correspondence" component={CorrespondencePage} />
      <Route path="/legal-correspondence" component={LegalCorrespondencePage} />
      {/* ── Bill & Financial ── */}
      <Route path="/bill-form" component={BillForm} />
      <Route path="/document-generator" component={DocumentGenerator} />
      <Route path="/enrollment-data" component={EnrollmentDataForm} />
      {/* ── Contractor ── */}
      <Route path="/contractor-registration" component={ContractorRegistration} />
      <Route path="/bank-communication" component={BankCommunication} />
      {/* ── New tools ── */}
      <Route path="/notice" component={NoticePage} />
      <Route path="/work-order" component={WorkOrderPage} />
      <Route path="/eot-letter" component={EotLetterPage} />
      <Route path="/rescission-notice" component={RescissionNoticePage} />
      <Route path="/image-compressor" component={ImageCompressor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
