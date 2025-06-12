import mongoose from 'mongoose';

// Activity within a day
const DayActivitySchema = new mongoose.Schema({
  time: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  location: String
});

// Each day of the itinerary
const ItineraryDaySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  location: String,
  date: Date,
  activities: [DayActivitySchema],
  includedServices: {
    meals: { type: Boolean, default: false },
    transport: { type: Boolean, default: false },
    guide: { type: Boolean, default: false },
    accommodation: { type: Boolean, default: false }
  },
  images: [String]
});

// Traveler details
const TravelerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  passport: String,
  age: Number
});

// Hotel bookings
const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checkIn: Date,
  checkOut: Date,
  roomType: String,
  notes: String
});

// Flight details
const FlightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true
  },
  flightNumber: String,
  departureDate: Date,
  departureTime: String,
  departureAirport: String,
  arrivalDate: Date,
  arrivalTime: String,
  arrivalAirport: String,
  notes: String
});

// Visa information
const VisaSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true
  },
  type: String,
  processingTime: String,
  requirements: String,
  status: {
    type: String,
    enum: ['pending', 'in-process', 'approved', 'rejected', 'not-required'],
    default: 'pending'
  },
  notes: String
});

// Main itinerary schema
const ItinerarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  operationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Operation',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  days: [ItineraryDaySchema],
  travelers: [TravelerSchema],
  hotels: [HotelSchema],
  flights: [FlightSchema],
  visas: [VisaSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  shareableLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', ItinerarySchema);
export default Itinerary;
