/**
 * Универсальная функция склонения для русских существительных.
 * forms — массив из трёх форм: [singular, paucal (2-4), plural (0,5-...)].
 * Например: ["комментарий", "комментария", "комментариев"]
 */
export function pluralizeRu(count: number, forms: [string, string, string]): string {
  const n = Math.abs(Math.floor(count)); // работаем с целой частью и абсолютным значением
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
  const last = n % 10;
  if (last === 1) return forms[0];
  if (last >= 2 && last <= 4) return forms[1];
  return forms[2];
}

/**
 * Возвращает склонённое слово "комментарий" для заданного количества.
 * Если нужно получить полную фразу ("5 комментариев"), используйте showCount = true.
 */
export function commentsWord(count: number, showCount = false): string {
  const word = pluralizeRu(count, ["комментарий", "комментария", "комментариев"]);
  return showCount ? `${count} ${word}` : word;
}

/* Примеры использования:
commentsWord(0)          -> "комментариев"
commentsWord(1)          -> "комментарий"
commentsWord(2)          -> "комментария"
commentsWord(5)          -> "комментариев"
commentsWord(21)         -> "комментарий"
commentsWord(12)         -> "комментариев"
commentsWord(2.9, true)  -> "2.9 комментария"  (если хочешь целые — передай Math.floor(count))
commentsWord(-3, true)   -> "-3 комментария"
*/
