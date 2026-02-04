export const translations = {
  en: {
    // Sidebar
    home: 'Home',
    instances: 'Instances',
    mods: 'Mods',
    settingsNav: 'Settings',
    news: 'News',

    // Home page
    playInstance: 'Play',
    lastPlayed: 'Last played',
    selectInstance: 'Select an instance to play',
    playNow: 'Play Now',
    instanceNotSelected: 'No instance selected',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    monthsAgo: 'months ago',

    // Instances page
    addInstance: 'Add Instance',
    noInstances: 'No instances found',
    selectVersion: 'Select Version',
    loaderType: 'Loader Type',
    allocatedMemory: 'Allocated Memory',

    // Mods page
    searchMods: 'Search mods...',
    noMods: 'No mods found',
    
    // Settings page
    settings: 'Settings',
    performance: 'Performance',
    ramAllocation: 'RAM Allocation',
    javaPath: 'Java Path',
    gameManagement: 'Game Management',
    openModsFolder: 'Open Mods Folder',
    optimizeMinecraft: 'Optimize',
    launcherOptions: 'Launcher Options',
    discordRPC: 'Discord RPC',
    versionFilters: 'Version Filters',
    showSnapshots: 'Show Snapshots',
    showOldVersions: 'Show Old Versions',
    darkMode: '🌙 Dark',
    lightMode: '☀️ Light',

    // Status messages
    browsingStatus: 'Browsing',
    playingStatus: 'Playing',
    theme: 'Theme',

    // Account Modal
    terminalAuth: 'Terminal Auth',
    amethystNetwork: 'Amethyst Network',
    amethystCloudSession: 'Amethyst Cloud Session',
    localOfflineSession: 'Local Offline Session',
    terminateSession: 'Terminate Session',
    changeUsername: 'Change Username',
    recentNicknames: 'Recent Nicknames',
    save: 'Save',
    cancel: 'Cancel',
    localHandle: 'Local Handle',
    enterNickname: 'Enter nickname...',
    quickStart: 'Quick Start',
    amethystId: 'Amethyst ID',
    connectLauncher: 'Connect your launcher to the Amethyst Cloud for synchronized instances and cosmetics.',
    syncViaBrowser: 'Sync via Browser',
    cloudSyncMessage: 'Cloud synchronization enabled. All instances will be mirrored.',

    // Home page
    loadedEngine: 'Loaded Engine',
    coreReleaseModule: 'Core Release Module',
    detachInstance: 'Detach Instance',
    syncingManifest: 'Syncing Manifest...',
    vanillaVersion: 'Vanilla',
    searchVersionDatabase: 'Search version database...',
    moduleType: 'module',
    engineTelemetry: 'Engine Telemetry',
    play: 'PLAY',
    running: 'RUNNING',
    standby: 'Standby',
    readyToLaunch: 'Ready to Launch',
    connectionError: 'Connection Error',
  },
  ru: {
    // Боковая панель
    home: 'Главная',
    instances: 'Экземпляры',
    mods: 'Моды',
    settingsNav: 'Настройки',
    news: 'Новости',

    // Главная страница
    playInstance: 'Играть',
    lastPlayed: 'Последний запуск',
    selectInstance: 'Выберите экземпляр для игры',
    playNow: 'Играть сейчас',
    instanceNotSelected: 'Экземпляр не выбран',
    hoursAgo: 'часов назад',
    daysAgo: 'дней назад',
    monthsAgo: 'месяцев назад',

    // Страница экземпляров
    addInstance: 'Добавить экземпляр',
    noInstances: 'Экземпляры не найдены',
    selectVersion: 'Выбрать версию',
    loaderType: 'Тип загрузчика',
    allocatedMemory: 'Выделено памяти',

    // Страница модов
    searchMods: 'Поиск модов...',
    noMods: 'Моды не найдены',
    
    // Страница настроек
    settings: 'Настройки',
    performance: 'Производительность',
    ramAllocation: 'Распределение оперативной памяти',
    javaPath: 'Путь к Java',
    gameManagement: 'Управление игрой',
    openModsFolder: 'Открыть папку модов',
    optimizeMinecraft: 'Оптимизировать',
    launcherOptions: 'Параметры лаунчера',
    discordRPC: 'Discord RPC',
    versionFilters: 'Фильтры версий',
    showSnapshots: 'Показывать снимки',
    showOldVersions: 'Показывать старые версии',
    darkMode: '🌙 Тёмная',
    lightMode: '☀️ Светлая',

    // Сообщения статуса
    browsingStatus: 'Просмотр',
    playingStatus: 'Игра',
    theme: 'Тема',

    // Модаль аккаунта
    terminalAuth: 'Терминал авторизации',
    amethystNetwork: 'Сеть Amethyst',
    amethystCloudSession: 'Облачная сессия Amethyst',
    localOfflineSession: 'Локальная оффлайн сессия',
    terminateSession: 'Завершить сессию',
    changeUsername: 'Изменить никнейм',
    recentNicknames: 'Недавние',
    save: 'Сохранить',
    cancel: 'Отмена',
    localHandle: 'Локальный никнейм',
    enterNickname: 'Введите никнейм...',
    quickStart: 'Быстрый старт',
    amethystId: 'Amethyst ID',
    connectLauncher: 'Подключите лаунчер к облаку Amethyst для синхронизации экземпляров и косметики.',
    syncViaBrowser: 'Синхронизировать через браузер',
    cloudSyncMessage: 'Облачная синхронизация включена. Все экземпляры будут зеркалированы.',

    // Главная страница
    loadedEngine: 'Загруженный модуль',
    coreReleaseModule: 'Базовый модуль',
    detachInstance: 'Отключить модуль',
    syncingManifest: 'Синхронизация манифеста...',
    vanillaVersion: 'Vanilla',
    searchVersionDatabase: 'Поиск версии...',
    moduleType: 'модуль',
    engineTelemetry: 'Телеметрия',
    play: 'ИГРАТЬ',
    running: 'ЗАПУСК',
    standby: 'Ожидание',
    readyToLaunch: 'Готово к запуску',
    connectionError: 'Ошибка подключения',
  }
};

export type Language = 'en' | 'ru';

export function t(key: string, language: Language): string {
  return (translations[language] as any)[key] || key;
}
