import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../common/Header';
import UsersList from './UsersList';
import StoresList from './StoresList';
import AddUser from './AddUser';
import UserDetails from './UserDeatils';
import RatingsList from './RatingList';
import StoreDetails from './StoreDetails';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/users/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <Container fluid className="mt-4">
        <Routes>
          <Route path="/" element={
            <>
              <h2 className="mb-4">Admin Dashboard</h2>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <Row className="mb-4">
                    <Col md={4}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <h3>{stats.totalUsers}</h3>
                          <Card.Title>Total Users</Card.Title>
                        </Card.Body>
                        <Card.Footer>
                          <Link to="/admin/users" className="btn btn-primary">View Users</Link>
                        </Card.Footer>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <h3>{stats.totalStores}</h3>
                          <Card.Title>Total Stores</Card.Title>
                        </Card.Body>
                        <Card.Footer>
                          <Link to="/admin/stores" className="btn btn-primary">View Stores</Link>
                        </Card.Footer>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="text-center h-100 bg-light">
                        <Card.Body>
                          <h3>{stats.totalRatings}</h3>
                          <Card.Title>Total Ratings</Card.Title>
                        </Card.Body>
                        <Card.Footer>
                          <Link to="/admin/ratings" className="btn btn-primary">View Stores</Link>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Body>
                          <h4>Quick Actions</h4>
                          <div className="d-grid gap-2">
                            <Link to="/admin/add-user" className="btn btn-success">Add New User</Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Body>
                          <h4>System Information</h4>
                          <p>Welcome to the Admin Dashboard. Here you can manage users, stores, and view system statistics.</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
              )}
            </>
          } />
          <Route path="/users" element={<UsersList />} />
          <Route path="/stores" element={<StoresList />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/ratings" element={<RatingsList />} />
        </Routes>
      </Container>
    </>
  );
};

export default AdminDashboard;
