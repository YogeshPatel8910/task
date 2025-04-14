import React, { useState, useEffect } from 'react';
import { Container, Card,Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import StoreList from './StoreList';
import StoreDetail from './StoreDetail';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stores');
      
      setStores(response.data.stores);
      setFilteredStores(response.data.stores);
    } catch (err) {
      setError('Failed to load stores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    if (searchValue.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.name.toLowerCase().includes(searchValue) || 
        store.address.toLowerCase().includes(searchValue)
      );
      setFilteredStores(filtered);
    }
  };

  return (
    <>
      <Container fluid className="mt-4">
        <Routes>
          <Route path="/" element={
            <>
              <h2 className="mb-4">Available Stores</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Card className="mb-4">
                <Card.Body>
                  <Form>
                    <InputGroup>
                      <Form.Control
                        placeholder="Search stores by name or address..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                      <Button variant="outline-secondary">
                        <i className="bi bi-search"></i> Search
                      </Button>
                    </InputGroup>
                  </Form>
                </Card.Body>
              </Card>
              
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <StoreList stores={filteredStores} />
              )}
            </>
          } />
          <Route path="/stores/:id" element={<StoreDetail />} />
        </Routes>
      </Container>
    </>
  );
};

export default UserDashboard;
