import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Discount, DiscountedPrice } from '@/types/pricelist';

interface DiscountWithCategoryServices extends Discount {
  discount_category_services: Array<{ category_service_id: string }>;
}

interface DiscountResponse {
  category_service_id: string;
  discount: Discount;
  discounted_price?: number;
}

/**
 * GET /api/discounts/active
 *
 * Retrieves active automatic discounts for specified category-service combinations
 *
 * Query params:
 * - category_service_ids: comma-separated list of category_service UUIDs
 * - original_prices: optional comma-separated list of prices (same order as category_service_ids)
 *
 * Returns:
 * - Array of active discounts mapped to category-service combinations
 * - Calculated discounted prices if original_prices provided
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryServiceIdsParam = searchParams.get('category_service_ids');
    const originalPricesParam = searchParams.get('original_prices');

    // Validate required parameters
    if (!categoryServiceIdsParam) {
      return NextResponse.json(
        { error: 'category_service_ids parameter is required' },
        { status: 400 }
      );
    }

    const categoryServiceIds = categoryServiceIdsParam.split(',').map(id => id.trim());
    const originalPrices = originalPricesParam
      ? originalPricesParam.split(',').map(p => parseFloat(p.trim()))
      : [];

    if (categoryServiceIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one category_service_id is required' },
        { status: 400 }
      );
    }

    // Validate prices if provided
    if (originalPrices.length > 0 && originalPrices.length !== categoryServiceIds.length) {
      return NextResponse.json(
        { error: 'Number of original_prices must match number of category_service_ids' },
        { status: 400 }
      );
    }

    // Fetch active automatic discounts with their linked category-service combinations
    const { data: discounts, error: discountsError } = await supabase
      .from('discounts')
      .select(`
        *,
        discount_category_services(category_service_id)
      `)
      .eq('active', true)
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
    const validDiscounts = (discounts as DiscountWithCategoryServices[]).filter(discount => {
      const startValid = !discount.start_date || new Date(discount.start_date) <= now;
      const endValid = !discount.end_date || new Date(discount.end_date) >= now;
      return startValid && endValid;
    });

    // Map discounts to category-service combinations
    const result: DiscountResponse[] = [];

    categoryServiceIds.forEach((categoryServiceId, index) => {
      // Find first matching discount for this category-service combination (already sorted by value DESC)
      const matchingDiscount = validDiscounts.find(discount =>
        discount.discount_category_services.some(dcs => dcs.category_service_id === categoryServiceId)
      );

      if (matchingDiscount) {
        const response: DiscountResponse = {
          category_service_id: categoryServiceId,
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

          // Round to nearest 10 for clean pricing (1490, 1500, 1350 instead of 1495, 1493)
          response.discounted_price = Math.round(discountedPrice / 10) * 10;
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
