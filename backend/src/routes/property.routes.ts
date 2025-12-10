import express from 'express';
import {
  createProperty,
  getLandlordProperties,
  getPropertyById,
  getPublicPropertyById,
  updateProperty,
  deleteProperty,
  getAllProperties
} from '../controllers/property.controller';
import { authenticate as protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes - specific routes MUST come before parameterized routes
router.get('/all', getAllProperties); // For students to browse properties
router.get('/public/:id', getPublicPropertyById); // Get single property (public for viewing)

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

router.post('/', createProperty); // Create a new property
router.get('/', getLandlordProperties); // Get all properties for logged-in landlord
router.get('/:id', getPropertyById); // Get single property (landlord only)
router.put('/:id', updateProperty); // Update a property
router.delete('/:id', deleteProperty); // Delete a property

export default router;
