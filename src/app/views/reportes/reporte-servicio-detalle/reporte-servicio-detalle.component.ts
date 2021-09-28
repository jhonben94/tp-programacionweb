import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, of } from "rxjs";
import {
  CANTIDAD_PAG_DEFAULT,
  CANTIDAD_PAG_LIST,
  deleteEmptyData,
  formatearFechaFiltros,
} from "../../../utlis";
import { startWith, switchMap, catchError, map } from "rxjs/operators";
import { ExportService, ServicioService } from "src/app/services";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import { Router } from "@angular/router";
import { PersonaEditComponent } from "../../persona/persona-edit/persona-edit.component";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { BuscadorClienteComponent } from "../../buscadores/buscador-cliente/buscador-cliente.component";

@Component({
  selector: "app-reporte-servicio-detalle",
  templateUrl: "./reporte-servicio-detalle.component.html",
  styleUrls: ["./reporte-servicio-detalle.component.css"],
})
export class ReporteServicioDetalleComponent implements OnInit {
  /**
   * @type {boolean}
   * @description Flag que maneja el Expansion Panel de filtros
   */
  expanded = true;

  /**
   * @type {object}
   * @description Form para capturar los datos a ser utilizado como filtros para la grilla
   */
  filtrosForm = this.fb.group({
    descripcion: [""],
  });

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
    "idServicioDetalle",
    "cantidad",
    "idServicio",
    "totalDetalle",
    "fechaHora",
    "idPresentacionProducto",
    "idEmpleado",
    "cliente",
  ];

  opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "idServicioDetalle",
      label: "idServicioDetalle",
      descripcion: "SERVICIO DETALLE",
    },
    {
      matDef: "cantidad",
      label: "cantidad",
      descripcion: "CANTIDAD",
    },
    {
      matDef: "idServicio",
      label: "idServicio",
      descripcion: "PRECIO",
      relacion: true,
      columnaRelacion: ["presupuesto"],
    },
    {
      matDef: "totalDetalle",
      label: "totalDetalle",
      descripcion: "TOTAL DETALLE",
    },
    {
      matDef: "fechaHora",
      label: "fechaHora",
      descripcion: "FECHA",
    },

    {
      matDef: "cliente",
      label: "cliente",
      descripcion: "CLIENTE",
    },
    {
      matDef: "idPresentacionProducto",
      label: "idPresentacionProducto",
      descripcion: "PRESENTACION PROD.",
      relacion: true,
      columnaRelacion: ["nombre"],
    },

    {
      matDef: "idEmpleado",
      label: "idEmpleado",
      relacion: true,
      descripcion: "EMPLEADO",
      columnaRelacion: ["nombre", "apellido"],
    },
  ];
  /**
   * @type {Array}
   * @description Lista que contiene los valores para la grilla
   */
  data: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private service: ServicioService,
    private router: Router,
    public dialog: MatDialog,
    private exportarService: ExportService
  ) {
    this.filtrosForm = this.fb.group({
      observacion: [""],
      idEmpleado: [""],
      idCliente: [""],
      motivoConsulta: [""],
      nombreEmpleado: [""],
      nombreCliente: [""],
      fechaDesde: ["", Validators.required],
      fechaHasta: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    //this.paginator.pageSize = CANTIDAD_PAG_DEFAULT;
  }

  ngAfterViewInit() {
    // Si se cambia el orden, se vuelve a la primera pag.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    //this.buscar();
  }

  get f() {
    return this.filtrosForm.controls;
  }

  buscar() {
    this.isLoadingResults = true;

    let filterData = Object.assign({}, this.filtrosForm.value);
    delete filterData.nombreEmpleado;
    delete filterData.nombreCliente;
    if (filterData.idEmpleado)
      filterData.idEmpleado = {
        idPersona: filterData.idEmpleado,
      };
    if (filterData.idFichaClinica)
      filterData.idFichaClinica = {
        idCliente: filterData.idCliente,
      };

    filterData.fechaDesdeCadena = filterData.fechaDesde
      ? formatearFechaFiltros(filterData.fechaDesde)
      : "";

    filterData.fechaHastaCadena = filterData.fechaHasta
      ? formatearFechaFiltros(filterData.fechaHasta)
      : "";

    delete filterData.fechaDesde;
    delete filterData.fechaHasta;
    delete filterData.idCliente;

    const filtros = {
      idServicio: {
        idFichaClinica: filterData.idFichaClinica,
      },
      idEmpleado: filterData.idEmpleado,
    };
    const params = {
      detalle: "S",
      ejemplo: JSON.stringify(deleteEmptyData({})),
    };
    console.log(params);

    this.service.listarRecurso(params).subscribe(
      (resp: any) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.data = resp.lista;
      },
      (error) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.data = [];
      }
    );
  }

  openDialog(): void {
    this.router.navigate(["/servicio/agregar"]);
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
      if (columna.label == "fechaHora") {
        return row.idServicio.fechaHora;
      }
      if (columna.label == "cliente") {
        return row.idServicio.idFichaClinica.idCliente.nombreCompleto;
      }
      if (columna.label == "idEmpleado") {
        return row.idServicio.idServicio.idEmpleado.nombreCompleto;
      }
      if (columna.label == "totalDetalle") {
        return row.idServicio.presupuesto * row.cantidad;
      }
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
  limpiar() {
    this.filtrosForm.reset();
    this.data = [];
  }

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
            this.f.nombreCliente.setValue(
              result.nombre + " " + result.apellido
            );
            this.f.idCliente.setValue(result.idPersona);
          } else {
            this.f.nombreEmpleado.setValue(null);
          }
        });
        break;

      default:
        break;
    }
  }

  downloadPdf() {
    this.exportarService.exportPdf(this.data, this.listaColumnas, "S");
  }
  downloadExcel() {
    let lista = [];
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      let tempObj = {};
      for (let jota = 0; jota < this.listaColumnas.length; jota++) {
        const columnaDef = this.listaColumnas[jota];
        tempObj[columnaDef.matDef] = this.mostrarCampo(element, columnaDef);
      }
      lista.push(tempObj);
    }
    this.exportarService.exportExcel(lista, "excel");
  }
}
