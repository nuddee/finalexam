import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  dob: {   // Changed from 'Date_of_birth' to 'dob'
    type: Date,
    required: true
  },
  memberNumber: {   // Changed from 'Member_number' to 'memberNumber'
    type: Number,
    required: true
  },
  interests: {   // Changed from 'Interests' to 'interests'
    type: String,
    required: true
  }
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
