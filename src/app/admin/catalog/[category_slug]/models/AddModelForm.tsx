'use client'

import { useState, useEffect } from 'react'
import { createModel, getMaxOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'

interface AddModelFormProps {
  categoryId: string
  categorySlug: string
}

export function AddModelForm({ categoryId, categorySlug }: AddModelFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxOrder, setMaxOrder] = useState<number>(0)

  // Load maximum order when form opens
  useEffect(() => {
    if (isOpen) {
      getMaxOrder(categoryId).then(setMaxOrder)
    }
  }, [isOpen, categoryId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    // Client-side validation
    const name = formData.get('name') as string
    const releaseYear = formData.get('release_year') as string
    const order = formData.get('order') as string

    if (!name?.trim()) {
      setError('Model name is required')
      setLoading(false)
      return
    }

    const year = parseInt(releaseYear)
    if (!releaseYear || isNaN(year) || year < 2000 || year > 2030) {
      setError('Release year must be between 2000 and 2030')
      setLoading(false)
      return
    }

    if (!order || parseInt(order) < 1) {
      setError('Sort order must be at least 1')
      setLoading(false)
      return
    }

    formData.append('category_id', categoryId)

    const result = await createModel(formData)

    if (result.success) {
      // Close form and reset state
      setIsOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } else {
      setError(result.error || 'Error creating model')
    }

    setLoading(false)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="primary" className="mb-4">
        <Plus className="h-4 w-4 mr-2" />
        Add Model
      </Button>
    )
  }

  const recommendedOrder = maxOrder + 1

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">Add New Model</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsOpen(false)
            setError('')
          }}
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Model name */}
        <div>
          <Label htmlFor="name">
            Model Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g.: iPhone 15 Pro"
            disabled={loading}
          />
        </div>

        {/* Release year */}
        <div>
          <Label htmlFor="release_year">
            Release Year <span className="text-red-500">*</span>
          </Label>
          <Input
            id="release_year"
            name="release_year"
            type="number"
            min="2000"
            max="2030"
            defaultValue={new Date().getFullYear()}
            disabled={loading}
          />
        </div>

        {/* Sort Order */}
        <div>
          <Label htmlFor="order">
            Sort Order <span className="text-red-500">*</span>
          </Label>
          <Input
            id="order"
            name="order"
            type="number"
            min="1"
            defaultValue={recommendedOrder}
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Current max order: <strong>{maxOrder}</strong>. Recommended:{' '}
            <strong>{recommendedOrder}</strong> (step 1)
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? 'Creating...' : 'Create Model'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false)
              setError('')
            }}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
