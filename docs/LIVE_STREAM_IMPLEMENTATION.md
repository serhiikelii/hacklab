# Live Stream Implementation - Онлайн трансляция ремонта

## 📋 Обзор функционала

Функция "Ремонт LIVE" позволяет клиентам наблюдать за процессом ремонта их устройства в режиме реального времени через веб-интерфейс.

**Текущая реализация:**
- ✅ UI компонент с кнопкой "Запись на просмотр" (`ServicePriceTable.tsx`)
- ✅ Диалоговое окно с формой логин/пароль
- ✅ Мультиязычная поддержка (RU/EN/CZ)
- ⏳ Backend аутентификация (TODO)
- ⏳ Видеострим интеграция (TODO)

---

## 🏗️ Архитектура решения

### Вариант 1: WebRTC (Рекомендуемый для low-latency)

**Технологии:**
- **Frontend:** `simple-peer` или `mediasoup-client`
- **Backend:** Mediasoup Server (Node.js)
- **Signaling:** Socket.io для координации соединений

**Преимущества:**
- Минимальная задержка (< 1 сек)
- Peer-to-peer соединение
- Двусторонняя связь (возможность аудио от клиента)

**Недостатки:**
- Сложная настройка NAT/firewall
- Требует STUN/TURN серверы
- Нагрузка на backend для каждого viewer

**Архитектура:**
```
[Камера мастера] → [Mediasoup Server] → [WebRTC] → [Браузер клиента]
                          ↑
                   [Socket.io Signaling]
```

---

### Вариант 2: HLS (HTTP Live Streaming) - Проще в реализации

**Технологии:**
- **Encoding:** FFmpeg для конвертации камеры → HLS
- **CDN:** Cloudflare Stream / AWS CloudFront
- **Player:** Video.js или hls.js

**Преимущества:**
- Простая интеграция
- Масштабируемость через CDN
- Работает везде (HTTP)
- Низкая стоимость

**Недостатки:**
- Задержка 5-15 секунд
- Только односторонний стрим

**Архитектура:**
```
[Камера] → [FFmpeg] → [.m3u8 + .ts segments] → [CDN] → [hls.js Player]
```

---

### Вариант 3: RTMP + Low-Latency HLS (Гибридный)

**Технологии:**
- **Ingest:** OBS Studio (мастер стримит через RTMP)
- **Server:** Nginx-RTMP или Wowza
- **Delivery:** LL-HLS с задержкой ~2-3 сек
- **Player:** hls.js с LL-HLS support

**Преимущества:**
- Баланс между latency и сложностью
- Использование готовых решений (OBS)
- Профессиональный вид стрима

---

## 🔐 Система аутентификации

### Текущий UIFlow:
1. Клиент нажимает "Запись на просмотр"
2. Вводит логин/пароль
3. Получает доступ к трансляции

### Рекомендуемая реализация:

#### База данных (Supabase)
```sql
-- Таблица для токенов доступа к стримам
CREATE TABLE live_stream_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  login VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  stream_url TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Связь с заказами
ALTER TABLE orders ADD COLUMN live_stream_enabled BOOLEAN DEFAULT FALSE;
```

#### Backend API (Next.js API Routes)

**`/api/live-stream/authenticate`**
```typescript
// src/app/api/live-stream/authenticate/route.ts
export async function POST(req: Request) {
  const { login, password } = await req.json();

  // 1. Проверка логин/пароль в Supabase
  const { data: access } = await supabase
    .from('live_stream_access')
    .select('*')
    .eq('login', login)
    .single();

  if (!access || !await bcrypt.compare(password, access.password_hash)) {
    return Response.json({ error: 'Неверные данные' }, { status: 401 });
  }

  // 2. Проверка срока действия
  if (new Date(access.expires_at) < new Date()) {
    return Response.json({ error: 'Доступ истёк' }, { status: 403 });
  }

  // 3. Генерация JWT токена
  const token = jwt.sign(
    { streamId: access.id, orderId: access.order_id },
    process.env.JWT_SECRET!,
    { expiresIn: '4h' }
  );

  return Response.json({
    token,
    streamUrl: access.stream_url,
    expiresAt: access.expires_at
  });
}
```

**`/api/live-stream/validate-token`**
```typescript
// Middleware для проверки токена перед доступом к стриму
export async function GET(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return Response.json({ valid: true, payload });
  } catch {
    return Response.json({ valid: false }, { status: 401 });
  }
}
```

#### Frontend интеграция

**Обновить `ServicePriceTable.tsx`:**
```typescript
const handleSubmitAccess = async () => {
  try {
    const res = await fetch('/api/live-stream/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    });

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error);
      return;
    }

    const { token, streamUrl } = await res.json();

    // Сохранить токен
    localStorage.setItem('liveStreamToken', token);

    // Открыть страницу стрима
    window.open(`/live-stream?token=${token}`, '_blank');

    setIsLiveStreamDialogOpen(false);
  } catch (error) {
    toast.error('Ошибка подключения');
  }
};
```

