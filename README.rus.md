<h1 align="center">
  <img src ="./assets/logos/marqueePromoTitle.png"/>
  Инструмент для анализа производительности React
  <br>
  <a href="https://osawards.com/react/">🏆 Номинант на React Open Source Awards 2020</a>
  <br>
</h1>

<h4 align="center">Мощное расширение Chrome, которое улучшает процесс разработки React за счёт отладки с путешествиями во времени и углублённого мониторинга производительности</h4>
<br>

<p align="center">
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/v/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/users/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store Users" />
  </a>
  <a href="https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga">
    <img src="https://img.shields.io/chrome-web-store/rating/cgibknllccemdnfhfpmjhffpjfeidjga" alt="Chrome Web Store Rating" />
  </a>
</p>

<h5 align="center">
<br>
  <a href="./README.md">🇺🇸 &nbsp; ENGLISH VERSION </a> &nbsp; • &nbsp;  <a href="./README.fr.md">🇫🇷  &nbsp; VERSION FRANÇAISE</a> &nbsp; • &nbsp; <a href='./src/DEVELOPER_README.md'>👩‍💻 Руководство для разработчиков</a>
  <br>
</h5>
<br>

<p align="center">
<img src="./assets/gifs/GeneralDemoGif_V26.gif" />
</p>

## <h1>✨ Ключевые особенности</h1>

### 🔍 Визуализация состояния

- **Разнообразные представления**: Отображение состояния приложения в виде графов компонентов, JSON-деревьев, графиков производительности и деревьев доступности
- **История изменений**: Отслеживайте изменения состояния во времени с удобной визуализацией истории
- **Метрики веб-приложения**: Отслеживайте важные метрики производительности в реальном времени
- **Аналитика доступности**: Анализируйте дерево доступности вашего приложения на каждом этапе изменения состояния
  <br>

<p>На главном экране доступны два основных выбора из выпадающего списка:</p>

- **Timejump**: Просматривайте и перемещайтесь по истории снимков состояния (snapshot) вашего приложения. Можно переместиться в любую точку во времени, чтобы увидеть, как состояние эволюционировало при изменениях. Также доступна кнопка воспроизведения, чтобы автоматически проиграть каждое изменение состояния.
- **Providers / Consumers**: Глубже понимайте зависимости контекста приложения и его взаимодействия, визуализируя отношения провайдеров и потребителей.
  <br>

<p align="center">
<img src="./assets/gifs/ProviderConsumer_V26.gif" />
</p>
<br>

### ⏱️ Отладка с путешествиями во времени

- **Снимки состояния**: Фиксируйте и перемещайтесь по истории состояния приложения
- **Элементы управления воспроизведением**: Автоматически воспроизводите изменения состояния с регулировкой скорости
- **Точки мгновенного перехода**: Мгновенно возвращайтесь к любому предыдущему состоянию
- **Сравнение состояний**: Сравнивайте разницу между снимками состояния
  <br>

<p align="center">
<img src="./assets/gifs/TimeTravelGif_V26.gif" />
</p>
<br>

### 📊 Анализ производительности

- **Метрики компонентов**: Отслеживайте время рендера и узкие места в производительности
- **Сравнение серий**: Сопоставляйте производительность при разных наборах изменений состояния
- **Определение перерисовок**: Находите и исправляйте избыточные циклы рендера
- **Web Vitals**: Следите за Core Web Vitals и другими метриками
  <br>
  <br>

### 🔄 Поддержка современных фреймворков

<ul>
  <li>
    Полная совместимость с <strong>Gatsby, Next.js и Remix</strong>
  </li>
  <li>
Поддержка TypeScript для классовых и функциональных компонентов
  </li>
  <li>
Поддержка React Hooks и Context API
  </li>
</ul>
<br>

### 💾 Сохранение и обмен состоянием

Reactime упрощает сохранение и обмен историей состояния вашего приложения:

- **Экспорт истории**: Сохраняйте записанные снимки в JSON-файл для дальнейшего анализа или передачи
- **Импорт предыдущих сессий**: Загружайте ранее сохранённые снимки, чтобы сравнивать изменения состояния между разными сессиями
- **Межсессионный анализ**: Сопоставляйте производительность и изменения состояния между разными этапами разработки
  <br>

