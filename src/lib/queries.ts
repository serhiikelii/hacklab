/**
 * Database queries for fetching data from Supabase
 * Optimized with Next.js 15 unstable_cache for performance
 */

import { unstable_cache } from 'next/cache';
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
 * Get model by slug with category information (cached)
 */
export const getModelBySlug = unstable_cache(
  async (slug: string): Promise<DeviceModel | null> => {
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
  },
  ['model-by-slug'],
  {
    revalidate: 3600,
    tags: ['models']
  }
);

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
 * Get services for a specific category using optimized VIEW (cached)
 * Uses category_services_view - pre-compiled JOIN for maximum performance
 */
export const getServicesForCategory = unstable_cache(
  async (categorySlug: DeviceCategory): Promise<Service[]> => {
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
  },
  ['services-by-category'],
  {
    revalidate: 3600, // 1 hour cache
    tags: ['services', 'categories']
  }
);

/**
 * Get prices for a specific model (cached)
 */
export const getPricesForModel = unstable_cache(
  async (modelId: string): Promise<ServicePrice[]> => {
    try {
      if (!modelId || typeof modelId !== 'string') {
        console.error('Invalid modelId parameter');
        return [];
      }

      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured');
        return [];
      }

      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('model_id', modelId)
        .order('service_id');

      if (error) {
        console.error('Error fetching prices:', error);
        return [];
      }

      return data ? data.map(transformPrice) : [];
    } catch (error) {
      console.error('Unexpected error in getPricesForModel:', error);
      return [];
    }
  },
  ['prices-by-model'],
  {
    revalidate: 1800, // 30 minutes cache (prices change more often)
    tags: ['prices']
  }
);

/**
 * Get models for a specific category (optimized with caching and single query)
 */
export const getModelsForCategory = unstable_cache(
  async (categorySlug: string): Promise<DeviceModel[]> => {
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
  },
  ['models-by-category'],
  {
    revalidate: 3600, // 1 hour cache
    tags: ['models', 'categories']
  }
);

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
