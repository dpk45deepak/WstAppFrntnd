import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Layout from "./components/layout/Layout";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