<p align="center">
<img src="./assets/gifs/ImportExportGif_V26.gif" />
</p>
<br>

### 📚 Интерактивная документация

Reactime предлагает обширную документацию, помогающую разработчикам разобраться в архитектуре и API инструмента. После клонирования репозитория достаточно запустить `npm run docs` в корневой директории, а затем открыть сгенерированный файл `/docs/index.html`, в котором представлены:

<ul>
  <li>
  Интерактивные диаграммы компонентов
  </li>
  <li>
Типы и интерфейсы
  </li>
  <li>
Обзор архитектуры кодовой базы
  </li>
  <li>
API-справочник и примеры
  </li>
</ul>
<br>

<h1>🎉 Что нового!</h1>

Версия Reactime 26.0 предлагает полное обновление инструмента отладки React, включая:

- **Новый показ данных контекста**

  - Первая в своём роде визуализация состояния, основанного на хуке useContext
  - Чёткое отображение отношений «провайдер – потребитель»
  - Мониторинг значений контекста в реальном времени
  - Подробная визуализация данных провайдеров

- **Улучшенная отладка с путешествиями во времени**

  - Переработанный интерфейс слайдера, размещённого вместе со снимками
  - Элементы управления скоростью воспроизведения
  - Более интуитивная навигация по состояниям
  - Улучшенная визуализация снимков

- **Современный переработанный интерфейс**

  - Стильный, современный дизайн со скруглёнными элементами
  - Интуитивная структура расположения элементов
  - Новый тёмный режим
  - Улучшенная визуальная иерархия

- **Крупные технические улучшения**
  - Исправлена проблема с сохранением соединения при бездействии или переключении вкладок
  - Восстановлена визуализация дерева доступности (Accessibility Tree)
  - Исправлены проблемы с захватом состояния для хуков useState в функциональных компонентах
  - Общий рост стабильности и производительности расширения

Благодаря этим обновлениям Reactime стал ещё более мощным, надёжным и удобным в использовании, устанавливая новый стандарт среди инструментов отладки React.

Чтобы узнать больше о предыдущих релизах, перейдите по <a href="https://github.com/open-source-labs/reactime/releases">ссылке</a>.
<br>
<br>

<h1>🚀 Начало работы</h1>

### Установка

1. Установите [Reactime](https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga) из Интернет-магазина Chrome
2. Установите необходимое расширение [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), если у вас его ещё нет

### Предварительные требования

- Ваше React-приложение должно работать в **режиме разработки (development)**
- Расширение React Developer Tools должно быть установлено
- Браузер Chrome (рекомендуется версия 80 или выше)

### Запуск Reactime

Существует два способа открыть панель Reactime:

1. **Контекстное меню**

   - Кликните правой кнопкой мыши в любом месте вашего React-приложения
   - Выберите «Reactime» в контекстном меню

2. **Инструменты разработчика**
   - Откройте Chrome DevTools (F12 или ⌘+⌥+I)
   - Перейдите на вкладку «Reactime»

После запуска Reactime автоматически начнёт отслеживать изменения состояния и метрики производительности вашего приложения.
<br>
<br>

<h1>🤝 Участие в развитии Reactime</h1>

Мы приглашаем всех желающих внести свой вклад в улучшение Reactime! Вот как вы можете помочь: <a href='./CONTRIBUTING.md'>🙋 Contributing README</a>

1. **Начальный шаг**

   - Сделайте форк репозитория
   - Изучите наше подробное Руководство для разработчиков (Developer README)
   - Настройте локальную среду разработки

2. **Процесс сборки**
   - Следуйте инструкциям по сборке в Руководстве для разработчиков
   - Тщательно протестируйте свои изменения
   - Создайте пул-реквест

Присоединяйтесь к нашему растущему сообществу контрибьюторов и помогите формировать будущее инструментов отладки React! Подробные инструкции по участию и архитектуре проекта вы найдёте в <a href='./src/DEVELOPER_README.md'>👩‍💻 Руководстве для разработчиков</a>.
<br>
<br>

<h1>🛠️ Устранение неполадок</h1>

### ❓ <b>Почему Reactime не записывает новые изменения состояния?</b>

