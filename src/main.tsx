import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "30px", background: "#FEE2E2", color: "#991B1B", fontFamily: "monospace", minHeight: "100vh" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>
            Une erreur est survenue lors de l'affichage :
          </h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#FFFFFF", padding: "15px", borderRadius: "8px", border: "1px solid #FCA5A5" }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: "20px", padding: "10px 20px", background: "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
