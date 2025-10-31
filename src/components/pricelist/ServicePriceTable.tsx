'use client';

import { DeviceModel, Service, ServicePrice } from '@/types/pricelist';
import { ServiceRow } from './ServiceRow';

export interface ServicePriceTableProps {
  model: DeviceModel;
  services: Service[];
  prices: ServicePrice[];
  onReserve?: (service: Service, model: DeviceModel) => void;
}

/**
 * ServicePriceTable - таблица услуг с ценами для модели устройства
 *
 * Отображает все доступные услуги ремонта для конкретной модели
 * с ценами, гарантией и кнопками бронирования.
 * Используется на странице модели (/pricelist/iphone-15-pro-max).
 *
 * @example
 * ```tsx
 * <ServicePriceTable
 *   model={iphone15ProMax}
 *   services={allServices}
 *   prices={pricesForModel}
 *   onReserve={handleReservation}
 * />
 * ```
 */
export function ServicePriceTable({
  model,
  services,
  prices,
  onReserve,
}: ServicePriceTableProps) {
  // Группируем услуги по категориям
  const mainServices = services.filter((s) => s.category === 'main');
  const extraServices = services.filter((s) => s.category === 'extra');

  // Создаем map цен для быстрого доступа
  const priceMap = new Map(
    prices.map((p) => [p.serviceId, p])
  );

  const handleReserve = (service: Service) => {
    onReserve?.(service, model);
  };

  // Проверяем, есть ли цены
  const hasPrices = prices.length > 0;
  const hasServices = services.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {model.name}
        </h1>
        <p className="text-lg text-gray-600">
          Прайс-лист услуг по ремонту
        </p>
      </div>

      {/* Empty Prices State - показываем, если нет цен но есть услуги */}
      {!hasPrices && hasServices && (
        <div className="mb-10">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Цены скоро будут добавлены
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Мы работаем над обновлением прайс-листа для {model.name}.
              Пожалуйста, свяжитесь с нами для уточнения стоимости ремонта.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+420607855558"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600
                         text-white font-semibold rounded-lg shadow-md hover:shadow-lg
                         transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">📞</span>
                Позвонить
              </a>
              <a
                href="https://t.me/mojservice"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-800
                         text-white font-semibold rounded-lg shadow-md hover:shadow-lg
                         transition-all duration-200 transform hover:scale-105"
              >
                <span className="mr-2">💬</span>
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Services Section */}
      {mainServices.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-gray-700 mr-2">🔧</span>
            Основные услуги
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="divide-y divide-gray-100">
              {mainServices.map((service) => {
                const price = priceMap.get(service.id);
                return (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    price={price}
                    onReserve={() => handleReserve(service)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Extra Services Section */}
      {extraServices.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-green-600 mr-2">✨</span>
            Дополнительные услуги
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="divide-y divide-gray-100">
              {extraServices.map((service) => {
                const price = priceMap.get(service.id);
                return (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    price={price}
                    onReserve={() => handleReserve(service)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Warranty Info - показываем только если есть цены */}
      {hasPrices && (
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">✅</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                2 года гарантии на все ремонты
              </h3>
              <p className="text-sm text-gray-700">
                Мы уверены в качестве наших услуг и предоставляем расширенную гарантию
                на все выполненные работы.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info - показываем всегда */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon="🆓"
          title="Бесплатная диагностика*"
          description="*При ремонте"
        />
        <InfoCard
          icon="⚡"
          title="Быстрый ремонт"
          description="Пока вы ждете"
        />
        <InfoCard
          icon="💼"
          title="Профессионально"
          description="Опытные мастера"
        />
      </div>

      {/* Empty State - нет услуг вообще */}
      {!hasServices && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔧</div>
          <p className="text-gray-500 text-lg mb-2">
            Услуги для этой модели временно недоступны
          </p>
          <p className="text-gray-400 text-sm">
            Пожалуйста, свяжитесь с нами для получения информации
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * InfoCard - информационная карточка
 */
interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