Reactime потерял соединение с вкладкой, за которой ведётся наблюдение. Просто нажмите кнопку «reconnect», чтобы возобновить работу.

### ❓ <b>Почему Reactime не может найти мои хуки?</b>

Reactime обнаруживает и отслеживает хуки, просматривая «неминифицированный» код React в режиме разработки. Если ваш процесс сборки минифицирует или «уродует» (uglify) код — даже в режиме разработки — Reactime может не найти и не отследить ваши хуки. Чтобы исправить это:

1. **Убедитесь, что сборка действительно предназначена для разработки**: Проверьте настройки вашего бандлера или инструмента сборки (например, Webpack, Babel, Vite и т. д.), чтобы приложение не было минимизировано и «уродовано» в режиме разработки.
   - Например, в Webpack установите `mode: 'development'`, чтобы по умолчанию отключить минификацию.
   - В Create React App, достаточно запустить `npm start` или `yarn start`, чтобы автоматически настроить неминифицированную сборку.
2. **Проверьте, нет ли переопределений**: Убедитесь, что нет дополнительных Babel- или Webpack-плагинов, которые минифицируют ваш код, особенно если вы используете фреймворки вроде Next.js или Gatsby. Иногда дополнительные плагины или скрипты могут незаметно запускать минификацию.
3. **Перезапустите и пересоберите**: После изменения настроек сборки перезапустите или пересоберите ваше приложение, чтобы новые настройки были применены. Затем обновите вкладку браузера, чтобы Reactime мог обнаружить ваши неминифицированные хуки.

### ❓ <b>Почему Reactime говорит, что React-приложение не найдено?</b>

Reactime изначально запускается, используя глобальный хук dev tools из API Chrome. Чтобы Chrome успел это загрузить, может потребоваться время. Попробуйте обновить (refresh) ваше приложение несколько раз, пока не увидите, что Reactime заработал.

### ❓ <b>Почему мне нужно включать React Dev Tools?</b>

Reactime работает в связке с React Developer Tools, чтобы получить доступ к дереву Fiber в React-приложении. Внутри Reactime просматривает дерево Fiber через глобальный хук из React Developer Tools, получая всю необходимую информацию для отображения разработчику.

### ❓ <b>Я нашёл(ла) баг в Reactime</b>

Reactime — это проект с открытым исходным кодом. Мы будем рады услышать ваши идеи по улучшению пользовательского опыта. Ознакомьтесь с <a href='./src/DEVELOPER_README.md'>👩‍💻 Руководством для разработчиков</a> и создайте пул-реквест (или Issue), чтобы предложить и совместно доработать изменения в Reactime.

### ❓ <b>Совместимость с версиями Node</b>

С выходом Node v18.12.1 (LTS) от 04.11.22 в скриптах появились команды  
`npm run dev` | `npm run build` для обратной совместимости.<br/> Для версии
Node v16.16.0 используйте скрипты `npm run devlegacy` | `npm run buildlegacy`
<br>
<br>

<h1>✍️ Авторы</h1>

