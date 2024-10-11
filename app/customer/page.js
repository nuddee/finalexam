"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // Correct import for app directory

export default function CustomerPage() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL || '/api';  // Use '/api' if no environment variable is set
  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter(); // Use useRouter from next/navigation

  // Fetch customers from API
  async function fetchCustomers() {
    try {
      const response = await fetch(`${APIBASE}/customer`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const customers = await response.json();
      const customerWithId = customers.map((customer) => {
        customer.id = customer._id; // Add id for handling on the frontend
        return customer;
      });
      setCustomerList(customerWithId);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  // Handle form submission for add/update
  async function handleCustomerFormSubmit(data) {
    if (editMode) {
      // Update existing customer
      try {
        const response = await fetch(`${APIBASE}/customer`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          const errorMessage = await response.text(); // Fetch the error message from the server
          throw new Error(`Failed to update customer: ${errorMessage}`);
        }
        
        reset({ dob: '', memberNumber: '', interests: '' });
        setEditMode(false);
        fetchCustomers();  // Refresh customer list
      } catch (error) {
        console.error("Error updating customer:", error);
      }
      return;
    }

    // Add new customer
    try {
      const response = await fetch(`${APIBASE}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text(); // Fetch the error message from the server
        throw new Error(`Failed to add customer: ${errorMessage}`);
      }

      reset({ dob: '', memberNumber: '', interests: '' });
      fetchCustomers();  // Refresh customer list
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  }

  // Navigate to customer details page
  const viewCustomerDetails = (id) => () => {
    router.push(`/customer/${id}`);  // Navigate to the detailed page
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="customer-form-container">
      <h1>{editMode ? 'Update Customer' : 'Add Customer'}</h1>
      <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
        {editMode && (
          <div>
            <label htmlFor="id">Customer ID (for updating):</label>
            <input type="text" id="id" {...register('id')} disabled />
          </div>
        )}
        <div>
          <label htmlFor="dob">Date of Birth:</label>
          <input type="date" id="dob" {...register('dob')} required />
        </div>
        <div>
          <label htmlFor="memberNumber">Member Number:</label>
          <input type="number" id="memberNumber" {...register('memberNumber')} required />
        </div>
        <div>
          <label htmlFor="interests">Interests:</label>
          <input type="text" id="interests" {...register('interests')} required />
        </div>
        <button type="submit">{editMode ? 'Update' : 'Add'} Customer</button>
      </form>

      {/* Customer List - Card Design */}
      <div className="customer-list">
        {customerList.map((customer) => (
          <div className="customer-card" key={customer.id} onClick={viewCustomerDetails(customer.id)}>
            <h2>{customer.memberNumber}</h2>
            <p>Date of Birth: {customer.dob}</p>
            <p>Interests: {customer.interests}</p>
            <div className="card-actions">
              <button className="edit-button" onClick={(e) => { e.stopPropagation(); startEdit(customer)(); }}>Edit</button>
              <button className="delete-button" onClick={(e) => { e.stopPropagation(); deleteById(customer.id)(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
