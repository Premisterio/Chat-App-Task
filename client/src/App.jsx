import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { MainLayout } from './components/Layout/MainLayout';
import Header from './components/Layout/Header';
import Chat from './pages/Chat';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={
                <MainLayout>
                  <Header />
                  <Chat />
                </MainLayout>
              } />
              <Route path="/chat/:id" element={
                <MainLayout>
                  <Header />
                  <Chat />
                </MainLayout>
              } />
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

export default App;