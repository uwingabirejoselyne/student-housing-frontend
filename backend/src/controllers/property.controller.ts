/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import propertyService from '../services/property.service';

/**
 * Create a new property
 */
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;

    const property = await propertyService.createProperty(landlordId!, req.body);

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

/**
 * Get all properties for a landlord
 */
export const getLandlordProperties = async (req: AuthRequest, res: Response) => {
  try {
    const landlordId = req.user?.userId;

    const properties = await propertyService.getLandlordProperties(landlordId!);

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

/**
 * Get a single property by ID (protected - landlord only)
 */
export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const property = await propertyService.getPropertyById(id, landlordId!);

    res.status(200).json({
      status: 'success',
      data: property
    });
  } catch (error: any) {
    console.error('Get property error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch property'
    });
  }
};

/**
 * Get single property by ID (public - for students/visitors to view)
 */
export const getPublicPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const property = await propertyService.getPublicPropertyById(id);

    res.status(200).json({
      status: 'success',
      data: property
    });
  } catch (error: any) {
    console.error('Get public property error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to fetch property details'
    });
  }
};

/**
 * Update a property
 */
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    const property = await propertyService.updateProperty(id, landlordId!, req.body);

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

    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to update property'
    });
  }
};

/**
 * Delete a property
 */
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const landlordId = req.user?.userId;

    await propertyService.deleteProperty(id, landlordId!);

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete property error:', error);
    const statusCode = error.message.includes('not found') || error.message.includes('permission') ? 404 : 500;
    res.status(statusCode).json({
      status: 'error',
      message: error.message || 'Failed to delete property'
    });
  }
};

/**
 * Get all properties (for students to browse)
 */
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { city, type, minRent, maxRent } = req.query;

    const filters = {
      city: city as string,
      type: type as string,
      minRent: minRent ? Number(minRent) : undefined,
      maxRent: maxRent ? Number(maxRent) : undefined
    };

    const properties = await propertyService.getAllProperties(filters);

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
