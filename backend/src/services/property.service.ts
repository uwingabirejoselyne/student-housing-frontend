import Property from '../models/Property';

export class PropertyService {
  /**
   * Create a new property
   */
  async createProperty(landlordId: string, propertyData: any) {
    const data = {
      ...propertyData,
      landlordId
    };

    return await Property.create(data);
  }

  /**
   * Get all properties for a landlord
   */
  async getLandlordProperties(landlordId: string) {
    return await Property.find({ landlordId }).sort({ createdAt: -1 });
  }

  /**
   * Get a single property by ID (protected - landlord only)
   */
  async getPropertyById(propertyId: string, landlordId: string) {
    const property = await Property.findOne({ _id: propertyId, landlordId });

    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  }

  /**
   * Get single property by ID (public - for students/visitors)
   */
  async getPublicPropertyById(propertyId: string) {
    const property = await Property.findOne({
      _id: propertyId,
      status: 'active'
    }).populate('landlordId', 'name email phone');

    if (!property) {
      throw new Error('Property not found or not available');
    }

    return property;
  }

  /**
   * Update a property
   */
  async updateProperty(propertyId: string, landlordId: string, updateData: any) {
    const property = await Property.findOneAndUpdate(
      { _id: propertyId, landlordId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!property) {
      throw new Error('Property not found');
    }

    return property;
  }

  /**
   * Delete a property
   */
  async deleteProperty(propertyId: string, landlordId: string) {
    const property = await Property.findOne({ _id: propertyId, landlordId });

    if (!property) {
      throw new Error('Property not found or you do not have permission to delete it');
    }

    await Property.findOneAndDelete({ _id: propertyId, landlordId });

    // TODO: Optionally delete images from Cloudinary
    // This can be implemented later if needed
    // if (property.images && property.images.length > 0) {
    //   const cloudinary = require('../config/cloudinary').default;
    //   for (const imageUrl of property.images) {
    //     const publicId = extractPublicIdFromUrl(imageUrl);
    //     await cloudinary.uploader.destroy(publicId);
    //   }
    // }

    return { message: 'Property deleted successfully' };
  }

  /**
   * Get all properties (for students to browse)
   */
  async getAllProperties(filters?: {
    city?: string;
    type?: string;
    minRent?: number;
    maxRent?: number;
  }) {
    const filter: any = { status: 'active' };

    if (filters) {
      if (filters.city) filter.city = filters.city;
      if (filters.type) filter.type = filters.type;
      if (filters.minRent || filters.maxRent) {
        filter.monthlyRentMin = {};
        if (filters.minRent) filter.monthlyRentMin.$gte = Number(filters.minRent);
        if (filters.maxRent) filter.monthlyRentMax = { $lte: Number(filters.maxRent) };
      }
    }

    return await Property.find(filter)
      .populate('landlordId', 'name email phone')
      .sort({ createdAt: -1 });
  }
}

export default new PropertyService();
