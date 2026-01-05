// src/pages/public/PageNotFound.tsx
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import Button from "../../components/common/Button";
import LinkButton from "../../components/common/LinkButton";

const PageNotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Go Home */}
          <LinkButton to="/" size="md">
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </LinkButton>

          {/* Go Back */}
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
