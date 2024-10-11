"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomerDetails() {
  const { id } = useParams(); // Get the customer id from the URL
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer details from API based on id
  useEffect(() => {
    if (id) {
      fetch(`/api/customer/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch customer details');
          }
          return response.json();
        })
        .then((data) => {
          setCustomer(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching customer details:', error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading customer details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!customer) {
    return <p>No customer data available</p>;
  }

  // Format the date of birth
  const formattedDob = new Date(customer.dob).toLocaleDateString();

  return (
    <div>
      <h1>Customer Details</h1>
      <p><strong>Member Number:</strong> {customer.memberNumber}</p>
      <p><strong>Date of Birth:</strong> {formattedDob}</p>
      <p><strong>Interests:</strong> {customer.interests}</p>
    </div>
  );
}
