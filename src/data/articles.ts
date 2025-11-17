import { Article } from "@/types/article"

export const articles: Article[] = [
  {
    id: "1",
    slug: "5-priznakov-zameny-batarei-iphone",
    title: {
      ru: "5 признаков того, что пора менять батарею iPhone",
      en: "5 Signs It's Time to Replace Your iPhone Battery",
      cz: "5 příznaků, že je čas vyměnit baterii iPhone"
    },
    excerpt: {
      ru: "Батарея вашего iPhone быстро разряжается? Телефон неожиданно выключается? Узнайте, когда пришло время заменить аккумулятор и как продлить срок его службы.",
      en: "Is your iPhone battery draining quickly? Does your phone shut down unexpectedly? Learn when it's time to replace the battery and how to extend its lifespan.",
      cz: "Vybíjí se vám baterie iPhonu rychle? Vypíná se telefon nečekaně? Zjistěte, kdy je čas vyměnit baterii a jak prodloužit její životnost."
    },
    content: {
      ru: `
      <p>Батарея смартфона — один из самых важных компонентов, который напрямую влияет на комфорт использования устройства. Со временем литий-ионные аккумуляторы теряют свою емкость, и это совершенно нормальный процесс. Но как понять, что пора заменить батарею?</p>

      <h3>1. Быстрая разрядка</h3>
      <p>Самый очевидный признак — ваш iPhone разряжается значительно быстрее, чем раньше. Если раньше заряда хватало на целый день активного использования, а теперь приходится заряжать телефон дважды в день, это явный сигнал.</p>

      <h3>2. Неожиданные выключения</h3>
      <p>Телефон выключается при 20-30% заряда? Это один из самых распространенных симптомов износа батареи. Контроллер питания не может правильно определить реальный уровень заряда.</p>

      <h3>3. Низкая максимальная емкость</h3>
      <p>Зайдите в Настройки → Аккумулятор → Состояние аккумулятора. Если максимальная емкость ниже 80%, Apple рекомендует заменить батарею. При емкости менее 85% уже заметно снижение производительности.</p>

      <h3>4. Телефон нагревается во время зарядки</h3>
      <p>Небольшое нагревание — это нормально, но если iPhone становится горячим даже при простой зарядке или использовании легких приложений, батарея может быть повреждена.</p>

      <h3>5. Вздутие батареи</h3>
      <p>Это самый опасный признак! Если вы заметили, что экран начал отходить от корпуса, или корпус деформировался — немедленно прекратите использование телефона и обратитесь в сервис. Вздутая батарея может взорваться.</p>

      <h3>Как продлить жизнь батареи?</h3>
      <ul>
        <li>Избегайте полной разрядки — оптимально держать заряд в диапазоне 20-80%</li>
        <li>Не оставляйте телефон на зарядке на всю ночь</li>
        <li>Избегайте перегрева — не оставляйте iPhone на солнце</li>
        <li>Используйте оригинальные зарядные устройства</li>
        <li>Обновляйте iOS — новые версии часто включают оптимизацию энергопотребления</li>
      </ul>

      <p><strong>Заключение:</strong> Своевременная замена батареи не только вернет комфортное время работы, но и защитит от потенциальных проблем с безопасностью. В нашем сервисе замена аккумулятора iPhone занимает всего 20-30 минут, используются качественные батареи с гарантией 2 года.</p>
    `,
      en: `
      <p>A smartphone battery is one of the most important components that directly affects the comfort of using your device. Over time, lithium-ion batteries lose their capacity, and this is a completely normal process. But how do you know when it's time to replace the battery?</p>

      <h3>1. Rapid Discharge</h3>
      <p>The most obvious sign is that your iPhone drains much faster than before. If the charge used to last a full day of active use, but now you have to charge your phone twice a day, this is a clear signal.</p>

      <h3>2. Unexpected Shutdowns</h3>
      <p>Does your phone shut down at 20-30% charge? This is one of the most common symptoms of battery wear. The power controller cannot correctly determine the actual charge level.</p>

      <h3>3. Low Maximum Capacity</h3>
      <p>Go to Settings → Battery → Battery Health. If the maximum capacity is below 80%, Apple recommends replacing the battery. At capacities below 85%, performance degradation is already noticeable.</p>

      <h3>4. Phone Heats Up During Charging</h3>
      <p>Slight heating is normal, but if your iPhone becomes hot even during simple charging or using light apps, the battery may be damaged.</p>

      <h3>5. Battery Swelling</h3>
      <p>This is the most dangerous sign! If you notice that the screen has started to come away from the case, or the case has deformed — immediately stop using the phone and contact a service center. A swollen battery can explode.</p>

      <h3>How to Extend Battery Life?</h3>
      <ul>
        <li>Avoid full discharge — optimally keep the charge in the 20-80% range</li>
        <li>Don't leave the phone charging overnight</li>
        <li>Avoid overheating — don't leave your iPhone in the sun</li>
        <li>Use original chargers</li>
        <li>Update iOS — new versions often include power consumption optimization</li>
      </ul>

      <p><strong>Conclusion:</strong> Timely battery replacement will not only restore comfortable operating time, but also protect against potential safety issues. At our service center, iPhone battery replacement takes only 20-30 minutes, using quality batteries with a 2-year warranty.</p>
    `,
      cz: `
      <p>Baterie smartphonu je jednou z nejdůležitějších součástí, která přímo ovlivňuje pohodlí používání zařízení. Časem lithium-iontové baterie ztrácejí svou kapacitu, což je zcela normální proces. Ale jak poznáte, že je čas vyměnit baterii?</p>

      <h3>1. Rychlé vybíjení</h3>
      <p>Nejzřetelnější příznak — váš iPhone se vybíjí mnohem rychleji než dříve. Pokud dříve nabití vydrželo celý den aktivního používání, ale nyní musíte telefon nabíjet dvakrát denně, je to jasný signál.</p>

      <h3>2. Nečekané vypínání</h3>
      <p>Vypíná se telefon při 20-30% nabití? To je jeden z nejčastějších příznaků opotřebení baterie. Regulátor napájení nemůže správně určit skutečnou úroveň nabití.</p>

      <h3>3. Nízká maximální kapacita</h3>
      <p>Přejděte do Nastavení → Baterie → Stav baterie. Pokud je maximální kapacita pod 80%, Apple doporučuje výměnu baterie. Při kapacitě nižší než 85% je již znatelné snížení výkonu.</p>

      <h3>4. Telefon se zahřívá během nabíjení</h3>
      <p>Mírné zahřívání je normální, ale pokud se iPhone stává horkým i při jednoduchém nabíjení nebo používání lehkých aplikací, baterie může být poškozená.</p>

      <h3>5. Nafouklá baterie</h3>
      <p>To je nejnebezpečnější příznak! Pokud jste si všimli, že displej začal odcházet od pouzdra, nebo se pouzdro deformovalo — okamžitě přestaňte telefon používat a obraťte se na servis. Nafouklá baterie může explodovat.</p>

      <h3>Jak prodloužit životnost baterie?</h3>
      <ul>
        <li>Vyhýbejte se úplnému vybití — optimálně udržujte nabití v rozmezí 20-80%</li>
        <li>Nenechávejte telefon nabíjet přes noc</li>
        <li>Vyhýbejte se přehřátí — nenechávejte iPhone na slunci</li>
        <li>Používejte originální nabíječky</li>
        <li>Aktualizujte iOS — nové verze často zahrnují optimalizaci spotřeby energie</li>
      </ul>

      <p><strong>Závěr:</strong> Včasná výměna baterie nejen obnoví pohodlnou dobu provozu, ale také ochrání před potenciálními bezpečnostními problémy. V našem servisu zabere výměna baterie iPhone pouze 20-30 minut, používáme kvalitní baterie se zárukou 2 roky.</p>
    `
    },
    image: "/images/articles/iphone-battery.jpg",
    publishedAt: "2025-10-15",
  },
  {
    id: "2",
    slug: "zashchita-ekrana-smartfona",
    title: {
      ru: "Как защитить экран смартфона от повреждений",
      en: "How to Protect Your Smartphone Screen from Damage",
      cz: "Jak chránit displej smartphonu před poškozením"
    },
    excerpt: {
      ru: "Разбитый экран — одна из самых распространенных проблем смартфонов. В этой статье мы расскажем о лучших способах защиты дисплея и что делать, если экран все-таки треснул.",
      en: "A broken screen is one of the most common smartphone problems. In this article, we'll tell you about the best ways to protect your display and what to do if the screen does crack.",
      cz: "Rozbité sklo je jedním z nejčastějších problémů smartphonů. V tomto článku vám řekneme o nejlepších způsobech ochrany displeje a co dělat, pokud se displej přesto rozbije."
    },
    content: {
      ru: `
      <p>Замена экрана смартфона — одна из самых дорогих ремонтных процедур. Гораздо проще и дешевле предотвратить повреждения, чем потом тратиться на ремонт. Давайте разберем эффективные способы защиты экрана.</p>

      <h3>1. Защитное стекло — must have</h3>
      <p>Это первая линия защиты вашего экрана. Качественное защитное стекло принимает удар на себя и трескается вместо оригинального дисплея. Существует несколько типов:</p>
      <ul>
        <li><strong>2D стекло</strong> — базовая защита, не закрывает края экрана</li>
        <li><strong>2.5D стекло</strong> — со скругленными краями, приятнее на ощупь</li>
        <li><strong>3D/5D стекло</strong> — полное покрытие экрана включая изгибы, максимальная защита</li>
      </ul>

      <h3>2. Чехол с приподнятыми краями</h3>
      <p>Выбирайте чехлы, у которых бортики выступают над экраном на 1-2 мм. Это защищает дисплей при падении экраном вниз — телефон падает на края чехла, а не на стекло.</p>

      <h3>3. Избегайте опасных ситуаций</h3>
      <p>Основные причины повреждений:</p>
      <ul>
        <li>Телефон в заднем кармане джинсов (давление при сидении)</li>
        <li>Совместное хранение с ключами и монетами</li>
        <li>Использование на улице в мороз (перепад температур)</li>
        <li>Попытка использовать телефон одной рукой при ходьбе</li>
      </ul>

      <h3>4. Гидрогелевая пленка как альтернатива</h3>
      <p>Если не нравятся стекла, рассмотрите гидрогелевую пленку. Она не защитит от сильных ударов, но отлично справляется с царапинами и мелкими повреждениями. Плюсы:</p>
      <ul>
        <li>Самовосстанавливается от мелких царапин</li>
        <li>Идеально повторяет форму экрана</li>
        <li>Не влияет на сенсорные характеристики</li>
      </ul>

      <h3>5. Страхование от повреждений</h3>
      <p>Если вы часто роняете телефон, рассмотрите программы страхования от производителя или оператора связи. Apple Care+, Samsung Care+ покрывают случайные повреждения за небольшую доплату.</p>

      <h3>Что делать, если экран уже треснул?</h3>
      <p>Если трещина небольшая:</p>
      <ul>
        <li>Наклейте защитное стекло — оно предотвратит расползание трещины</li>
        <li>Не давите на область трещины</li>
        <li>Запланируйте ремонт, пока повреждение не увеличилось</li>
      </ul>

      <p>Если экран серьезно поврежден — обращайтесь в сервис сразу. Осколки могут поранить палец, а влага через трещины может попасть внутрь корпуса.</p>

      <p><strong>Совет профессионала:</strong> Меняйте защитное стекло каждые 6-8 месяцев, даже если на нем нет видимых повреждений. Микротрещины снижают защитные свойства.</p>
    `,
      en: `
      <p>Smartphone screen replacement is one of the most expensive repair procedures. It's much easier and cheaper to prevent damage than to spend on repairs later. Let's look at effective ways to protect your screen.</p>

      <h3>1. Screen Protector — Must Have</h3>
      <p>This is the first line of defense for your screen. A quality screen protector takes the impact and cracks instead of the original display. There are several types:</p>
      <ul>
        <li><strong>2D glass</strong> — basic protection, doesn't cover screen edges</li>
        <li><strong>2.5D glass</strong> — with rounded edges, nicer to touch</li>
        <li><strong>3D/5D glass</strong> — full screen coverage including curves, maximum protection</li>
      </ul>

      <h3>2. Case with Raised Edges</h3>
      <p>Choose cases where the edges protrude above the screen by 1-2 mm. This protects the display when falling face down — the phone lands on the case edges, not the glass.</p>

      <h3>3. Avoid Dangerous Situations</h3>
      <p>Main causes of damage:</p>
      <ul>
        <li>Phone in back pocket of jeans (pressure when sitting)</li>
        <li>Storing together with keys and coins</li>
        <li>Using outdoors in freezing weather (temperature changes)</li>
        <li>Trying to use phone one-handed while walking</li>
      </ul>

      <h3>4. Hydrogel Film as Alternative</h3>
      <p>If you don't like glass protectors, consider hydrogel film. It won't protect from strong impacts, but handles scratches and minor damage excellently. Benefits:</p>
      <ul>
        <li>Self-heals from minor scratches</li>
        <li>Perfectly follows screen shape</li>
        <li>Doesn't affect touch sensitivity</li>
      </ul>

      <h3>5. Damage Insurance</h3>
      <p>If you frequently drop your phone, consider insurance programs from the manufacturer or carrier. Apple Care+, Samsung Care+ cover accidental damage for a small fee.</p>

      <h3>What to Do If Screen Already Cracked?</h3>
      <p>If the crack is small:</p>
      <ul>
        <li>Apply a screen protector — it will prevent crack spreading</li>
        <li>Don't press on the cracked area</li>
        <li>Schedule repair before damage increases</li>
      </ul>

      <p>If the screen is seriously damaged — contact service immediately. Shards can cut your finger, and moisture can get inside through cracks.</p>

      <p><strong>Professional Tip:</strong> Replace the screen protector every 6-8 months, even if there's no visible damage. Micro-cracks reduce protective properties.</p>
    `,
      cz: `
      <p>Výměna displeje smartphonu je jednou z nejdražších opravárenských procedur. Je mnohem snazší a levnější předcházet poškození, než pak utrácet za opravu. Podívejme se na efektivní způsoby ochrany displeje.</p>

      <h3>1. Ochranné sklo — nutnost</h3>
      <p>To je první linie obrany vašeho displeje. Kvalitní ochranné sklo přijme náraz na sebe a praskne místo původního displeje. Existuje několik typů:</p>
      <ul>
        <li><strong>2D sklo</strong> — základní ochrana, nezakrývá okraje displeje</li>
        <li><strong>2.5D sklo</strong> — se zaoblenými okraji, příjemnější na dotek</li>
        <li><strong>3D/5D sklo</strong> — plné pokrytí displeje včetně ohybů, maximální ochrana</li>
      </ul>

      <h3>2. Pouzdro se zvýšenými okraji</h3>
      <p>Vybírejte pouzdra, u kterých okraje vyčnívají nad displej o 1-2 mm. To chrání displej při pádu displejem dolů — telefon dopadne na okraje pouzdra, ne na sklo.</p>

      <h3>3. Vyhýbejte se nebezpečným situacím</h3>
      <p>Hlavní příčiny poškození:</p>
      <ul>
        <li>Telefon v zadní kapse džínů (tlak při sezení)</li>
        <li>Společné uložení s klíči a mincemi</li>
        <li>Používání venku v mrazu (teplotní změny)</li>
        <li>Pokus používat telefon jednou rukou při chůzi</li>
      </ul>

      <h3>4. Hydrogelová fólie jako alternativa</h3>
      <p>Pokud se vám nelíbí skla, zvažte hydrogelovou fólii. Neochrání před silnými nárazy, ale skvěle zvládá škrábance a drobná poškození. Výhody:</p>
      <ul>
        <li>Samočinně se opravuje od drobných škrábanců</li>
        <li>Dokonale kopíruje tvar displeje</li>
        <li>Neovlivňuje dotykové vlastnosti</li>
      </ul>

      <h3>5. Pojištění proti poškození</h3>
      <p>Pokud často pouštíte telefon, zvažte pojišťovací programy od výrobce nebo operátora. Apple Care+, Samsung Care+ pokrývají náhodná poškození za malý poplatek.</p>

      <h3>Co dělat, pokud displej již prasknul?</h3>
      <p>Pokud je trhlina malá:</p>
      <ul>
        <li>Nalepte ochranné sklo — zabrání šíření trhliny</li>
        <li>Netlačte na oblast trhliny</li>
        <li>Naplánujte opravu, než se poškození zvětší</li>
      </ul>

      <p>Pokud je displej vážně poškozen — obraťte se na servis okamžitě. Střepy mohou poranit prst a vlhkost může vniknout dovnitř skrz trhliny.</p>

      <p><strong>Profesionální tip:</strong> Vyměňujte ochranné sklo každých 6-8 měsíců, i když na něm nejsou viditelná poškození. Mikrotrhliny snižují ochranné vlastnosti.</p>
    `
    },
    image: "/images/articles/screen-protection.jpg",
    publishedAt: "2025-10-22",
  },
  {
    id: "3",
    slug: "telefon-upal-v-vodu-chto-delat",
    title: {
      ru: "Что делать, если телефон упал в воду",
      en: "What to Do If Your Phone Falls in Water",
      cz: "Co dělat, když telefon spadnul do vody"
    },
    excerpt: {
      ru: "Попадание влаги — критическая ситуация для любого смартфона. Правильные действия в первые минуты могут спасти устройство. Узнайте пошаговую инструкцию, что делать и чего избегать.",
      en: "Water damage is a critical situation for any smartphone. The right actions in the first minutes can save the device. Learn step-by-step instructions on what to do and what to avoid.",
      cz: "Poškození vodou je kritická situace pro jakýkoliv smartphone. Správné kroky v prvních minutách mohou zařízení zachránit. Zjistěte postupný návod, co dělat a čemu se vyhnout."
    },
    content: {
      ru: `
      <p>Телефон упал в воду? Не паникуйте! У вас есть шанс спасти устройство, если действовать быстро и правильно. Даже телефоны с защитой IP68 могут пострадать от воды, особенно если защита нарушена после ремонта.</p>

      <h3>Первые действия (критически важно!)</h3>
      <p><strong>Немедленно выключите телефон!</strong> Не пытайтесь проверить, работает ли он. Если телефон включен, вода может замкнуть контакты на плате. Зажмите кнопку питания и выключите устройство.</p>

      <h3>Что делать дальше — пошаговая инструкция</h3>

      <h4>Шаг 1: Извлеките все</h4>
      <ul>
        <li>Выньте SIM-карту и карту памяти</li>
        <li>Снимите чехол и защитное стекло</li>
        <li>Если есть съемная батарея (редко в современных моделях) — извлеките ее</li>
      </ul>

      <h4>Шаг 2: Удалите видимую воду</h4>
      <ul>
        <li>Аккуратно протрите телефон сухой мягкой тканью</li>
        <li>Слегка встряхните, держа разъемами вниз (не трясите сильно!)</li>
        <li>Промокните все отверстия: разъем зарядки, аудиоджек, динамики</li>
      </ul>

      <h4>Шаг 3: Используйте силикагель</h4>
      <p>Поместите телефон в емкость с силикагелем (те самые пакетики "не есть"). Силикагель эффективнее риса впитывает влагу. Оставьте минимум на 24-48 часов.</p>

      <h3>Чего НЕ делать (частые ошибки!)</h3>
      <ul>
        <li><strong>Не включайте телефон</strong> минимум 48 часов</li>
        <li><strong>Не используйте фен</strong> — горячий воздух может повредить компоненты</li>
        <li><strong>Не кладите в микроволновку/духовку</strong> (да, некоторые пробуют...)</li>
        <li><strong>Не трясите слишком сильно</strong> — вода может проникнуть глубже</li>
        <li><strong>Не заряжайте</strong> до полного высыхания</li>
      </ul>

      <h3>Когда нужно в сервис?</h3>
      <p>Обращайтесь к специалистам если:</p>
      <ul>
        <li>Телефон был в воде более 10 секунд</li>
        <li>Это была соленая вода (море, соленые озера)</li>
        <li>Телефон упал в грязную воду</li>
        <li>После высыхания телефон не включается</li>
        <li>Телефон включается, но работает с ошибками</li>
      </ul>

      <h3>Что происходит в сервисе?</h3>
      <p>Профессиональная обработка включает:</p>
      <ol>
        <li><strong>Разборка устройства</strong> — полный доступ к компонентам</li>
        <li><strong>Ультразвуковая ванна</strong> — удаляет влагу и загрязнения</li>
        <li><strong>Обработка изопропиловым спиртом</strong> — вытесняет воду, быстро испаряется</li>
        <li><strong>Очистка контактов</strong> — удаление следов коррозии</li>
        <li><strong>Замена поврежденных компонентов</strong> (если требуется)</li>
        <li><strong>Тестирование всех функций</strong></li>
      </ol>

      <h3>Профилактика</h3>
      <p>Чтобы избежать проблем в будущем:</p>
      <ul>
        <li>Используйте водонепроницаемый чехол на пляже/у бассейна</li>
        <li>Проверяйте целостность резиновых прокладок после ремонта</li>
        <li>Не используйте телефон в ванной</li>
        <li>Будьте осторожны возле раковин и унитазов</li>
      </ul>

      <p><strong>Важно:</strong> Чем быстрее вы обратитесь в сервис после попадания влаги, тем выше шансы на полное восстановление. Коррозия начинается уже через несколько часов! Наш сервисный центр предлагает экспресс-диагностику в течение 30 минут.</p>
    `,
      en: `
      <p>Phone fell in water? Don't panic! You have a chance to save the device if you act quickly and correctly. Even phones with IP68 protection can suffer from water, especially if protection is compromised after repair.</p>

      <h3>First Actions (Critically Important!)</h3>
      <p><strong>Turn off the phone immediately!</strong> Don't try to check if it works. If the phone is on, water can short circuit the board contacts. Press and hold the power button and turn off the device.</p>

      <h3>What to Do Next — Step-by-Step Instructions</h3>

      <h4>Step 1: Remove Everything</h4>
      <ul>
        <li>Remove SIM card and memory card</li>
        <li>Remove case and screen protector</li>
        <li>If there's a removable battery (rare in modern models) — remove it</li>
      </ul>

      <h4>Step 2: Remove Visible Water</h4>
      <ul>
        <li>Carefully wipe the phone with a dry soft cloth</li>
        <li>Gently shake it, holding ports downward (don't shake too hard!)</li>
        <li>Blot all openings: charging port, audio jack, speakers</li>
      </ul>

      <h4>Step 3: Use Silica Gel</h4>
      <p>Place the phone in a container with silica gel (those "do not eat" packets). Silica gel absorbs moisture more effectively than rice. Leave for at least 24-48 hours.</p>

      <h3>What NOT to Do (Common Mistakes!)</h3>
      <ul>
        <li><strong>Don't turn on the phone</strong> for at least 48 hours</li>
        <li><strong>Don't use a hair dryer</strong> — hot air can damage components</li>
        <li><strong>Don't put in microwave/oven</strong> (yes, some try...)</li>
        <li><strong>Don't shake too hard</strong> — water can penetrate deeper</li>
        <li><strong>Don't charge</strong> until completely dry</li>
      </ul>

      <h3>When to Visit Service Center?</h3>
      <p>Contact specialists if:</p>
      <ul>
        <li>Phone was in water for more than 10 seconds</li>
        <li>It was salt water (sea, salt lakes)</li>
        <li>Phone fell in dirty water</li>
        <li>After drying, phone won't turn on</li>
        <li>Phone turns on but works with errors</li>
      </ul>

      <h3>What Happens at Service Center?</h3>
      <p>Professional treatment includes:</p>
      <ol>
        <li><strong>Device disassembly</strong> — full access to components</li>
        <li><strong>Ultrasonic bath</strong> — removes moisture and contaminants</li>
        <li><strong>Isopropyl alcohol treatment</strong> — displaces water, evaporates quickly</li>
        <li><strong>Contact cleaning</strong> — removing corrosion traces</li>
        <li><strong>Damaged component replacement</strong> (if needed)</li>
        <li><strong>Testing all functions</strong></li>
      </ol>

      <h3>Prevention</h3>
      <p>To avoid problems in the future:</p>
      <ul>
        <li>Use waterproof case at beach/pool</li>
        <li>Check integrity of rubber seals after repair</li>
        <li>Don't use phone in bathroom</li>
        <li>Be careful near sinks and toilets</li>
      </ul>

      <p><strong>Important:</strong> The faster you contact service after water damage, the higher chances of full recovery. Corrosion starts within hours! Our service center offers express diagnostics within 30 minutes.</p>
    `,
      cz: `
      <p>Telefon spadnul do vody? Nepanikařte! Máte šanci zařízení zachránit, pokud budete jednat rychle a správně. I telefony s ochranou IP68 mohou trpět vodou, zejména pokud je ochrana narušena po opravě.</p>

      <h3>První kroky (kriticky důležité!)</h3>
      <p><strong>Okamžitě vypněte telefon!</strong> Nepokoušejte se zkontrolovat, zda funguje. Pokud je telefon zapnutý, voda může zkratovat kontakty na desce. Stiskněte a podržte tlačítko napájení a zařízení vypněte.</p>

      <h3>Co dělat dále — krok za krokem</h3>

      <h4>Krok 1: Vyjměte vše</h4>
      <ul>
        <li>Vyjměte SIM kartu a paměťovou kartu</li>
        <li>Sundejte pouzdro a ochranné sklo</li>
        <li>Pokud je baterie vyjímatelná (vzácné u moderních modelů) — vyjměte ji</li>
      </ul>

      <h4>Krok 2: Odstraňte viditelnou vodu</h4>
      <ul>
        <li>Opatrně otřete telefon suchou měkkou látkou</li>
        <li>Jemně zatřeste, držte konektory dolů (netřeste příliš!</li>
        <li>Osušte všechny otvory: nabíjecí port, audio jack, reproduktory</li>
      </ul>

      <h4>Krok 3: Použijte silikagel</h4>
      <p>Umístěte telefon do nádoby se silikagelem (ty sáčky "nejíst"). Silikagel absorbuje vlhkost efektivněji než rýže. Nechte minimálně 24-48 hodin.</p>

      <h3>Co NEDĚLAT (časté chyby!)</h3>
      <ul>
        <li><strong>Nezapínejte telefon</strong> minimálně 48 hodin</li>
        <li><strong>Nepoužívejte fén</strong> — horký vzduch může poškodit součásti</li>
        <li><strong>Nedávejte do mikrovlnky/trouby</strong> (ano, někteří zkouší...)</li>
        <li><strong>Netřeste příliš</strong> — voda může proniknout hlouběji</li>
        <li><strong>Nenabíjejte</strong> do úplného vyschnutí</li>
      </ul>

      <h3>Kdy navštívit servis?</h3>
      <p>Obraťte se na specialisty, pokud:</p>
      <ul>
        <li>Telefon byl ve vodě více než 10 sekund</li>
        <li>Byla to slaná voda (moře, solná jezera)</li>
        <li>Telefon spadnul do špinavé vody</li>
        <li>Po vyschnutí se telefon nezapne</li>
        <li>Telefon se zapne, ale funguje s chybami</li>
      </ul>

      <h3>Co se děje v servisu?</h3>
      <p>Profesionální ošetření zahrnuje:</p>
      <ol>
        <li><strong>Demontáž zařízení</strong> — plný přístup k součástem</li>
        <li><strong>Ultrazvuková lázeň</strong> — odstraní vlhkost a nečistoty</li>
        <li><strong>Ošetření isopropylalkoholem</strong> — vytlačí vodu, rychle se vypaří</li>
        <li><strong>Čištění kontaktů</strong> — odstranění stop koroze</li>
        <li><strong>Výměna poškozených součástí</strong> (pokud je potřeba)</li>
        <li><strong>Testování všech funkcí</strong></li>
      </ol>

      <h3>Prevence</h3>
      <p>Abyste předešli problémům v budoucnu:</p>
      <ul>
        <li>Používejte vodotěsné pouzdro na pláži/u bazénu</li>
        <li>Kontrolujte neporušenost gumových těsnění po opravě</li>
        <li>Nepoužívejte telefon v koupelně</li>
        <li>Buďte opatrní poblíž umyvadel a záchodů</li>
      </ul>

      <p><strong>Důležité:</strong> Čím rychleji se obrátíte na servis po poškození vodou, tím vyšší jsou šance na úplnou obnovu. Koroze začíná již za několik hodin! Naše servisní centrum nabízí expresní diagnostiku do 30 minut.</p>
    `
    },
    image: "/images/articles/water-damage.jpg",
    publishedAt: "2025-10-28",
  },
]
