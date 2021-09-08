import { WeekDay } from "@angular/common";

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

export const WEEKDAYS = [
  { codigo: 0, valor: "DOMINGO" },
  { codigo: 1, valor: "LUNES" },
  { codigo: 2, valor: "MARTES" },
  { codigo: 3, valor: "MIERCOLES" },
  { codigo: 4, valor: "JUEVES" },
  { codigo: 5, valor: "VIERNES" },
  { codigo: 6, valor: "SABADO" },
];
export const obtenerDia = (id) => {
  return WEEKDAYS.find((item) => (item.codigo = id)).valor;
};
