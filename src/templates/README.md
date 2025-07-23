# RPLC Configuration Templates

Этот каталог содержит JSON шаблоны для различных конфигураций RPLC (Robotics PLC).

## Типы шаблонов

### 1. Готовые конфигурации (Compact Templates)
- **Принцип:** Содержат только включенные поля (`true`)
- **Назначение:** Готовые к использованию конфигурации
- **Файлы:** `rplc_xl.json`, `rplc_l.json`, `rplc_m.json`

### 2. Полный шаблон для настройки (Full Template)
- **Принцип:** Содержит все возможные поля с их значениями
- **Назначение:** База для создания пользовательских конфигураций
- **Файлы:** `rplc_template.json`

## Структура файлов

- `rplc_xl.json` - Готовая конфигурация RPLC XL (2048 КБ) - только активные компоненты
- `rplc_l.json` - Готовая конфигурация RPLC L (1024 КБ) - только активные компоненты  
- `rplc_m.json` - Готовая конфигурация RPLC M (512 КБ) - только активные компоненты
- `rplc_template.json` - **Полный шаблон** со всеми возможными полями для настройки
- `index.ts` - TypeScript модуль для работы с шаблонами
- `rplc-config.schema.json` - JSON Schema для валидации

## Использование

### Импорт в TypeScript

## API Usage Examples

```typescript
import { 
    templates, 
    getTemplate, 
    createConfigFromTemplate, 
    createFullConfig,
    mergeConfigWithTemplate 
} from './templates';

// 1. Получение готовой конфигурации (компактная)
const xlConfig = getTemplate('RPLC_XL'); 

// 2. Получение полного шаблона для настройки
const fullTemplate = getTemplate('TEMPLATE'); 

// 3. Создание копии готовой конфигурации с новым именем
const myXLConfig = createConfigFromTemplate('RPLC_XL', 'MY_CUSTOM_XL');

// 4. Создание нового конфига с полным набором функций для настройки
const customConfig = createFullConfig('MY_CUSTOM_RPLC', 1024);
// После этого пользователь редактирует JSON вручную

// 5. Модификация существующего шаблона
const modifiedConfig = mergeConfigWithTemplate('RPLC_L', {
    memory: 1536,
    hal: {
        network: true  // Добавляем network к базовой RPLC_L
    }
});
```

## Workflow создания новых конфигураций

### 1. Создание базы с полным набором функций
```typescript
// Создаем конфиг со всеми возможными функциями (все false)
const newConfig = createFullConfig('MY_CUSTOM_RPLC', 1024);
// Результат содержит ВСЕ поля для настройки
```

### 2. Ручная настройка JSON
```json
{
    "name": "MY_CUSTOM_RPLC",
    "memory": 1024,
    "hal": {
        "flash_ex": false,    // ← Оставить и изменить на true, если нужно
        "io": false,          // ← Оставить и изменить на true, если нужно  
        "rtc": true,          // ← Включили
        "serial": true,       // ← Включили
        "speaker": false,     // ← Удалить это поле, если не нужно
        "can": true,          // ← Включили
        "random": false,      // ← Удалить это поле, если не нужно
        "usb": false,         // ← Удалить это поле, если не нужно
        "network": false      // ← Удалить это поле, если не нужно
    }
    // ... аналогично для services и tests
}
```

### 3. Итоговый компактный результат
```json
{
    "name": "MY_CUSTOM_RPLC", 
    "memory": 1024,
    "hal": {
        "rtc": true,
        "serial": true,
        "can": true
    }
    // Только нужные поля!
}
```

### Прямое использование JSON

Файлы JSON можно использовать напрямую в любых системах сборки или приложениях.

## Структура конфигурации

Каждый шаблон содержит:

- `name` - Имя конфигурации
- `memory` - Объем памяти в КБ
- `hal` - Настройки HAL (Hardware Abstraction Layer) - **только включенные компоненты**
- `services` - Включенные сервисы - **только активные сервисы**
- `tests` - Настройки тестов - **только включенные тесты**
- `compileDefinition` - Определение для компиляции

### Особенности JSON шаблонов

- Поля в секциях `hal`, `services`, `tests` включаются только если они активны (`true`)
- Отсутствующие поля автоматически интерпретируются как отключенные (`false`)
- Это делает шаблоны компактными и читаемыми
- Соответствует принципу "Convention over Configuration"

### Примеры различий между конфигурациями

**RPLC_XL:** Полная конфигурация с lwIP, flash_ex, io, rtc
**RPLC_L:** Без lwIP, но с остальными компонентами  
**RPLC_M:** Минимальная конфигурация только с USB, serial, speaker, CAN

## Создание новых шаблонов

1. Скопируйте `rplc_template.json`
2. Измените значения согласно требованиям
3. Добавьте новый шаблон в `index.ts`
4. Обновите этот README
