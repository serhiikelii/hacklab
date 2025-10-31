import { Check } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Главный заголовок */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          HackLab – Ваш надежный сервисный центр Apple в Праге
        </h1>

        {/* Вводные параграфы */}
        <p className="text-gray-700 leading-relaxed mb-4">
          HackLab — это современный и надежный сервисный центр Apple в Праге, которому доверяют
          владельцы техники Apple и других брендов. Даже самые прочные устройства со временем
          требуют внимания — ведь случайное падение, удар, попадание влаги или просто износ
          комплектующих могут привести к сбоям и поломкам.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Наши специалисты ежедневно восстанавливают десятки iPhone, iPad, MacBook, Apple Watch
          и другой техники, возвращая её к идеальной работе. Мы понимаем, насколько важна ваша
          техника, поэтому делаем всё, чтобы ремонт занял минимум времени и принес максимум результата.
        </p>

        {/* Блок: Почему выбирают HackLab */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          Почему выбирают HackLab
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          Сегодня в Праге можно найти множество сервисов, предлагающих ремонт Apple.
          Но если вы цените качество, прозрачность и профессионализм — HackLab станет
          вашим надежным партнером. Мы предлагаем:
        </p>

        <ul className="space-y-2 mb-4 ml-6">
          <li className="flex items-start gap-2 text-gray-700 leading-relaxed">
            <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>оригинальные запчасти и проверенные комплектующие</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 leading-relaxed">
            <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>точную диагностику и грамотный подход к каждому устройству</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 leading-relaxed">
            <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>квалифицированных мастеров с опытом работы более 5 лет</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 leading-relaxed">
            <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>удобные адреса сервисных центров в разных районах Праги</span>
          </li>
          <li className="flex items-start gap-2 text-gray-700 leading-relaxed">
            <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>гарантию на все виды работ и деталей</span>
          </li>
        </ul>

        <p className="text-gray-700 leading-relaxed mb-4">
          Наши мастерские оснащены современным оборудованием, что позволяет выполнять
          даже компонентный ремонт — замену микросхем, восстановление материнских плат,
          пайку контактов и многое другое.
        </p>

        {/* Блок: Что мы ремонтируем */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          Что мы ремонтируем
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          В HackLab вы можете получить профессиональный ремонт любой сложности:
        </p>

        <ul className="space-y-2 mb-4 ml-6">
          <li className="text-gray-700 leading-relaxed">замена экрана или стекла</li>
          <li className="text-gray-700 leading-relaxed">восстановление после попадания воды</li>
          <li className="text-gray-700 leading-relaxed">устранение последствий падений и ударов</li>
          <li className="text-gray-700 leading-relaxed">замена аккумулятора</li>
          <li className="text-gray-700 leading-relaxed">ремонт разъёмов и кнопок</li>
          <li className="text-gray-700 leading-relaxed">перепрошивка и обновление системы</li>
          <li className="text-gray-700 leading-relaxed">восстановление данных и разблокировка устройств</li>
        </ul>

        <p className="text-gray-700 leading-relaxed mb-4">
          Если ваш iPhone зависает, самопроизвольно выключается, не заряжается или не реагирует
          на касания — просто принесите его к нам. Мы проведем диагностику и предложим оптимальное
          решение по времени и стоимости.
        </p>

        {/* Блок: Профессиональная диагностика и обслуживание */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          Профессиональная диагностика и обслуживание
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          Каждое устройство проходит детальную диагностику перед началом ремонта. Это позволяет
          точно определить причину неисправности и подобрать правильный способ восстановления.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          После завершения всех работ мы проводим тестирование, чтобы убедиться, что гаджет
          работает как новый.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          HackLab — это сервис, где ценят качество, честность и комфорт клиента.
          Мы не просто ремонтируем технику — мы восстанавливаем ваше удобство,
          продуктивность и настроение.
        </p>

        {/* Блок: Курьерская доставка */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          Курьерская доставка и дистанционный сервис
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          Если у вас нет времени приехать лично — не проблема. Мы предлагаем курьерскую доставку
          по всей Чехии: просто оставьте заявку на сайте, и мы организуем забор устройства из
          вашего дома или офиса. После ремонта ваш гаджет будет оперативно доставлен обратно
          в исправном состоянии.
        </p>

        {/* Заключительный блок */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
          We don't hack, we fix!
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          С каждым месяцем всё больше клиентов выбирают HackLab за качество, скорость и внимательное
          отношение к деталям. Мы постоянно расширяем сеть сервисных центров в Праге, чтобы быть
          ещё ближе к вам и вашей технике.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          HackLab — это команда профессионалов, для которых ремонт Apple и другой электроники —
          не просто работа, а настоящее призвание.
        </p>

        <p className="text-gray-700 leading-relaxed">
          Доверьте свой гаджет экспертам, и он снова будет работать так же безупречно,
          как в первый день.
        </p>
      </div>
    </section>
  )
}
