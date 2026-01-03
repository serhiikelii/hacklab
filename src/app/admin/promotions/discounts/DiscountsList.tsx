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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { DiscountDialog } from '@/components/admin/DiscountDialog'
import type { Discount } from '@/types/pricelist'

interface DiscountsListProps {
  discounts: Discount[]
}

export function DiscountsList({ discounts }: DiscountsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [discountToDelete, setDiscountToDelete] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setDiscountToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!discountToDelete) return

    setDeletingId(discountToDelete)
    setDeleteDialogOpen(false)

    const result = await deleteDiscount(discountToDelete)

    // Note: Error handling via router.refresh() in server action
    // No need for client-side error logging

    setDeletingId(null)
    setDiscountToDelete(null)
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
                  <div>{discount.name_en}</div>
                  {discount.conditions_en && (
                    <div className="text-xs text-gray-500 mt-1">
                      {discount.conditions_en.length > 50
                        ? `${discount.conditions_en.substring(0, 50)}...`
                        : discount.conditions_en}
                    </div>
                  )}
                </div>
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
                    onClick={() => handleDeleteClick(discount.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this discount.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
