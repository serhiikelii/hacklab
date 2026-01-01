/**
 * Database queries for fetching data from Supabase
 * NO CACHING - Direct queries for real-time data
 */

import { supabase } from './supabase';
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
  // Map legacy category slugs to current ones
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
    is_popular: false, // Feature removed - was never in DB schema
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
    // is_active: removed - field doesn't exist in prices table
  };
}

// ========== Query Functions ==========

/**
 * Get model by slug with category information (no cache)
 */
export async function getModelBySlug(slug: string): Promise<DeviceModel | null> {
  try {
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug parameter');
      return null;
    }

    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('device_models')
      .select('*, device_categories(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching model:', error);
      return null;
    }

    return data ? transformDeviceModel(data) : null;
  } catch (error) {
    console.error('Unexpected error in getModelBySlug:', error);
    return null;
  }
}

/**
 * Get all services
 */
export async function getServices(): Promise<Service[]> {
  try {
    // Fallback to mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
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
 * Get services for a specific category using optimized VIEW (no cache)
 * Uses category_services_view - pre-compiled JOIN for maximum performance
 */
export async function getServicesForCategory(categorySlug: DeviceCategory): Promise<Service[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return [];
    }

    // Use optimized VIEW instead of multiple JOINs
    const { data, error } = await supabase
      .from('category_services_view')
      .select('*')
      .eq('category_slug', categorySlug)
      .eq('is_active', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching services for category:', error);
      return [];
    }

    // Transform VIEW data to Service type
    return data ? data.map((item: any) => ({
      id: item.service_id,
      slug: item.service_slug,
      name_en: item.service_name_en,
      name_cz: item.service_name_cz,
      name_ru: item.service_name_ru,
      category: item.service_type,
      price_type: 'fixed' as const,
    })) : [];
  } catch (error) {
    console.error('Unexpected error in getServicesForCategory:', error);
    return [];
  }
}

/**
 * Get prices for a specific model with category_service_id for discount lookups
 * (no cache - Next.js deduplicates automatically)
 */
export async function getPricesForModel(modelId: string): Promise<ServicePrice[]> {
  try {
    if (!modelId || typeof modelId !== 'string') {
      console.error('Invalid modelId parameter');
      return [];
    }

    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return [];
    }

    // Get model to know its category
    const { data: model, error: modelError } = await supabase
      .from('device_models')
      .select('category_id')
      .eq('id', modelId)
      .single();

    if (modelError || !model) {
      console.error('Error fetching model category:', modelError);
      return [];
    }

    // Get prices for the model
    const { data: pricesData, error: pricesError } = await supabase
      .from('prices')
      .select('*')
      .eq('model_id', modelId)
      .order('service_id');

    if (pricesError) {
      console.error('Error fetching prices:', pricesError);
      return [];
    }

    // Get category_services for this category to map service_id -> category_service_id
    const { data: categoryServices, error: csError } = await supabase
      .from('category_services')
      .select('id, service_id')
      .eq('category_id', model.category_id);

    if (csError) {
      console.error('Error fetching category_services:', csError);
      return pricesData ? pricesData.map(transformPrice) : [];
    }

    // Create map: service_id -> category_service_id
    const serviceMap = new Map(
      (categoryServices || []).map(cs => [cs.service_id, cs.id])
    );

    // Transform prices and add category_service_id
    return pricesData ? pricesData.map((price: any) => ({
      ...transformPrice(price),
      categoryServiceId: serviceMap.get(price.service_id) || null,
    })) : [];
  } catch (error) {
    console.error('Unexpected error in getPricesForModel:', error);
    return [];
  }
}

/**
 * Get models for a specific category (no cache)
 */
export async function getModelsForCategory(categorySlug: string): Promise<DeviceModel[]> {
  try {
    if (!categorySlug || typeof categorySlug !== 'string') {
      console.error('Invalid categorySlug parameter');
      return [];
    }

    // Return empty if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return [];
    }

    // Optimized: Single query with JOIN instead of N+1
    const { data, error } = await supabase
      .from('device_models')
      .select('*, device_categories!inner(*)')
      .eq('device_categories.slug', categorySlug)
      .order('order', { ascending: true, nullsFirst: false })
      .order('release_year', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching models for category:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn(`No models found for category: ${categorySlug}`);
      return [];
    }

    return data.map(transformDeviceModel);
  } catch (error) {
    console.error('Unexpected error in getModelsForCategory:', error);
    return [];
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