---

## 📹 Страница просмотра стрима

**`src/app/live-stream/page.tsx`:**
```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function LiveStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'error'>('loading');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    // Валидация токена
    fetch('/api/live-stream/validate-token', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(({ valid, payload }) => {
        if (!valid) {
          setStatus('error');
          return;
        }

        // Получить stream URL
        return fetch(`/api/live-stream/url?orderId=${payload.orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      })
      .then(res => res.json())
      .then(({ streamUrl }) => {
        // Инициализация HLS плеера
        if (Hls.isSupported() && videoRef.current) {
          const hls = new Hls({
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
            setStatus('playing');
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            setStatus('error');
          });
        }
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {status === 'loading' && (
        <div className="text-white text-xl">Подключение к трансляции...</div>
      )}

      {status === 'playing' && (
        <div className="w-full max-w-6xl">
          <video
            ref={videoRef}
            className="w-full aspect-video bg-black"
            controls
            playsInline
          />
          <div className="mt-4 text-white text-center">
            <span className="inline-flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-white text-center">
          <div className="text-xl mb-2">⚠️ Ошибка доступа</div>
          <p className="text-gray-400">Проверьте правильность данных или обратитесь в поддержку</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🛠️ Технический стек (Рекомендации)

### Для простого MVP (HLS):
```json
{
  "dependencies": {
    "hls.js": "^1.4.12",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

### Для production (WebRTC):
```json
{
  "dependencies": {
    "mediasoup-client": "^3.6.102",
    "socket.io-client": "^4.6.1"
  },
  "backend": {
    "mediasoup": "^3.12.16",
    "socket.io": "^4.6.1"
  }
}
```

---

## 📊 Workflow создания доступа для клиента

### Admin панель (`/admin/orders/[id]`)

Добавить кнопку "Создать доступ к Live Stream":

```typescript
async function generateLiveStreamAccess(orderId: string) {
  // 1. Генерация случайного логина/пароля
  const login = `repair_${Math.random().toString(36).substr(2, 8)}`;
  const password = generateSecurePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  // 2. Создание записи в БД
  const { data } = await supabase
    .from('live_stream_access')
    .insert({
      order_id: orderId,
      login,
      password_hash: passwordHash,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // +24 часа
    })
    .select()
    .single();

  // 3. Отправка данных клиенту (email/SMS)
  await sendAccessCredentials({
    to: customerEmail,
    login,
    password,
    link: `https://mojservice.cz/pricelist/iphone/${modelSlug}#live-stream`
  });

  return data;
}
```

---

## 🚀 Поэтапная реализация

### Фаза 1: MVP (2-3 дня)
- [ ] Настроить FFmpeg → HLS pipeline
- [ ] Создать таблицу `live_stream_access` в Supabase
- [ ] Реализовать API `/authenticate` и `/validate-token`
- [ ] Интегрировать hls.js плеер на `/live-stream`
- [ ] Добавить генерацию доступов в admin панели

### Фаза 2: Production (1-2 недели)
- [ ] Настроить CDN (Cloudflare Stream)
- [ ] Добавить Low-Latency HLS
- [ ] Реализовать email уведомления с доступами
- [ ] Добавить статистику просмотров
- [ ] Тестирование на разных устройствах

### Фаза 3: Advanced (опционально)
- [ ] Миграция на WebRTC для < 1 сек latency
- [ ] Двусторонняя аудио связь (мастер ↔ клиент)
- [ ] Запись стримов для истории
- [ ] Мультикамерный просмотр

---

## 💰 Стоимость решений

| Решение | Setup Cost | Monthly Cost (100 стримов) |
|---------|-----------|---------------------------|
| **Self-hosted HLS** | $0 | $20-50 (VPS) |
| **Cloudflare Stream** | $0 | $1/1000 мин (~$50-100) |
| **AWS IVS** | $0 | $0.015/мин (~$90) |
| **WebRTC (self-hosted)** | $0 | $50-100 (VPS + TURN) |

**Рекомендация:** Начать с self-hosted HLS на существующем VPS, затем масштабировать через Cloudflare Stream.

---

## 📝 Следующие шаги

1. **Выбрать стратегию:** HLS (простота) vs WebRTC (latency)
2. **Настроить инфраструктуру:** FFmpeg + Nginx-RTMP или Cloudflare
3. **Реализовать аутентификацию:** API routes + JWT токены
4. **Создать страницу плеера:** `/live-stream` с hls.js
5. **Интегрировать в admin:** Генерация доступов для заказов
6. **Тестирование:** Проверка на разных устройствах/браузерах

---

## 🔗 Полезные ресурсы

- [HLS.js Documentation](https://github.com/video-dev/hls.js/)
- [Mediasoup WebRTC](https://mediasoup.org/)
- [Cloudflare Stream](https://www.cloudflare.com/products/cloudflare-stream/)
- [FFmpeg HLS Guide](https://trac.ffmpeg.org/wiki/StreamingGuide)
- [OBS Studio](https://obsproject.com/)
