import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Discount, DiscountedPrice } from '@/types/pricelist';

interface DiscountWithServices extends Discount {
  discount_services: Array<{ service_id: string }>;
}

interface DiscountResponse {
  service_id: string;
  discount: Discount;
  discounted_price?: number;
}

/**
 * GET /api/discounts/active
 *
 * Retrieves active automatic discounts for specified services
 *
 * Query params:
 * - service_ids: comma-separated list of service UUIDs
 * - original_prices: optional comma-separated list of prices (same order as service_ids)
 *
 * Returns:
 * - Array of active discounts mapped to services
 * - Calculated discounted prices if original_prices provided
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceIdsParam = searchParams.get('service_ids');
    const originalPricesParam = searchParams.get('original_prices');

    // Validate required parameters
    if (!serviceIdsParam) {
      return NextResponse.json(
        { error: 'service_ids parameter is required' },
        { status: 400 }
      );
    }

    const serviceIds = serviceIdsParam.split(',').map(id => id.trim());
    const originalPrices = originalPricesParam
      ? originalPricesParam.split(',').map(p => parseFloat(p.trim()))
      : [];

    if (serviceIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one service_id is required' },
        { status: 400 }
      );
    }

    // Validate prices if provided
    if (originalPrices.length > 0 && originalPrices.length !== serviceIds.length) {
      return NextResponse.json(
        { error: 'Number of original_prices must match number of service_ids' },
        { status: 400 }
      );
    }

    // Fetch active automatic discounts with their linked services
    const { data: discounts, error: discountsError } = await supabase
      .from('discounts')
      .select(`
        *,
        discount_services(service_id)
      `)
      .eq('active', true)
      .eq('is_auto_apply', true)
      .order('value', { ascending: false }); // Highest discount first

    if (discountsError) {
      console.error('Error fetching discounts:', discountsError);
      return NextResponse.json(
        { error: discountsError.message },
        { status: 500 }
      );
    }

    if (!discounts || discounts.length === 0) {
      return NextResponse.json({ discounts: [] });
    }

    // Filter discounts by date validity
    const now = new Date();
    const validDiscounts = (discounts as DiscountWithServices[]).filter(discount => {
      const startValid = !discount.start_date || new Date(discount.start_date) <= now;
      const endValid = !discount.end_date || new Date(discount.end_date) >= now;
      return startValid && endValid;
    });

    // Map discounts to services
    const result: DiscountResponse[] = [];

    serviceIds.forEach((serviceId, index) => {
      // Find first matching discount for this service (already sorted by value DESC)
      const matchingDiscount = validDiscounts.find(discount =>
        discount.discount_services.some(ds => ds.service_id === serviceId)
      );

      if (matchingDiscount) {
        const response: DiscountResponse = {
          service_id: serviceId,
          discount: {
            id: matchingDiscount.id,
            name_ru: matchingDiscount.name_ru,
            name_en: matchingDiscount.name_en,
            name_cz: matchingDiscount.name_cz,
            discount_type: matchingDiscount.discount_type,
            value: matchingDiscount.value,
            conditions_ru: matchingDiscount.conditions_ru,
            conditions_en: matchingDiscount.conditions_en,
            conditions_cz: matchingDiscount.conditions_cz,
            start_date: matchingDiscount.start_date,
            end_date: matchingDiscount.end_date,
            is_auto_apply: matchingDiscount.is_auto_apply,
            display_badge: matchingDiscount.display_badge,
            active: matchingDiscount.active,
            created_at: matchingDiscount.created_at,
            updated_at: matchingDiscount.updated_at,
          }
        };

        // Calculate discounted price if original price provided
        if (originalPrices.length > 0 && originalPrices[index]) {
          const originalPrice = originalPrices[index];
          let discountedPrice = originalPrice;

          if (matchingDiscount.discount_type === 'percentage') {
            discountedPrice = originalPrice - (originalPrice * matchingDiscount.value / 100);
          } else if (matchingDiscount.discount_type === 'fixed') {
            discountedPrice = Math.max(originalPrice - matchingDiscount.value, 0);
          }

          response.discounted_price = Math.round(discountedPrice * 100) / 100; // Round to 2 decimals
        }

        result.push(response);
      }
    });

    return NextResponse.json({ discounts: result });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
