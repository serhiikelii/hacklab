"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ошибка загрузки
        </h2>
        <p className="text-gray-600 mb-6">
          Не удалось загрузить прайс-лист. Попробуйте обновить страницу.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )
}
