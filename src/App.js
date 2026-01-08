import React, { useState, useEffect } from 'react';



function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Retrieve userData from hidden input field
    const userDataElement = document.getElementById('userData');
    if (userDataElement && userDataElement.value) {
      try {
        const data = JSON.parse(userDataElement.value);
        setUserData(data);
        console.log('User Data loaded:', data);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
  }, []);

  return (
      <div className="app">
        <div className="container">
          <header className="header">
            <h1>Full Stack App</h1>
            <p className="subtitle">React + Node.js + Webpack on Same Port</p>

            {userData && (
              <div style={{
                backgroundColor: '#f0f0f0',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                fontSize: '12px'
              }}>
                <strong>Auth Data:</strong> {JSON.stringify(userData)}
              </div>
            )}

          
          </header>

        
        </div>
      </div>
  );
}

export default App;
