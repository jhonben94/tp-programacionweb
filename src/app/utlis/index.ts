export function deleteEmptyData(data) {
  for (const key in data) {
    if (data[key] === "" || data[key] === null) {
      delete data[key];
    }
  }
  return data;
}

export function formatearFecha(date) {
  var day = date.getDate() + "";
  var month = date.getMonth() + 1 + "";
  var year = date.getFullYear() + "";
  var hour = date.getHours() + "";
  var minutes = date.getMinutes() + "";
  var seconds = date.getSeconds() + "";

  day = checkZero(day);
  month = checkZero(month);
  year = checkZero(year);
  hour = checkZero(hour);
  minutes = checkZero(minutes);
  seconds = checkZero(seconds);
  return (
    day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds
  );
}

function checkZero(data) {
  if (data.length == 1) {
    data = "0" + data;
  }
  return data;
}
export const CANTIDAD_PAG_LIST = [5, 10, 25, 100];
export const CANTIDAD_PAG_DEFAULT = 10;
export const CARACTER_MINIMO_AUTOCOMPLETE = 3;
export const RESULTADO_AUTOCOMPLETE = 50;
export const MIN_ROWS_TEXT_AREA = 10;
export const MAX_ROWS_TEXT_AREA = 15;

export const CANTIDAD_PAG_MODAL_DEFAULT = 5;
export const CANTIDAD_PAG_MODAL_LIST = [5];
export const formatearHora = (hora) => {
  const string_copy = (" " + hora).slice(1);
  const string_copy2 = (" " + hora).slice(1);
  let h = string_copy.substring(0, 2);
  let m = string_copy2.substring(2, 4);
  h = checkZero(h);
  m = checkZero(m);
  return h + ":" + m;
};
