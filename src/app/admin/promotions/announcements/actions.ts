'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { logCreate, logUpdate, logDelete } from '@/lib/audit'

export type AnnouncementType = 'promo' | 'warning' | 'info' | 'sale'

export type AnnouncementTheme = 'solid' | 'gradient' | 'subtle'

export interface Announcement {
  id: string
  type: AnnouncementType
  theme: AnnouncementTheme
  title_ru: string
  title_en: string
  title_cz: string
  message_ru: string | null
  message_en: string | null
  message_cz: string | null
  start_date: string
  end_date: string | null
  display_order: number
  link_url: string | null
  link_text_ru: string | null
  link_text_en: string | null
  link_text_cz: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface InfoDiscount {
  id: string
  name_ru: string
  name_en: string
  name_cz: string
  discount_type: string
  value: number
}

/**
 * Get all announcements
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching announcements:', error)
      return []
    }

    return (data || []) as Announcement[]
  } catch (error) {
    console.error('Error in getAnnouncements:', error)
    return []
  }
}

/**
 * Get informational discounts (for announcement linking)
 * Note: After migration 007, all discounts are automatic.
 * Informational promotions are now handled as announcements only.
 */
export async function getInfoDiscounts(): Promise<InfoDiscount[]> {
  // No informational discounts exist anymore (migration 007)
  return []
}

interface CreateAnnouncementData {
  type: AnnouncementType
  theme: AnnouncementTheme
  title_ru: string
  title_en: string
  title_cz: string
  message_ru?: string | null
  message_en?: string | null
  message_cz?: string | null
  start_date: string
  end_date?: string | null
  display_order: number
  link_url?: string | null
  link_text_ru?: string | null
  link_text_en?: string | null
  link_text_cz?: string | null
  active: boolean
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Parse form data
    const data: CreateAnnouncementData = {
      type: formData.get('type') as AnnouncementType,
      theme: (formData.get('theme') as AnnouncementTheme) || 'gradient',
      title_ru: (formData.get('title_ru') as string)?.trim(),
      title_en: (formData.get('title_en') as string)?.trim(),
      title_cz: (formData.get('title_cz') as string)?.trim(),
      message_ru: (formData.get('message_ru') as string)?.trim() || null,
      message_en: (formData.get('message_en') as string)?.trim() || null,
      message_cz: (formData.get('message_cz') as string)?.trim() || null,
      start_date: formData.get('start_date') as string,
      end_date: (formData.get('end_date') as string) || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      link_url: (formData.get('link_url') as string)?.trim() || null,
      link_text_ru: (formData.get('link_text_ru') as string)?.trim() || null,
      link_text_en: (formData.get('link_text_en') as string)?.trim() || null,
      link_text_cz: (formData.get('link_text_cz') as string)?.trim() || null,
      active: formData.get('active') === 'true',
    }

    // Validation
    if (!data.title_ru || !data.title_en || !data.title_cz) {
      return { success: false, error: 'All title fields (RU/EN/CZ) are required' }
    }

    if (!data.type || !['promo', 'warning', 'info', 'sale'].includes(data.type)) {
      return { success: false, error: 'Invalid announcement type' }
    }

    if (!data.start_date) {
      return { success: false, error: 'Start date is required' }
    }

    if (data.end_date && data.end_date < data.start_date) {
      return { success: false, error: 'End date must be after start date' }
    }

    if (data.display_order < 0 || data.display_order > 999) {
      return { success: false, error: 'Display order must be between 0 and 999' }
    }

    // Create announcement
    const { data: announcement, error: announcementError } = await supabase
      .from('announcements')
      .insert({
        type: data.type,
        theme: data.theme,
        title_ru: data.title_ru,
        title_en: data.title_en,
        title_cz: data.title_cz,
        message_ru: data.message_ru,
        message_en: data.message_en,
        message_cz: data.message_cz,
        start_date: data.start_date,
        end_date: data.end_date,
        display_order: data.display_order,
        link_url: data.link_url,
        link_text_ru: data.link_text_ru,
        link_text_en: data.link_text_en,
        link_text_cz: data.link_text_cz,
        active: data.active,
      })
      .select()
      .single()

