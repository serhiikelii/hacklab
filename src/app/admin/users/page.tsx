'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Admin = {
  id: string
  email: string
  role: 'editor' | 'admin' | 'superadmin'
  is_active: boolean
  created_at: string
  last_login_at: string | null
}

type CurrentUser = {
  role: 'editor' | 'admin' | 'superadmin'
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkAccess()
    loadAdmins()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function checkAccess() {
    // Check if current user is superadmin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/admin/login')
      return
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!adminData || adminData.role !== 'superadmin') {
      setError('У вас нет прав для просмотра этой страницы (только superadmin)')
      setLoading(false)
      return
    }

    setCurrentUser({ role: adminData.role })
  }

  async function loadAdmins() {
    try {
      const { data, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setAdmins(data || [])
    } catch (err) {
      setError('Ошибка загрузки списка администраторов')
    } finally {
      setLoading(false)
    }
  }

  async function toggleAdminActive(adminId: string, currentActive: boolean) {
    const { error: updateError } = await supabase
      .from('admins')
      .update({ is_active: !currentActive })
      .eq('id', adminId)

    if (updateError) {
      alert('Ошибка обновления статуса: ' + updateError.message)
      return
    }

    loadAdmins()
  }

  async function deleteAdmin(adminId: string, email: string) {
    if (
      !confirm(
        `Вы уверены, что хотите удалить администратора ${email}?\n\nВнимание: это действие нельзя отменить!`
      )
    ) {
      return
    }

    const { error: deleteError } = await supabase
      .from('admins')
      .delete()
      .eq('id', adminId)

    if (deleteError) {
      alert('Ошибка удаления: ' + deleteError.message)
      return
    }

    loadAdmins()
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800'
      case 'admin':
        return 'bg-blue-100 text-blue-800'
      case 'editor':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Суперадмин'
      case 'admin':
        return 'Администратор'
      case 'editor':
        return 'Редактор'
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    )
  }

  if (error && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Доступ запрещен</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link
            href="/admin"
            className="inline-block text-indigo-600 hover:text-indigo-800"
          >
            ← Вернуться в админ-панель
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-800">
              ← Назад в админ-панель
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Управление администраторами
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Только для superadmin. Просмотр и управление учетными записями
              администраторов.
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Добавить администратора
          </Link>
        </div>

        {error && currentUser && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Последний вход
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Создан
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Нет администраторов
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          admin.role
                        )}`}
                      >
                        {getRoleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Активен
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Отключен
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.last_login_at
                        ? new Date(admin.last_login_at).toLocaleString('ru-RU')
                        : 'Никогда'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          toggleAdminActive(admin.id, admin.is_active)
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {admin.is_active ? 'Отключить' : 'Включить'}
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin.id, admin.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            ⚠️ Важная информация
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • Новых администраторов можно создать только через Supabase Dashboard
            </li>
            <li>
              • Сначала создайте пользователя в Authentication → Users, затем
              добавьте его в таблицу admins
            </li>
            <li>• Публичная регистрация отключена для безопасности</li>
            <li>
              • Будьте осторожны с удалением - это действие необратимо
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
