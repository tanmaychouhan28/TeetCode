import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Sidebar, PageId } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { ProblemsView } from './components/ProblemsView';
import { ProblemWorkspace } from './components/ProblemWorkspace';
import { RoadmapView } from './components/RoadmapView';
import { MockInterviewView } from './components/MockInterviewView';
import { ProgressView } from './components/ProgressView';
import { NotesView } from './components/NotesView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { PracticeSetModal } from './components/PracticeSetModal';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [activeProblemSlug, setActiveProblemSlug] = useState<string>('number-of-islands');
  const [socraticMode, setSocraticMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState<boolean>(false);

  const handleSelectProblem = (slug: string) => {
    setActiveProblemSlug(slug);
    setCurrentPage('workspace');
  };

  const handleToggleSocratic = () => {
    setSocraticMode((prev) => !prev);
  };

  // If user is on the standalone Landing Page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onNavigate={setCurrentPage}
        onSelectProblem={handleSelectProblem}
      />
    );
  }

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenPracticeModal={() => setIsPracticeModalOpen(true)}
          socraticMode={socraticMode}
          onToggleSocratic={handleToggleSocratic}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto bg-bg-primary">
          {currentPage === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentPage}
              onSelectProblem={handleSelectProblem}
              onOpenPracticeModal={() => setIsPracticeModalOpen(true)}
            />
          )}

          {currentPage === 'problems' && (
            <ProblemsView
              onSelectProblem={handleSelectProblem}
              onOpenPracticeModal={() => setIsPracticeModalOpen(true)}
            />
          )}

          {(currentPage === 'workspace' || currentPage === 'ai-coach' || currentPage === 'practice') && (
            <ProblemWorkspace
              slug={activeProblemSlug}
              socraticMode={socraticMode}
              onNavigateToRoadmap={() => setCurrentPage('roadmap')}
            />
          )}

          {currentPage === 'roadmap' && (
            <RoadmapView
              onSelectProblem={handleSelectProblem}
            />
          )}

          {currentPage === 'mock-interview' && (
            <MockInterviewView />
          )}

          {currentPage === 'progress' && (
            <ProgressView />
          )}

          {currentPage === 'notes' && (
            <NotesView />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              socraticMode={socraticMode}
              onToggleSocratic={handleToggleSocratic}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PracticeSetModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        onSelectProblem={handleSelectProblem}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