    if (announcementError) {
      console.error('Error creating announcement:', announcementError)
      return { success: false, error: 'Failed to create announcement' }
    }

    // Audit log
    await logCreate('announcements', announcement.id, data as any)

    revalidatePath('/admin/promotions/announcements')
    return { success: true }
  } catch (error) {
    console.error('Error in createAnnouncement:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  announcementId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Parse form data
    const data: CreateAnnouncementData = {
      type: formData.get('type') as AnnouncementType,
      theme: (formData.get('theme') as AnnouncementTheme) || 'gradient',
      title_ru: (formData.get('title_ru') as string)?.trim(),
      title_en: (formData.get('title_en') as string)?.trim(),
      title_cz: (formData.get('title_cz') as string)?.trim(),
      message_ru: (formData.get('message_ru') as string)?.trim() || null,
      message_en: (formData.get('message_en') as string)?.trim() || null,
      message_cz: (formData.get('message_cz') as string)?.trim() || null,
      start_date: formData.get('start_date') as string,
      end_date: (formData.get('end_date') as string) || null,
      display_order: parseInt(formData.get('display_order') as string) || 0,
      link_url: (formData.get('link_url') as string)?.trim() || null,
      link_text_ru: (formData.get('link_text_ru') as string)?.trim() || null,
      link_text_en: (formData.get('link_text_en') as string)?.trim() || null,
      link_text_cz: (formData.get('link_text_cz') as string)?.trim() || null,
      active: formData.get('active') === 'true',
    }

    // Same validation as create
    if (!data.title_ru || !data.title_en || !data.title_cz) {
      return { success: false, error: 'All title fields (RU/EN/CZ) are required' }
    }

    if (!data.type || !['promo', 'warning', 'info', 'sale'].includes(data.type)) {
      return { success: false, error: 'Invalid announcement type' }
    }

    if (!data.start_date) {
      return { success: false, error: 'Start date is required' }
    }

    if (data.end_date && data.end_date < data.start_date) {
      return { success: false, error: 'End date must be after start date' }
    }

    if (data.display_order < 0 || data.display_order > 999) {
      return { success: false, error: 'Display order must be between 0 and 999' }
    }

    // Get old data for audit log
    const { data: oldAnnouncement } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single()

    // Update announcement
    const { error: updateError } = await supabase
      .from('announcements')
      .update({
        type: data.type,
        theme: data.theme,
        title_ru: data.title_ru,
        title_en: data.title_en,
        title_cz: data.title_cz,
        message_ru: data.message_ru,
        message_en: data.message_en,
        message_cz: data.message_cz,
        start_date: data.start_date,
        end_date: data.end_date,
        display_order: data.display_order,
        link_url: data.link_url,
        link_text_ru: data.link_text_ru,
        link_text_en: data.link_text_en,
        link_text_cz: data.link_text_cz,
        active: data.active,
      })
      .eq('id', announcementId)

    if (updateError) {
      console.error('Error updating announcement:', updateError)
      return { success: false, error: 'Failed to update announcement' }
    }

    // Audit log
    if (oldAnnouncement) {
      await logUpdate('announcements', announcementId, oldAnnouncement, data as any)
    }

    revalidatePath('/admin/promotions/announcements')
    return { success: true }
  } catch (error) {
    console.error('Error in updateAnnouncement:', error)
    return { success: false, error: 'Unexpected error' }
  }
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(
  announcementId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get announcement data for audit log
    const { data: announcement, error: fetchError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcementId)
      .single()

    if (fetchError || !announcement) {
      return { success: false, error: 'Announcement not found' }
    }

    // Delete announcement
    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', announcementId)

    if (deleteError) {
      console.error('Error deleting announcement:', deleteError)
      return { success: false, error: 'Failed to delete announcement' }
    }

    // Audit log
    await logDelete('announcements', announcementId, announcement)

    revalidatePath('/admin/promotions/announcements')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteAnnouncement:', error)
    return { success: false, error: 'Unexpected error' }
  }
}