- **Garrett Chow** - [@garrettlchow](https://github.com/garrettlchow)
- **Ellie Simens** - [@elliesimens](https://github.com/elliesimens)
- **Ragad Mohammed** - [@ragad-mohammed](https://github.com/ragad-mohammed)
- **Daniel Ryczek** - [@dryczek14](https://github.com/dryczek01)
- **Patrice Pinardo** - [@pinardo88](https://github.com/pinardo88)
- **Haider Ali** - [@hali03](https://github.com/hali03)
- **Jose Luis Sanchez** - [@JoseSanchez1996](https://github.com/JoseSanchez1996)
- **Logan Nelsen** - [@ljn16](https://github.com/ljn16)
- **Mel Koppens** - [@MelKoppens](https://github.com/MelKoppens)
- **Amy Yang** - [@ay7991](https://github.com/ay7991)
- **Eva Ury** - [@evaSUry](https://github.com/evaSUry)
- **Jesse Guerrero** - [@jguerrero35](https://github.com/jguerrero35)
- **Oliver Cho** - [@Oliver-Cho](https://github.com/Oliver-Cho)
- **Ben Margolius** - [@benmarg](https://github.com/benmarg)
- **Eric Yun** - [@ericsngyun](https://github.com/ericsngyun)
- **James Nghiem** - [@jemzir](https://github.com/jemzir)
- **Wilton Lee** - [@wiltonlee948](https://github.com/wiltonlee948)
- **Louis Lam** - [@llam722](https://github.com/llam722)
- **Samuel Tran** - [@leumastr](https://github.com/leumastr)
- **Brian Yang** - [@yangbrian310](https://github.com/yangbrian310)
- **Emin Tahirov** - [@eminthrv](https://github.com/eminthrv)
- **Peng Dong** - [@d28601581](https://github.com/d28601581)
- **Ozair Ghulam** - [@ozairgh](https://github.com/ozairgh)
- **Christina Or** - [@christinaor](https://github.com/christinaor)
- **Khanh Bui** - [@AndyB909](https://github.com/AndyB909)
- **David Kim** - [@codejunkie7](https://github.com/codejunkie7)
- **Robby Tipton** - [@RobbyTipton](https://github.com/RobbyTipton)
- **Kevin HoEun Lee** - [@khobread](https://github.com/khobread)
- **Christopher LeBrett** - [@fscgolden](https://github.com/fscgolden)
- **Joseph Park** - [@joeepark](https://github.com/joeepark)
- **Kris Sorensen** - [@kris-sorensen](https://github.com/kris-sorensen)
- **Daljit Gill** - [@dgill05](https://github.com/dgill05)
- **Ben Michareune** - [@bmichare](https://github.com/bmichare)
- **Dane Corpion** - [@danecorpion](https://github.com/danecorpion)
- **Harry Fox** - [@StackOverFlowWhereArtThou](https://github.com/StackOverFlowWhereArtThou)
- **Nathan Richardson** - [@BagelEnthusiast](https://github.com/BagelEnthusiast)
- **David Bernstein** - [@dangitbobbeh](https://github.com/dangitbobbeh)
- **Joseph Stern** - [@josephiswhere](https://github.com/josephiswhere)
- **Dennis Lopez** - [@DennisLpz](https://github.com/DennisLpz)
- **Cole Styron** - [@colestyron](https://github.com/C-STYR)
- **Ali Rahman** - [@CourageWolf](https://github.com/CourageWolf)
- **Caner Demir** - [@demircaner](https://github.com/demircaner)
- **Kevin Ngo** - [@kev-ngo](https://github.com/kev-ngo)
- **Becca Viner** - [@rtviner](https://github.com/rtviner)
- **Caitlin Chan** - [@caitlinchan23](https://github.com/caitlinchan23)
- **Kim Mai Nguyen** - [@Nkmai](https://github.com/Nkmai)
- **Tania Lind** - [@lind-tania](https://github.com/lind-tania)
- **Alex Landeros** - [@AlexanderLanderos](https://github.com/AlexanderLanderos)
- **Chris Guizzetti** - [@guizzettic](https://github.com/guizzettic)
- **Jason Victor** - [@theqwertypusher](https://github.com/Theqwertypusher)
- **Sanjay Lavingia** - [@sanjaylavingia](https://github.com/sanjaylavingia)
- **Vincent Nguyen** - [@VNguyenCode](https://github.com/VNguyenCode)
- **Haejin Jo** - [@haejinjo](https://github.com/haejinjo)
- **Hien Nguyen** - [@hienqn](https://github.com/hienqn)
- **Jack Crish** - [@JackC27](https://github.com/JackC27)
- **Kevin Fey** - [@kevinfey](https://github.com/kevinfey)
- **Carlos Perez** - [@crperezt](https://github.com/crperezt)
- **Edwin Menendez** - [@edwinjmenendez](https://github.com/edwinjmenendez)
- **Gabriela Jardim Aquino** - [@aquinojardim](https://github.com/aquinojardim)
- **Greg Panciera** - [@gpanciera](https://github.com/gpanciera)
- **Nathanael Wa Mwenze** - [@nmwenz90](https://github.com/nmwenz90)
- **Ryan Dang** - [@rydang](https://github.com/rydang)
- **Bryan Lee** - [@mylee1995](https://github.com/mylee1995)
- **Josh Kim** - [@joshua0308](https://github.com/joshua0308)
- **Sierra Swaby** - [@starkspark](https://github.com/starkspark)
- **Ruth Anam** - [@nusanam](https://github.com/nusanam)
- **David Chai** - [@davidchaidev](https://github.com/davidchai717)
- **Yujin Kang** - [@yujinkay](https://github.com/yujinkay)
- **Andy Wong** - [@andynullwong](https://github.com/andynullwong)
- **Chris Flannery** - [@chriswillsflannery](https://github.com/chriswillsflannery)
- **Rajeeb Banstola** - [@rajeebthegreat](https://github.com/rajeebthegreat)
- **Prasanna Malla** - [@prasmalla](https://github.com/prasmalla)
- **Rocky Lin** - [@rocky9413](https://github.com/rocky9413)
- **Abaas Khorrami** - [@dubalol](https://github.com/dubalol)
- **Ergi Shehu** - [@Ergi516](https://github.com/ergi516)
- **Raymond Kwan** - [@rkwn](https://github.com/rkwn)
- **Joshua Howard** - [@Joshua-Howard](https://github.com/joshua-howard)
- **Lina Shin** - [@rxlina](https://github.com/rxlina)
- **Andy Tsou** - [@andytsou19](https://github.com/andytsou19)
- **Feiyi Wu** - [@FreyaWu](https://github.com/FreyaWu)
- **Viet Nguyen** - [@vnguyen95](https://github.com/vnguyen95)
- **Alex Gomez** - [@alexgomez9](https://github.com/alexgomez9)
- **Edar Liu** - [@liuedar](https://github.com/liuedar)
- **Kristina Wallen** - [@kristinawallen](https://github.com/kristinawallen)
- **Quan Le** - [@Blachfog](https://github.com/Blachfog)
- **Robert Maeda** - [@robmaeda](https://github.com/robmaeda)
- **Lance Ziegler** - [@lanceziegler](https://github.com/lanceziegler)
- **Ngoc Zwolinski** - [@ngoczwolinski](https://github.com/ngoczwolinski)
- **Peter Lam** - [@dev-plam](https://github.com/dev-plam)
- **Zachary Freeman** - [@zacharydfreeman](https://github.com/zacharydfreeman/)
- **Jackie Yuan** - [@yuanjackie1](https://github.com/yuanjackie1)
- **Jasmine Noor** - [@jasnoo](https://github.com/jasnoo)
- **Minzo Kim** - [@minzo-kim](https://github.com/minzo-kim)
- **Mark Teets** - [@MarkTeets](https://github.com/MarkTeets)
- **Nick Huemmer** - [@NickHuemmer](https://github.com/ElDuke717)
- **James McCollough** - [@j-mccoll](https://github.com/j-mccoll)
- **Mike Bednarz** - [@mikebednarz](https://github.com/mikebednarz)
- **Sergei Liubchenko** - [@sergeylvq](https://github.com/sergeylvq)
- **Yididia Ketema** - [@yididiaketema](https://github.com/yididiaketema)
- **Morah Geist** - [@morahgeist](https://github.com/morahgeist)
- **Eivind Del Fierro** - [@EivindDelFierro](https://github.com/EivindDelFierro)
- **Kyle Bell** - [@KyEBell](https://github.com/KyEBell)
- **Sean Kelly** - [@brok3turtl3](https://github.com/brok3turtl3)
- **Christopher Stamper** - [@ctstamper](https://github.com/ctstamper)
- **Jimmy Phy** - [@jimmally](https://github.com/jimmally)
- **Andrew Byun** - [@AndrewByun](https://github.com/AndrewByun)
- **Kelvin Mirhan** - [@kelvinmirhan](https://github.com/kelvinmirhan)
- **Jesse Rosengrant** - [@jrosengrant](https://github.com/jrosengrant)
- **Liam Donaher** - [@leebology](https://github.com/leebology)
- **David Moore** - [@Solodt55](https://github.com/Solodt55)
- **John Banks** - [@Jbanks123](https://github.com/Jbanks123)
  <br>

<h1>⚖️ Лицензия</h1>

Этот проект распространяется по лицензии MIT — подробности см. в файле [LICENSE](LICENSE).
