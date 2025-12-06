'use client'

import { useState } from 'react'
import { updateModel } from '../actions'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EditModelFormProps {
  model: {
    id: string
    name: string
    release_year: number
    order: number
  }
  categorySlug: string
}

export function EditModelForm({ model, categorySlug }: EditModelFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

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

    formData.append('id', model.id)
    formData.append('category_slug', categorySlug)

    const result = await updateModel(formData)

    if (result.success) {
      setSuccess(true)
      // Small delay before redirect to show success message
      setTimeout(() => {
        router.push(`/admin/catalog/${categorySlug}/models`)
      }, 1000)
    } else {
      setError(result.error || 'Error updating model')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Basic Properties</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Model successfully updated! Redirecting...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Model name */}
        <div className="sm:col-span-2">
          <Label htmlFor="name">
            Model Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            defaultValue={model.name}
            disabled={loading || success}
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
            defaultValue={model.release_year}
            disabled={loading || success}
          />
        </div>
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
          defaultValue={model.order}
          disabled={loading || success}
          className="max-w-xs"
        />
        <p className="mt-1 text-sm text-gray-500">
          Used for sorting models in the list
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading || success}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading || success}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
