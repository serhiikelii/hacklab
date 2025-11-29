'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2, X, Check } from 'lucide-react'
import { updatePrice, deletePrice } from './actions'
import { useActionState } from 'react'

type Service = {
  id: string
  name_ru: string
  name_en: string
  name_cz: string
  service_type: 'main' | 'extra'
}

type Price = {
  id: string
  service_id: string
  price: number | null
  duration_minutes: number | null
  warranty_months: number | null
  services: Service
}

type PricesTableProps = {
  prices: Price[]
  modelId: string
  categorySlug: string
}

export function PricesTable({
  prices,
  modelId,
  categorySlug,
}: PricesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{
    price: string
    duration_minutes: string
    warranty_months: string
  }>({
    price: '',
    duration_minutes: '',
    warranty_months: '',
  })

  const handleEdit = (price: Price) => {
    setEditingId(price.id)
    setEditData({
      price: price.price?.toString() || '',
      duration_minutes: price.duration_minutes?.toString() || '',
      warranty_months: price.warranty_months?.toString() || '24',
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({ price: '', duration_minutes: '', warranty_months: '' })
  }

  const handleSaveEdit = async (priceId: string) => {
    const formData = new FormData()
    formData.append('service_id', prices.find((p) => p.id === priceId)?.service_id || '')
    formData.append('price', editData.price)
    formData.append('duration_minutes', editData.duration_minutes)
    formData.append('warranty_months', editData.warranty_months)

    const result = await updatePrice(priceId, modelId, categorySlug, null, formData)

    if (result.success) {
      setEditingId(null)
      setEditData({ price: '', duration_minutes: '', warranty_months: '' })
    } else {
      alert(result.message)
    }
  }

  const handleDelete = async (priceId: string, serviceName: string) => {
    if (!confirm(`Delete price for service "${serviceName}"?`)) {
      return
    }

    const result = await deletePrice(priceId, modelId, categorySlug)

    if (!result.success) {
      alert(result.message)
    }
  }

  if (prices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No prices added for this model yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Price (CZK)</TableHead>
            <TableHead className="text-right">Time (min)</TableHead>
            <TableHead className="text-right">Warranty (months)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((price) => {
            const isEditing = editingId === price.id

            return (
              <TableRow key={price.id}>
                <TableCell className="font-medium">
                  {price.services.name_en}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      price.services.service_type === 'main'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {price.services.service_type === 'main' ? 'Repair' : 'Extra Service'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="w-24 text-right"
                      placeholder="0"
                    />
                  ) : (
                    price.price?.toLocaleString() || '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.duration_minutes}
                      onChange={(e) =>
                        setEditData({ ...editData, duration_minutes: e.target.value })
                      }
                      className="w-24 text-right"
                      placeholder="0"
                    />
                  ) : (
                    price.duration_minutes || '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.warranty_months}
                      onChange={(e) =>
                        setEditData({ ...editData, warranty_months: e.target.value })
                      }
                      className="w-24 text-right"
                      placeholder="24"
                    />
                  ) : (
                    price.warranty_months || '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSaveEdit(price.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(price)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleDelete(price.id, price.services.name_en)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
