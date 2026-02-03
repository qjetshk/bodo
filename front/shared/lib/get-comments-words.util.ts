/**
 * Universal pluralization function for English nouns.
 * forms — массив из двух форм: [singular, plural]
 * Например: ["comment", "comments"]
 */
export function pluralizeEn(count: number, forms: [string, string]): string {
  const n = Math.abs(Math.floor(count)); // используем целую часть и абсолютное значение
  return n === 1 ? forms[0] : forms[1];
}

/**
 * Returns the word "comment" properly pluralized for a given count.
 * If showCount = true, it returns the full phrase ("5 comments").
 */
export function commentsWordEn(count: number, showCount = false): string {
  const word = pluralizeEn(count, ["comment", "comments"]);
  return showCount ? `${count} ${word}` : word;
}

/* Примеры использования:
commentsWordEn(0)          -> "comments"
commentsWordEn(1)          -> "comment"
commentsWordEn(2)          -> "comments"
commentsWordEn(5, true)    -> "5 comments"
commentsWordEn(1, true)    -> "1 comment"
commentsWordEn(-3, true)   -> "-3 comments"
*/
