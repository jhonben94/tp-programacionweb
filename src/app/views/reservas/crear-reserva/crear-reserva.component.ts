import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import {
  CANTIDAD_PAG_LIST,
  deleteEmptyData,
  formatearFecha,
  formatearHora,
} from "src/app/utlis";
import { BuscadorClienteComponent } from "../../buscadores/buscador-cliente/buscador-cliente.component";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { merge, of } from "rxjs";
import { startWith, switchMap, catchError, map } from "rxjs/operators";
import { ReservasService } from "src/app/services/reservas.service";
declare const $: any;
@Component({
  selector: "app-crear-reserva",
  templateUrl: "./crear-reserva.component.html",
  styleUrls: ["./crear-reserva.component.css"],
})
export class CrearReservaComponent implements OnInit {
  selectedRow: any;
  filtrosForm: any;
  formCliente: any;

  /**
   * @type {number}
   * @description Cantidad total de registros obtenidos para la grilla.
   */
  resultsLength = 0;

  /**
   * @type {boolean}
   * @description Flag utilizado para confirmar verificar el estado de la peticion de la grilla
   */
  isLoadingResults = true;

  /**
   * @type {boolean}
   */
  isRateLimitReached = false;

  /**
   * @type {Array}
   * @description Definicion de las columnas a ser visualizadas
   */
  displayedColumns: string[] = [
    "horaInicioCadena",
    "horaFinCadena",
    "idCliente",
  ];

  opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "horaInicioCadena",
      label: "horaInicioCadena",
      descripcion: "HORA INI",
    },
    {
      matDef: "horaFinCadena",
      label: "horaFinCadena",
      descripcion: "HORA FIN",
    },

    {
      matDef: "idCliente",
      label: "idCliente",
      descripcion: "CLIENTE",
      relacion: true,
      columnaRelacion: ["nombre", "apellido"],
    },
  ];
  /**
   * @type {Array}
   * @description Lista que contiene los valores para la grilla
   */
  data: any[] = [];
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private reserva: ReservasService
  ) {
    this.filtrosForm = this.fb.group({
      fecha: ["", Validators.required],
      idEmpleado: [""],
      nombreEmpleado: ["", Validators.required],
      disponible: [""],
    });

    this.formCliente = this.fb.group({
      idCliente: [""],
      nombreCliente: ["", Validators.required],
      observacion: [""],
    });
  }

  ngOnInit(): void {
    var mainPanel = document.getElementsByClassName("main-panel")[0];
    $(".modal").on("shown.bs.modal", function () {
      mainPanel.classList.add("no-scroll");
    });
    $(".modal").on("hidden.bs.modal", function () {
      mainPanel.classList.remove("no-scroll");
    });
  }
  ngAfterViewInit(): void {}
  buscadores(buscador) {
    let dialogRef = null;
    switch (buscador) {
      case "empleado":
        dialogRef = this.dialog.open(BuscadorEmpleadoComponent, {
          data: {
            title: "Buscador de Empleados",
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if (result) {
            this.f.nombreEmpleado.setValue(
              result.nombre + " " + result.apellido
            );
            this.f.idEmpleado.setValue(result.idPersona);
          } else {
            this.f.nombreEmpleado.setValue(null);
          }
        });
        break;

      case "cliente":
        dialogRef = this.dialog.open(BuscadorClienteComponent, {
          data: {
            title: "Buscador de Clientes",
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if (result) {
            this.fc.nombreCliente.setValue(
              result.nombre + " " + result.apellido
            );
            this.fc.idCliente.setValue(result.idPersona);
          } else {
            this.fc.nombreEmpleado.setValue(null);
          }
        });
        break;

      default:
        break;
    }
  }
  get f() {
    return this.filtrosForm.controls;
  }

  get fc() {
    return this.formCliente.controls;
  }
  buscar() {
    let data = deleteEmptyData(this.filtrosForm.value);
    const id = data.idEmpleado;
    delete data.idEmpleado;
    delete data.nombreEmpleado;
    data.disponible = !data.disponible ? "S" : "N";
    this.selectedRow = null;
    this.reserva.listarReserva(id, data).subscribe((res: any) => {
      this.data = res;
    });
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
      if (columna.label.includes("hora")) {
        return formatearHora(row[columna.label]);
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

  onRowClicked(row) {
    this.selectedRow = row;
    if (row.idCliente != null) {
      this.showNotification("top", "center");
    }
  }
  validarForms() {
    console.log(this.formCliente.valid);
    console.log(this.filtrosForm.valid);
    console.log(this.selectedRow);

    return !(
      this.formCliente.valid &&
      this.filtrosForm.valid &&
      !this.selectedRow
    );
  }

  showNotification(from: any, align: any) {
    $.notify(
      {
        icon: "notifications",
        message:
          "El horario seleccionado, no puede ser seleccionado. Elija otro por favor",
      },
      {
        type: "danger",
        timer: 3000,
        placement: {
          from: from,
          align: align,
        },
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>",
      }
    );
  }
}
