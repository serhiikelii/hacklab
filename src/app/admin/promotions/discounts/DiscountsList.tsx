'use client'

import { useState } from 'react'
import { deleteDiscount } from './actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { DiscountDialog } from '@/components/admin/DiscountDialog'
import type { Discount } from '@/types/pricelist'

interface DiscountsListProps {
  discounts: Discount[]
}

export function DiscountsList({ discounts }: DiscountsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this discount? This action cannot be undone.'
      )
    ) {
      return
    }

    setDeletingId(id)
    const result = await deleteDiscount(id)

    if (!result.success) {
      alert(result.error || 'Failed to delete discount')
    }

    setDeletingId(null)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const getDiscountDisplay = (discount: Discount) => {
    if (discount.discount_type === 'percentage') {
      return `${discount.value}%`
    } else if (discount.discount_type === 'fixed') {
      return `${discount.value} Kč`
    } else {
      return discount.value.toString()
    }
  }

  const getStatusBadge = (discount: Discount) => {
    const now = new Date()
    const endDate = discount.end_date ? new Date(discount.end_date) : null

    if (!discount.active) {
      return <Badge variant="secondary">Inactive</Badge>
    }

    if (endDate && endDate < now) {
      return <Badge variant="destructive">Expired</Badge>
    }

    return <Badge variant="default" className="bg-green-600">Active</Badge>
  }

  const getTypeBadge = (isAutoApply: boolean | undefined) => {
    if (isAutoApply) {
      return (
        <Badge variant="default" className="bg-blue-600">
          Auto
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-purple-600 text-purple-600">
        Info
      </Badge>
    )
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No discounts yet. Create your first one!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{discount.name_ru}</div>
                  {discount.conditions_ru && (
                    <div className="text-xs text-gray-500 mt-1">
                      {discount.conditions_ru.length > 50
                        ? `${discount.conditions_ru.substring(0, 50)}...`
                        : discount.conditions_ru}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getTypeBadge(discount.is_auto_apply)}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {getDiscountDisplay(discount)}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {discount.discount_type}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{formatDate(discount.start_date)} -</div>
                  <div>{formatDate(discount.end_date)}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(discount)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <DiscountDialog
                    discount={discount}
                    trigger={
                      <Button variant="ghost" size="sm" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                    open={editingId === discount.id}
                    onOpenChange={(open) => setEditingId(open ? discount.id : null)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(discount.id)}
                    disabled={deletingId === discount.id}
                    title="Delete"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
