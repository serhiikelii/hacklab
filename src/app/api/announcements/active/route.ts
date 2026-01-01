import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Announcement, AnnouncementType, DiscountType } from '@/types/pricelist';

interface AnnouncementFromDB {
  id: string;
  type: string;
  title_ru: string;
  title_en: string;
  title_cz: string;
  message_ru: string | null;
  message_en: string | null;
  message_cz: string | null;
  start_date: string;
  end_date: string | null;
  display_order: number;
  background_color: string | null;
  text_color: string | null;
  icon: string | null;
  link_url: string | null;
  link_text_ru: string | null;
  link_text_en: string | null;
  link_text_cz: string | null;
  discount_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  discount: {
    id: string;
    name_ru: string;
    name_en: string;
    name_cz: string;
    discount_type: string;
    value: number;
  } | null;
}

/**
 * GET /api/announcements/active
 *
 * Retrieves active announcements for banner carousel
 *
 * Returns:
 * - Array of active announcements sorted by display_order
 * - Only returns announcements within their validity period
 * - Includes linked discount information if available
 */
export async function GET() {
  try {
    const now = new Date().toISOString();

    // Fetch active announcements with optional discount info
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .select(`
        *,
        discount:discounts(
          id,
          name_ru,
          name_en,
          name_cz,
          discount_type,
          value
        )
      `)
      .eq('active', true)
      .lte('start_date', now) // start_date <= now
      .or(`end_date.is.null,end_date.gte.${now}`) // end_date is null OR end_date >= now
      .order('display_order', { ascending: true }); // Lower number = higher priority

    if (announcementsError) {
      console.error('Error fetching announcements:', announcementsError);
      return NextResponse.json(
        { error: announcementsError.message },
        { status: 500 }
      );
    }

    if (!announcements || announcements.length === 0) {
      return NextResponse.json({ announcements: [] });
    }

    // Transform data to match TypeScript interface
    const result: Announcement[] = (announcements as AnnouncementFromDB[]).map(announcement => ({
      id: announcement.id,
      type: announcement.type as AnnouncementType,
      title_ru: announcement.title_ru,
      title_en: announcement.title_en,
      title_cz: announcement.title_cz,
      message_ru: announcement.message_ru,
      message_en: announcement.message_en,
      message_cz: announcement.message_cz,
      start_date: announcement.start_date,
      end_date: announcement.end_date,
      display_order: announcement.display_order,
      background_color: announcement.background_color,
      text_color: announcement.text_color,
      icon: announcement.icon,
      link_url: announcement.link_url,
      link_text_ru: announcement.link_text_ru,
      link_text_en: announcement.link_text_en,
      link_text_cz: announcement.link_text_cz,
      discount_id: announcement.discount_id,
      discount: announcement.discount ? {
        id: announcement.discount.id,
        name_ru: announcement.discount.name_ru,
        name_en: announcement.discount.name_en,
        name_cz: announcement.discount.name_cz,
        discount_type: announcement.discount.discount_type as DiscountType,
        value: announcement.discount.value,
        conditions_ru: null,
        conditions_en: null,
        conditions_cz: null,
        start_date: null,
        end_date: null,
        display_badge: false,
        active: true,
        created_at: '',
        updated_at: '',
      } : undefined,
      active: announcement.active,
      created_at: announcement.created_at,
      updated_at: announcement.updated_at,
    }));

    return NextResponse.json({ announcements: result });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
