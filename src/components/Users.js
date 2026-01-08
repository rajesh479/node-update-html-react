import React, { useState, useEffect } from 'react';
import { getUsers } from '../api/userApi';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
        <button onClick={fetchUsers} className="retry-btn">Retry</button>
      </div>
    );
  }

  return (
    <div className="users-container">
      <h2>Users</h2>
      <p className="subtitle">Data fetched from JSONPlaceholder API via Node.js backend</p>

      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <div className="user-details">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Website:</strong> {user.website}</p>
              <div className="user-address">
                <p><strong>Address:</strong></p>
                <p>{user.address.street}, {user.address.suite}</p>
                <p>{user.address.city}, {user.address.zipcode}</p>
              </div>
              <div className="user-company">
                <p><strong>Company:</strong> {user.company.name}</p>
                <p className="company-tagline">{user.company.catchPhrase}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
