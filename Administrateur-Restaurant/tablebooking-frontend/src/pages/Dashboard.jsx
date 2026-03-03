import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantsAPI } from '../services/api';
import RestaurantModal from '../components/RestaurantModal';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  // Fetch restaurants on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantsAPI.getAll();
      setRestaurants(response.data.data || response.data);
    } catch (err) {
      setError('Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingRestaurant(null);
    setShowModal(true);
  };

  const handleEditClick = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingRestaurant(null);
  };

  const handleModalSave = async (formData) => {
    try {
      setError('');
      setSuccess('');

      if (editingRestaurant) {
        await restaurantsAPI.update(editingRestaurant.id, formData);
        setRestaurants(restaurants.map(r => r.id === editingRestaurant.id ? { ...r, ...formData } : r));
        setSuccess('Restaurant updated successfully');
      } else {
        const response = await restaurantsAPI.create(formData);
        setRestaurants([...restaurants, response.data.data || response.data]);
        setSuccess('Restaurant created successfully');
      }

      handleModalClose();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save restaurant');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await restaurantsAPI.delete(id);
      setRestaurants(restaurants.filter(r => r.id !== id));
      setSuccess('Restaurant deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Restaurant Admin Dashboard</h1>
          <div className="header-actions">
            <span className="user-info">
              Welcome, <strong>{user?.name}</strong> ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')} className="alert-close">×</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={() => setSuccess('')} className="alert-close">×</button>
          </div>
        )}

        {/* Section Header */}
        <div className="section-header">
          <h2>Restaurants</h2>
          {isAdmin && (
            <button onClick={handleAddClick} className="btn btn-primary">
              + Add Restaurant
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <p>Loading restaurants...</p>
          </div>
        )}

        {/* Restaurants Table */}
        {!loading && restaurants.length > 0 && (
          <div className="table-wrapper">
            <table className="restaurants-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Cuisine</th>
                  <th>Rating</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.address}</td>
                    <td>{restaurant.phone}</td>
                    <td>{restaurant.cuisine_type || 'N/A'}</td>
                    <td>
                      {restaurant.rating ? (
                        <span className="rating">★ {restaurant.rating}</span>
                      ) : (
                        'No rating'
                      )}
                    </td>
                    {isAdmin && (
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEditClick(restaurant)}
                          className="btn btn-small btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(restaurant.id)}
                          className="btn btn-small btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && restaurants.length === 0 && (
          <div className="empty-state">
            <p>No restaurants found</p>
            {isAdmin && (
              <button onClick={handleAddClick} className="btn btn-primary">
                Create First Restaurant
              </button>
            )}
          </div>
        )}
      </main>

      {/* Restaurant Modal */}
      {showModal && (
        <RestaurantModal
          restaurant={editingRestaurant}
          onSave={handleModalSave}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;