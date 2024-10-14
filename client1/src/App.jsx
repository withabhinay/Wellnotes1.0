import { useState } from 'react';
import { OktoProvider, BuildType } from 'okto-sdk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import NewJournal from './components/PostingJournal';
// import WidgetPage from './components/WidgetPage';

const OKTO_CLIENT_API_KEY = "b1ad05f3-19c8-4464-8d87-944a20632d4d";

function App() {
  const [authToken, setAuthToken] = useState(null);

  const handleLogout = () => {
    //etAuthToken(null); // Clear the authToken
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />       
        <Route
          path="/*" 
          element={
            <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
              <Routes>
                <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
                <Route
                  path="/dashboard"
                  element={authToken ? <Dashboard authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/" />}
                />
                 <Route
                  path="/new-journal"
                  element={authToken ? <NewJournal authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/" />}
                /> 
                {/* <Route path="/widget" element={authToken ? <WidgetPage authToken={authToken} handleLogout={handleLogout} /> : <Navigate to="/login" />} /> */}
              </Routes>
            </OktoProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
