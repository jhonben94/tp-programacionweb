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
import { CategoriaService, TipoProductoService } from "src/app/services";
import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import { TipoProductoEditComponent } from "./tipo-producto-edit/tipo-producto-edit.component";

@Component({
  selector: "app-tipo-producto",
  templateUrl: "./tipo-producto.component.html",
  styleUrls: ["./tipo-producto.component.css"],
})
export class TipoProductoComponent implements OnInit {
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
    "idTipoProducto",
    "descripcion",
    "idCategoria",
    "accion",
  ];

  opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "idTipoProducto",
      label: "idTipoProducto",
      descripcion: "TIPO PROD.",
    },
    {
      matDef: "descripcion",
      label: "descripcion",
      descripcion: "DESCRICIÓN",
    },
    {
      matDef: "idCategoria",
      label: "idCategoria",
      descripcion: "CATEGORÍA",
      relacion: true,
      columnaRelacion: "descripcion",
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
    private service: TipoProductoService,
    private categoriaService: CategoriaService,
    public dialog: MatDialog
  ) {
    this.filtrosForm = this.fb.group({
      descripcion: [""],
      idCategoria: [""],
    });
  }

  ngOnInit(): void {
    this.paginator.pageSize = CANTIDAD_PAG_DEFAULT;
    this.categoriaService.listarRecurso({}).subscribe((res: any) => {
      this.categorias = res.lista;
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
          const params = {
            cantidad: this.paginator.pageSize,
            inicio: this.retornaInicio(),
            orderBy: this.sort.active,
            orderDir: this.sort.direction,
            like: "S",
            ejemplo: JSON.stringify(deleteEmptyData(this.filtrosForm.value)),
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
    const dialogRef = this.dialog.open(TipoProductoEditComponent, {
      width: "",
      data: {
        title: "Agregar Categoria",
        label: "Se agrega categoria correspondiente.",
        entity: {},
        lista: this.categorias,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        result.flagVisible = "S";
        this.service.agregarRecurso(result).subscribe((res) => {
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
  }

  acciones(data, e) {
    const id = "idTipoProducto";
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
        const dialogRef = this.dialog.open(TipoProductoEditComponent, {
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
    this.filtrosForm.reset({});
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
}
