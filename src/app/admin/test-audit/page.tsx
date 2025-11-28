import { testAuditSystem } from './actions'

export default function TestAuditPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧪 Test Audit System</h1>
      <form action={testAuditSystem}>
        <button
          type="submit"
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Test Audit Logging
        </button>
      </form>
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Инструкции:</h3>
        <ol>
          <li>Убедитесь что вы залогинены в админ панель</li>
          <li>Нажмите кнопку &quot;Test Audit Logging&quot;</li>
          <li>Проверьте логи в терминале (консоль где запущен npm run dev)</li>
          <li>Проверьте таблицу audit_log в БД</li>
        </ol>
        <p><strong>Ожидаемый результат:</strong> В логах должны появиться сообщения [getCurrentAdminId] и [logAuditEvent], и запись должна появиться в audit_log с корректным admin_id</p>
      </div>
    </div>
  )
}
