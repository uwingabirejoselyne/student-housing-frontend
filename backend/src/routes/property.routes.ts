import express from 'express';
import {
  createProperty,
  getLandlordProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllProperties
} from '../controllers/property.controller';
import { authenticate as protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/all', getAllProperties); // For students to browse properties

// Protected routes (require authentication)
router.use(protect); // All routes below require authentication

router.post('/', createProperty); // Create a new property
router.get('/', getLandlordProperties); // Get all properties for logged-in landlord
router.get('/:id', getPropertyById); // Get single property
router.put('/:id', updateProperty); // Update a property
router.delete('/:id', deleteProperty); // Delete a property

export default router;
