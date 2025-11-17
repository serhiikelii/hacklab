/**
 * Database queries for fetching data from Supabase
 */

import { supabase } from './supabase';
import * as mockData from './mockData';
import { MAIN_SERVICES, EXTRA_SERVICES } from '@/types/pricelist';
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
  // Маппинг старых категорий на новые
  const categorySlugMap: Record<string, DeviceCategory> = {
    'iphone': 'iphone',
    'ipad': 'ipad',
    'macbook': 'macbook',
    'mac': 'macbook', // Backward compatibility
    'apple-watch': 'apple-watch',
    'watch': 'apple-watch', // Backward compatibility
  };

  const categorySlug = dbModel.device_categories?.slug || 'iphone';
  const mappedCategory = categorySlugMap[categorySlug] || categorySlug;

  return {
    id: dbModel.id,
    slug: dbModel.slug,
    category: mappedCategory as DeviceCategory,
    name: dbModel.name,
    series: dbModel.series || undefined,
    release_year: dbModel.release_year || undefined,
    image_url: dbModel.image_url || undefined,
    is_popular: dbModel.is_popular || false,
  };
}

/**
 * Transform database Service to app Service
 */
function transformService(dbService: DBService): Service {
  return {
    id: dbService.id,
    slug: dbService.slug,
    name_en: dbService.name_en,
    name_cz: dbService.name_cz,
    name_ru: dbService.name_ru,
    description_en: dbService.description_en || undefined,
    description_cz: dbService.description_cz || undefined,
    description_ru: dbService.description_ru || undefined,
    category: dbService.service_type,
    price_type: 'fixed',
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
    price_type: dbPrice.price_type,
    currency: 'CZK',
    duration: dbPrice.duration_minutes || undefined,
    warranty_months: dbPrice.warranty_months || 24,
    note_ru: dbPrice.note_ru || undefined,
    note_en: dbPrice.note_en || undefined,
    note_cz: dbPrice.note_cz || undefined,
    is_active: dbPrice.is_active ?? true,
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
    // Fallback to mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for services');
      return [...MAIN_SERVICES, ...EXTRA_SERVICES];
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services, falling back to mock data:', error);
      return [...MAIN_SERVICES, ...EXTRA_SERVICES];
    }

    return data ? data.map(transformService) : [];
  } catch (error) {
    console.error('Unexpected error in getServices, falling back to mock data:', error);
    return [...MAIN_SERVICES, ...EXTRA_SERVICES];
  }
}

/**
 * Get services for a specific category with category_services relationship
 */
export async function getServicesForCategory(categorySlug: DeviceCategory): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        category_services!inner(
          category_id,
          is_primary
        ),
        device_categories!inner(
          slug
        )
      `)
      .eq('device_categories.slug', categorySlug)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services for category:', error);
      return [];
    }

    return data ? data.map(transformService) : [];
  } catch (error) {
    console.error('Unexpected error in getServicesForCategory:', error);
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

    const { data, error} = await supabase
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

    // First get category ID
    const { data: category, error: catError } = await supabase
      .from('device_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (catError || !category) {
      console.error('Category not found:', categorySlug, catError);
      return mockData.getModelsForCategory(categorySlug);
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*, device_categories(*)')
      .eq('category_id', (category as { id: string }).id)
      .order('release_year', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching models for category, falling back to mock data:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return mockData.getModelsForCategory(categorySlug);
    }

    if (!data || data.length === 0) {
      console.warn(`No models found for category: ${categorySlug}, falling back to mock data`);
      return mockData.getModelsForCategory(categorySlug);
    }

    return data.map(transformDeviceModel);
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
