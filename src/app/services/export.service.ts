import { Injectable } from "@angular/core";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
@Injectable({
  providedIn: "root",
})
export class ExportService {
  constructor() {}

  downloadPdf(dataParam: any[], listaColumnas: any[]) {
    let prepare = [];
    dataParam.forEach((e) => {
      var tempObj = [];
      listaColumnas.forEach((element) => {
        tempObj.push(this.mostrarCampo(e, element));
      });

      prepare.push(tempObj);
    });

    let columnas = [];
    listaColumnas.forEach((item) => {
      columnas.push(item.descripcion);
    });

    const doc = new jsPDF("l", "mm", "a4");
    console.table(columnas, prepare);

    const head = [columnas];
    const data = prepare;

    autoTable(doc, {
      head: head,
      body: data,
      didDrawCell: (data) => {},
    });
    const date = new Date();
    doc.save("reservas" + date.getMilliseconds() + ".pdf");
  }

  mostrarCampo(row, columna) {
    if (columna.relacion) {
      if (row[columna.label] == null) return "";
      if (Array.isArray(columna.columnaRelacion)) {
        return this.multipleColumnas(
          row[columna.label],
          columna.columnaRelacion
        );
      }
      return row[columna.label][columna.columnaRelacion];
    } else {
      if (typeof columna.estados != "undefined") {
        const label = row[columna.label]
          ? columna.estados[0]
          : columna.estados[1];
        return label;
      }
      return row[columna.label];
    }
  }
  multipleColumnas(valor: any, listaCol: any[]) {
    let valorRetorno = "";
    for (let index = 0; index < listaCol.length; index++) {
      const property = listaCol[index];
      valorRetorno += valor[property] + " ";
    }
    return valorRetorno;
  }
}
