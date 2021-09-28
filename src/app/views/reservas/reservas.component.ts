import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, of } from "rxjs";
import {
  CANTIDAD_PAG_DEFAULT,
  CANTIDAD_PAG_LIST,
  deleteEmptyData,
} from "../../utlis";
import { startWith, switchMap, catchError, map } from "rxjs/operators";
import {
  CategoriaService,
  TipoProductoService,
  ExportService,
} from "src/app/services";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import { ReservasService } from "src/app/services/reservas.service";
import { BuscadorEmpleadoComponent } from "../buscadores/buscador-empleado/buscador-empleado.component";
import { PersonaComponent } from "../persona/persona.component";
import { BuscadorClienteComponent } from "../buscadores/buscador-cliente/buscador-cliente.component";
import { CrearReservaComponent } from "./crear-reserva/crear-reserva.component";
import { Router } from "@angular/router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
@Component({
  selector: "app-reservas",
  templateUrl: "./reservas.component.html",
  styleUrls: ["./reservas.component.css"],
})
export class ReservasComponent implements OnInit {
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
    "idReserva",
    "fecha",
    "horaInicio",
    "horaFin",
    "idCliente",
    "idEmpleado",
    "accion",
  ];

  opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "idReserva",
      label: "idReserva",
      descripcion: "ID",
    },
    {
      matDef: "fecha",
      label: "fecha",
      descripcion: "FECHA",
    },
    {
      matDef: "horaInicio",
      label: "horaInicio",
      descripcion: "HORA INICIO",
    },
    {
      matDef: "horaFin",
      label: "horaFin",
      descripcion: "HORA FIN",
    },
    {
      matDef: "idCliente",
      label: "idCliente",
      descripcion: "CLIENTE",
      relacion: true,
      columnaRelacion: ["nombre", "apellido"],
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
  /**
   * @type {Array}
   * @description Lista que contiene los de las categorias
   */
  categorias: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private service: ReservasService,
    public dialog: MatDialog,
    private router: Router,
    private exportarService: ExportService
  ) {
    this.filtrosForm = this.fb.group({
      fechaDesde: [""],
      fechaHasta: [""],
      idEmpleado: [""],
      idCliente: [""],
      nombreEmpleado: [""],
      nombreCliente: [""],
    });
  }

  ngOnInit(): void {
    this.paginator.pageSize = CANTIDAD_PAG_DEFAULT;
  }

  ngAfterViewInit() {
    // Si se cambia el orden, se vuelve a la primera pag.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.buscar();
  }

  get f() {
    return this.filtrosForm.controls;
  }

  buscar() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;

          let filterData = this.filtrosForm.value;
          delete filterData.nombreEmpleado;
          delete filterData.nombreCliente;
          const id = filterData.idEmpleado;
          delete filterData.idEmpleado;

          const params = {
            cantidad: this.paginator.pageSize,
            inicio: this.retornaInicio(),
            orderBy: this.sort.active,
            orderDir: this.sort.direction,

            ejemplo: JSON.stringify(deleteEmptyData(filterData)),
          };
          return this.service.listarRecurso(params);
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalDatos;
          return data.lista;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe((data) => (this.data = data));
  }

  openDialog(): void {
    this.router.navigate(["reserva/agregar"]);
  }

  acciones(data, e) {
    const id = "idTipoProducto";
    const actionType = e.target.getAttribute("data-action-type");
    switch (actionType) {
      case "cancelar":
        break;
      case "modificar":
        break;
      case "nuevaFicha":
        break;
      default:
        break;
    }
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
  limpiar() {
    this.filtrosForm.reset();
    this.buscar();
  }
  retornaInicio() {
    const cantidad = this.paginator.pageSize;
    let inicio: any = this.paginator.pageIndex;

    if (this.paginator.pageIndex > 0) {
      return (
        cantidad *
        (0 == this.paginator.pageIndex ? 1 : this.paginator.pageIndex)
      );
    }
    return inicio;
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
    this.exportarService.downloadPdf(this.data, this.listaColumnas);
  }
}
