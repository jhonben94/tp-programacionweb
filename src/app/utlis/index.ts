export function deleteEmptyData(data) {
  for (const key in data) {
    if (data[key] === "" || data[key] === null) {
      delete data[key];
    }
  }
  return data;
}
export const CANTIDAD_PAG_LIST = [5, 10, 25, 100];
export const CANTIDAD_PAG_DEFAULT = 10;
export const CARACTER_MINIMO_AUTOCOMPLETE = 3;
export const RESULTADO_AUTOCOMPLETE = 50;
export const MIN_ROWS_TEXT_AREA = 10;
export const MAX_ROWS_TEXT_AREA = 15;
