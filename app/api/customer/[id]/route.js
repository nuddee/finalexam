import Customer from "@/models/Customer";
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// DELETE customer by ID
export async function DELETE(request, { params }) {
  const { id } = params; // Extract the customer ID from the URL

  // Ensure the ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
  }

  try {
    // Find and delete the customer by ID
    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Customer deleted successfully', customer }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET customer by ID
export async function GET(request, { params }) {
  const { id } = params; // Extract the customer ID from the URL

  // Ensure the ID is a valid MongoDB ObjectID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid customer ID' }, { status: 400 });
  }

  try {
    // Find the customer by ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer, { status: 200 }); // Return customer data
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
