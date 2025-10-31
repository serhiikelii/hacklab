/**
 * Database queries for fetching data from Supabase
 */

import { supabase } from './supabase';
import * as mockData from './mockData';
import type { DeviceModel as DBDeviceModel, Service as DBService, Price as DBPrice, Category } from '@/types/database';
import type { DeviceModel, Service, ServicePrice, DeviceCategory } from '@/types/pricelist';

// ========== Helper Functions ==========

/**
 * Check if Supabase is properly configured
 */
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return !!(
    supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseKey.includes('your-anon-public-key')
  );
}

// ========== Type Transformers ==========

/**
 * Transform database DeviceModel to app DeviceModel
 */
function transformDeviceModel(dbModel: any): DeviceModel {
  return {
    id: dbModel.id,
    slug: dbModel.slug,
    category: dbModel.device_categories?.slug || 'iphone' as DeviceCategory,
    name: dbModel.name,
    series: dbModel.series || undefined,
    releaseYear: dbModel.release_year || undefined,
    imageUrl: dbModel.image_url || undefined,
    isPopular: false,
  };
}

/**
 * Transform database Service to app Service
 */
function transformService(dbService: DBService): Service {
  return {
    id: dbService.id,
    slug: dbService.slug,
    nameEn: dbService.name_en,
    nameCz: dbService.name_cz,
    nameRu: dbService.name_ru,
    description: dbService.description_en || undefined,
    category: dbService.service_type,
    priceType: 'fixed',
  };
}

/**
 * Transform database Price to app ServicePrice
 */
function transformPrice(dbPrice: DBPrice): ServicePrice {
  return {
    serviceId: dbPrice.service_id,
    modelId: dbPrice.model_id,
    price: dbPrice.price || undefined,
    currency: 'CZK',
    duration: dbPrice.duration_minutes || undefined,
    warranty: dbPrice.warranty_months || 24,
  };
}

// ========== Query Functions ==========

/**
 * Get model by slug with category information
 */
export async function getModelBySlug(slug: string): Promise<DeviceModel | null> {
  try {
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug parameter');
      return null;
    }

    // Fallback to mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for model:', slug);
      return mockData.getModelBySlug(slug) || null;
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*, device_categories(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching model, falling back to mock data:', error);
      return mockData.getModelBySlug(slug) || null;
    }

    return data ? transformDeviceModel(data) : null;
  } catch (error) {
    console.error('Unexpected error in getModelBySlug, falling back to mock data:', error);
    return mockData.getModelBySlug(slug) || null;
  }
}

/**
 * Get all services
 */
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }

    return data ? data.map(transformService) : [];
  } catch (error) {
    console.error('Unexpected error in getServices:', error);
    return [];
  }
}

/**
 * Get prices for a specific model
 */
export async function getPricesForModel(modelId: string): Promise<ServicePrice[]> {
  try {
    if (!modelId || typeof modelId !== 'string') {
      console.error('Invalid modelId parameter');
      return [];
    }

    // Fallback to mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for prices:', modelId);
      return mockData.getPricesForModel(modelId);
    }

    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('model_id', modelId)
      .order('service_id');

    if (error) {
      console.error('Error fetching prices, falling back to mock data:', error);
      return mockData.getPricesForModel(modelId);
    }

    return data ? data.map(transformPrice) : [];
  } catch (error) {
    console.error('Unexpected error in getPricesForModel, falling back to mock data:', error);
    return mockData.getPricesForModel(modelId);
  }
}

/**
 * Get models for a specific category
 */
export async function getModelsForCategory(categorySlug: string): Promise<DeviceModel[]> {
  try {
    if (!categorySlug || typeof categorySlug !== 'string') {
      console.error('Invalid categorySlug parameter');
      return [];
    }

    // Fallback to mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for category:', categorySlug);
      return mockData.getModelsForCategory(categorySlug);
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*, device_categories!inner(*)')
      .eq('device_categories.slug', categorySlug)
      .order('release_year', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching models for category, falling back to mock data:', error);
      return mockData.getModelsForCategory(categorySlug);
    }

    return data ? data.map(transformDeviceModel) : [];
  } catch (error) {
    console.error('Unexpected error in getModelsForCategory, falling back to mock data:', error);
    return mockData.getModelsForCategory(categorySlug);
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('device_categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getCategories:', error);
    return [];
  }
}

/**
 * Get prices with full service and model information
 */
export async function getPricesWithRelations(modelId: string) {
  try {
    if (!modelId || typeof modelId !== 'string') {
      console.error('Invalid modelId parameter');
      return [];
    }

    const { data, error } = await supabase
      .from('prices')
      .select(`
        *,
        service:services(*),
        model:device_models(*)
      `)
      .eq('model_id', modelId)
      .order('service_id');

    if (error) {
      console.error('Error fetching prices with relations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getPricesWithRelations:', error);
    return [];
  }
}
