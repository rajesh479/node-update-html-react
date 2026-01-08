import React, { useState, useEffect } from 'react';



function App() {
  const [userData, setUserData] = useState(null);
    const [payLoad, setPayload] = useState({name:'rajesh', age:'25'});
  const [serverResponse, setServerResponse] = useState(null);

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

    // Function to send payload to server
  const sendPayloadToServer = async () => {
    try {
      const response = await fetch('/api/receive-payload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payLoad)
      });

      const data = await response.json();
      setServerResponse(data);
      console.log('Server Response:', data);
    } catch (error) {
      console.error('Error sending payload:', error);
      setServerResponse({ error: error.message });
    }
  };


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


           <button
                onClick={sendPayloadToServer}
                style={{
                  backgroundColor: '#2196F3',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Send to Server
              </button>

                {serverResponse && (
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  backgroundColor: serverResponse.error ? '#ffebee' : '#e8f5e9',
                  borderRadius: '5px'
                }}>
                  <strong>Server Response:</strong>
                  <pre style={{ margin: '5px 0', fontSize: '12px' }}>
                    {JSON.stringify(serverResponse, null, 2)}
                  </pre>
                </div>
              )}

        
        </div>
      </div>
  );
}

export default App;
