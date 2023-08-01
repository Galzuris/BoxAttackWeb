# BOX ATTACK

## Об игре

Игра сделана по мотивам старой мобильной игры StackAttack.
Сдвигайте коробки чтобы составить полностью заполненную линию.
Удар коробки по голове или заполнение коробок по вертикали, 
до зоны кранов, будет засчитано как моментальный проигрыш.

Чтобы запустить игру, достаточно открыть index.html через браузер.

## Режимы игры

1p - один игрок

2p - два игрока

## Управление

W,A,S,D - Первый игрок

Arrows - Второй игрок

Esc - Пауза

Space/Enter - Выбор

## Исходники

Для сборки и минификации используется npm и webpack.

Все ресурсы кроме звуков сделаны с нуля. Звуки сгенерированы через https://sfxr.me
В игре сделано подобие секвенсора для треков "музыки", для экономии места. 
Сделан мини шрифт для текста и отдельный шрифт для цифр.

Билд
```bash
npm install
npm run build
```