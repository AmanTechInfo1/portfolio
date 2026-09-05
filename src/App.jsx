import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState, Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/layout/CustomCursor';
import LoadingScreen from './components/layout/LoadingScreen';
import AIAssistant from './components/ai/AIAssistant';
import ThemeCustomizer from './components/ui/ThemeCustomizer';
import { ThemeProvider } from './contexts/ThemeContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            color: 'var(--foreground, white)',
            background: 'var(--background, #080808)',
            minHeight: '100vh',
            fontFamily: 'monospace',
          }}
        >
          <h1
            style={{
              color: 'var(--accent, #ef233c)',
              fontSize: '1.5rem',
            }}
          >
            Something went wrong
          </h1>

          <pre
            style={{
              whiteSpace: 'pre-wrap',
              marginTop: '1rem',
              color: '#8b8b8b',
              fontSize: '0.875rem',
            }}
          >
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ScrollToTop />

        <CustomCursor />

        <Navbar />

        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/about" element={<AboutPage />} />

              <Route path="/projects" element={<ProjectsPage />} />

              <Route
                path="/projects/:slug"
                element={<ProjectDetailPage />}
              />

              <Route path="/skills" element={<SkillsPage />} />

              <Route
                path="/experience"
                element={<ExperiencePage />}
              />

              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="*"
                element={<NotFoundPage />}
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />

        <AIAssistant />
        <ThemeCustomizer />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;