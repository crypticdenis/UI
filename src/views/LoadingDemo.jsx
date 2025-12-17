import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import SkeletonLoader from '../components/SkeletonLoader';
import '../styles/LoadingDemo.css';

/**
 * Demo view to showcase all loading states and error displays
 * This component is for development/testing purposes
 */
const LoadingDemo = () => {
  const handleRetry = () => {
    console.log('Retry clicked');
    alert('Retry functionality demonstrated!');
  };

  return (
    <div className="loading-demo">
      <div className="demo-header">
        <h1>Loading States & Error Handling Demo</h1>
        <p>Reusable loading components for better UX</p>
      </div>

      {/* Spinner Variants */}
      <section className="demo-section">
        <h2>Loading Spinners</h2>
        
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Small Spinner</h3>
            <LoadingSpinner size="small" />
          </div>
          
          <div className="demo-item">
            <h3>Medium Spinner (Default)</h3>
            <LoadingSpinner size="medium" text="Loading..." />
          </div>
          
          <div className="demo-item">
            <h3>Large Spinner with Text</h3>
            <LoadingSpinner size="large" text="Loading projects..." />
          </div>
        </div>

        <div className="demo-grid">
          <div className="demo-item">
            <h3>Dots Variant</h3>
            <LoadingSpinner variant="dots" size="medium" text="Processing..." />
          </div>
          
          <div className="demo-item">
            <h3>Pulse Variant</h3>
            <LoadingSpinner variant="pulse" size="medium" text="Syncing data..." />
          </div>
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="demo-section">
        <h2>Skeleton Loaders</h2>
        
        <div className="demo-item">
          <h3>Table Skeleton</h3>
          <SkeletonLoader rows={3} columns={5} variant="table" />
        </div>

        <div className="demo-item">
          <h3>Card Skeleton</h3>
          <SkeletonLoader rows={2} variant="card" />
        </div>

        <div className="demo-item">
          <h3>Text Skeleton</h3>
          <SkeletonLoader rows={4} variant="text" />
        </div>
      </section>

      {/* Error Displays */}
      <section className="demo-section">
        <h2>Error Displays</h2>
        
        <div className="demo-item">
          <h3>Basic Error</h3>
          <ErrorDisplay 
            error="Something went wrong"
            onRetry={handleRetry}
          />
        </div>

        <div className="demo-item">
          <h3>Error with Details</h3>
          <ErrorDisplay 
            error="Failed to connect to server"
            title="Connection Error"
            description="Make sure the backend server is running on http://localhost:3001"
            onRetry={handleRetry}
          />
        </div>

        <div className="demo-item">
          <h3>Error without Retry</h3>
          <ErrorDisplay 
            error="Access denied"
            title="Permission Error"
            description="You don't have permission to access this resource"
          />
        </div>
      </section>

      {/* Usage Examples */}
      <section className="demo-section code-examples">
        <h2>Code Examples</h2>
        
        <div className="code-block">
          <h3>LoadingSpinner</h3>
          <pre>
{`import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner size="large" text="Loading..." />
<LoadingSpinner variant="dots" />
<LoadingSpinner variant="pulse" fullScreen />`}
          </pre>
        </div>

        <div className="code-block">
          <h3>ErrorDisplay</h3>
          <pre>
{`import ErrorDisplay from './components/ErrorDisplay';

<ErrorDisplay 
  error={error}
  title="Failed to Load"
  description="Check your connection"
  onRetry={handleRetry}
/>`}
          </pre>
        </div>

        <div className="code-block">
          <h3>SkeletonLoader</h3>
          <pre>
{`import SkeletonLoader from './components/SkeletonLoader';

<SkeletonLoader rows={5} columns={8} variant="table" />
<SkeletonLoader rows={3} variant="card" />
<SkeletonLoader rows={4} variant="text" />`}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default LoadingDemo;
