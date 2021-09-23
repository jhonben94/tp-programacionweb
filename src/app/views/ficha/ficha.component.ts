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
  FichaService,
  TipoProductoService,
} from "src/app/services";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import { FichaEditComponent } from "./ficha-edit/ficha-edit.component";
import { BuscadorEmpleadoComponent } from "../buscadores/buscador-empleado/buscador-empleado.component";
import { BuscadorClienteComponent } from "../buscadores/buscador-cliente/buscador-cliente.component";
import { Router } from "@angular/router";
import { BuscadorTipoProductoComponent } from "../buscadores/buscador-tipo-producto/buscador-tipo-producto/buscador-tipo-producto.component";

@Component({
  selector: "app-ficha",
  templateUrl: "./ficha.component.html",
  styleUrls: ["./ficha.component.css"],
})
export class FichaComponent implements OnInit {
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
    "idFichaClinica",
    "motivoConsulta",
    "diagnostico",
    "observacion",
    "fechaHoraCadenaFormateada",
    "idEmpleado",
    "idCliente",
    "idTipoProducto",
    "accion",
  ];

  opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "idFichaClinica",
      label: "idFichaClinica",
      descripcion: "ID FICHA",
    },
    {
      matDef: "motivoConsulta",
      label: "motivoConsulta",
      descripcion: "MOTIVO DE CONSULTA",
    },
    {
      matDef: "diagnostico",
      label: "diagnostico",
      descripcion: "DIAGNOSTICO",
    },
    {
      matDef: "observacion",
      label: "observacion",
      descripcion: "OBSERVACIÓN",
    },
    {
      matDef: "fechaHoraCadenaFormateada",
      label: "fechaHoraCadenaFormateada",
      descripcion: "FECHA",
    },
    {
      matDef: "idCliente",
      label: "idCliente",
      descripcion: "CLIENTE",
      relacion: true,
      columnaRelacion: ["nombre"],
    },
    {
      matDef: "idEmpleado",
      label: "idEmpleado",
      relacion: true,
      descripcion: "EMPLEADO",
      columnaRelacion: ["nombre"],
    },
    {
      matDef: "idTipoProducto",
      label: "idTipoProducto",
      descripcion: "TIPO PRODUCTO",
      relacion: true,
      columnaRelacion: ["descripcion"],
    },
  ];
  /**
   * @type {Array}
   * @description Lista que contiene los valores para la grilla
   */
  data: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  listaCategoria: any[] = [];
  listaTipoProducto: any[] = [];
  constructor(
    private fb: FormBuilder,
    private service: FichaService,
    public dialog: MatDialog,
    private router: Router,
    private categoriaService: CategoriaService,
    private tipoProductoService: TipoProductoService
  ) {
    this.filtrosForm = this.fb.group({
      motivoConsulta: [""],
      diagnostico: [""],
      observacion: [""],
      idEmpleado: [""],
      idCliente: [""],
      nombreEmpleado: [""],
      nombreCliente: [""],
      fechaDesde: [""],
      fechaHasta: [""],
      idCategoria: [""],
      idTipoProducto: [""],
    });
  }

  ngOnInit(): void {
    this.categoriaService.listarRecurso({}).subscribe((res: any) => {
      this.listaCategoria = res.lista;
    });
    this.paginator.pageSize = CANTIDAD_PAG_DEFAULT;

    this.filtrosForm.get("idCategoria").valueChanges.subscribe((x) => {
      console.log(x);
      this.buscarTipoProducto(x);
    });
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
          delete filterData.idCategoria;

          const params = {
            cantidad: this.paginator.pageSize,
            inicio: this.retornaInicio(),
            orderBy: this.sort.active,
            orderDir: this.sort.direction,
            like: "S",
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
    this.router.navigate(["/ficha/agregar"]);
  }

  acciones(data, e) {
    const id = "idFichaClinica";
    const actionType = e.target.getAttribute("data-action-type");
    switch (actionType) {
      case "activar":
        break;
      case "eliminar":
        swal
          .fire({
            title: "Está seguro que desea eliminar el registro?",
            text: "Esta acción no se podrá revertir!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger",
            },
            confirmButtonText: "Eliminar",
            buttonsStyling: false,
          })
          .then((result) => {
            if (result.value) {
              this.service.eliminarRecurso(data[id]).subscribe((res) => {
                swal
                  .fire({
                    title: "Éxito!",
                    text: "El registro fue eliminado correctamente.",
                    icon: "success",
                    customClass: {
                      confirmButton: "btn btn-success",
                    },
                    buttonsStyling: false,
                  })
                  .then(() => {
                    this.limpiar();
                  });
              });
            }
          });
        break;
      case "editar":
        const dialogRef = this.dialog.open(FichaEditComponent, {
          width: "",
          data: {
            title: "Modificar Categoria",
            label: "Se modifica categoria: " + data[id],
            entity: data,
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.service.modificarRecurso(result, data[id]).subscribe((res) => {
              console.log(res);
              swal
                .fire({
                  title: "Éxito!",
                  text: "El registro fue creado correctamente.",
                  icon: "success",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                  buttonsStyling: false,
                })
                .then(() => {
                  this.limpiar();
                });
            });
          }
        });
        break;
      default:
        break;
    }
  }
  mostrarCampo(row, columna) {
    if (columna.relacion) {
      if (row[columna.label] == null) return "";
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

      case "idTipoProducto":
        dialogRef = this.dialog.open(BuscadorTipoProductoComponent, {
          data: {
            title: "Buscador de Tipo Productos",
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log(result);
          if (result) {
            this.f.descripcion.setValue(result.descripcion);
            this.f.idTipoProducto.setValue(result.idTipoProducto);
          }
        });
        break;

      default:
        break;
    }
  }
  buscarTipoProducto(idCategoria) {
    console.log("buscar");

    this.tipoProductoService
      .listarRecurso({
        ejemplo: JSON.stringify({ idCategoria }),
      })
      .subscribe((res: any) => {
        this.f.idTipoProducto.setValue(null);
        this.listaTipoProducto = res.lista;
      });
  }
}
