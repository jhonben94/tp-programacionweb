import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, of } from "rxjs";
import {
    CANTIDAD_PAG_DEFAULT,
    CANTIDAD_PAG_LIST,
    deleteEmptyData, formatearFechaFiltros,
} from '../../utlis';
import { startWith, switchMap, catchError, map } from "rxjs/operators";
import {CategoriaService, HorarioExcepcionService} from 'src/app/services';

import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import {HorarioExcepcionEditComponent} from './horario-excepcion-edit/horario-excepcion-edit.component';
import {CategoriaEditComponent} from '../categoria/categoria-edit/categoria-edit.component';
import {PersonaHorarioAgendaEditComponent} from '../persona-horario-agenda/persona-horario-agenda-edit/persona-horario-agenda-edit.component';

@Component({
  selector: 'app-horario-excepcion',
  templateUrl: './horario-excepcion.component.html',
  styleUrls: ['./horario-excepcion.component.css']
})
export class HorarioExcepcionComponent implements OnInit {
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
      "idHorarioExcepcion",
      "fechaCadena",
      "horaAperturaCadena",
      "horaCierreCadena",
      "flagEsHabilitar",
      "intervaloMinutos",
      "accion"
  ];

//     "fechaCadena": "20190910",
//     "horaAperturaCadena":"2000",
//     "horaCierreCadena":"2230",
//     "flagEsHabilitar":"S",
//     "idEmpleado":{
//         "idPersona":4
//     } ,
//     "intervaloMinutos":10
// }


opcionPagina = CANTIDAD_PAG_LIST;
  /**
   * @type {Array}
   * @description Definicion dinamica de las columnas a ser visualizadas
   */
  listaColumnas: any = [
    {
      matDef: "idHorarioExcepcion",
      label: "idHorarioExcepcion",
      descripcion: "ID",
    },
    {
      matDef: "fechaCadena",
      label: "fechaCadena",
      descripcion: "FECHA",
    },
      {
          matDef: "horaAperturaCadena",
          label: "horaAperturaCadena",
          descripcion: "HORA DE APERTURA",
      },
      {
          matDef: "horaCierreCadena",
          label: "horaCierreCadena",
          descripcion: "HORA DE CIERRE",
      },
      {
          matDef: "flagEsHabilitar",
          label: "flagEsHabilitar",
          descripcion: "HABILITADO",
      },
      {
          matDef: "intervaloMinutos",
          label: "intervaloMinutos",
          descripcion: "Intervalo Minutos",
      }
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
      private service: HorarioExcepcionService,
      public dialog: MatDialog
  ) {
    this.filtrosForm = this.fb.group({
        fechaCadena: [""],
        idHorarioExcepcion: [""]
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
                let filtros = this.filtrosForm.value
                console.log(formatearFechaFiltros(filtros.fechaCadena))
                // filtros.fechaCadena = formatearFechaFiltros(filtros.fechaCadena)
              this.isLoadingResults = true;
              const params = {
                cantidad: this.paginator.pageSize,
                inicio: this.retornaInicio(),
                orderBy: this.sort.active,
                orderDir: this.sort.direction,
                like: "S",
                ejemplo: JSON.stringify(deleteEmptyData(filtros)),
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
    const dialogRef = this.dialog.open(CategoriaEditComponent, {
      width: "",
      data: {
        title: "Agregar Horario Exepcional",
        label: "Se agrega el Horario Exepcional correspondiente.",
        entity: {},
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
    const id = "idHorarioExcepcion";
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
        const dialogRef = this.dialog.open(PersonaHorarioAgendaEditComponent, {
          width: "",
          data: {
            title: "Modificar Horario",
            label: "Se modifica Horario: " + data[id],
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

}
