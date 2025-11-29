export default async function NewModelPage({
  params,
}: {
  params: Promise<{ category_slug: string }>
}) {
  const { category_slug } = await params
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Creating new model for: {category_slug}
        </h2>
        <p className="text-gray-600">
          Model creation form will be implemented in Stage 3
        </p>
      </div>
    </div>
  )
}
