/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Property from '../models/Property';
import { AuthRequest } from '../middlewares/auth.middleware';

// Create a new property
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;

    if (!landlordId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const propertyData = {
      ...req.body,
      landlordId
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      status: 'success',
      message: 'Property created successfully',
      data: property
    });
  } catch (error: any) {
    console.error('Create property error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to create property'
    });
  }
};

// Get all properties for a landlord
export const getLandlordProperties = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;

    if (!landlordId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const properties = await Property.find({ landlordId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch properties'
    });
  }
};

// Get a single property by ID
export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const property = await Property.findOne({ _id: id, landlordId });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch property'
    });
  }
};

// Update a property
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const property = await Property.findOneAndUpdate(
      { _id: id, landlordId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Property updated successfully',
      data: property
    });
  } catch (error: any) {
    console.error('Update property error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update property'
    });
  }
};

// Delete a property
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const property = await Property.findOneAndDelete({ _id: id, landlordId });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete property'
    });
  }
};

// Get all properties (for students to browse)
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { city, type, minRent, maxRent } = req.query;

    const filter: any = { status: 'active' };

    if (city) filter.city = city;
    if (type) filter.type = type;
    if (minRent || maxRent) {
      filter.monthlyRentMin = {};
      if (minRent) filter.monthlyRentMin.$gte = Number(minRent);
      if (maxRent) filter.monthlyRentMax = { $lte: Number(maxRent) };
    }

    const properties = await Property.find(filter)
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch properties'
    });
  }
};
