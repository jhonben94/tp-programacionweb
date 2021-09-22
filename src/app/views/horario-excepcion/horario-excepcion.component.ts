import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, of } from "rxjs";
import {
    CANTIDAD_PAG_DEFAULT,
    CANTIDAD_PAG_LIST,
    deleteEmptyData, formatearFechaFiltros, obtenerDia, WEEKDAYS,
} from '../../utlis';
import { startWith, switchMap, catchError, map } from "rxjs/operators";
import {CategoriaService, HorarioExcepcionService, PersonaHorarioAgendaService} from 'src/app/services';

import { MatDialog } from "@angular/material/dialog";
import swal from "sweetalert2";
import {HorarioExcepcionEditComponent} from './horario-excepcion-edit/horario-excepcion-edit.component';
import {PersonaHorarioAgendaEditComponent} from '../persona-horario-agenda/persona-horario-agenda-edit/persona-horario-agenda-edit.component';
import {BuscadorEmpleadoComponent} from '../buscadores/buscador-empleado/buscador-empleado.component';
import {BuscadorClienteComponent} from '../buscadores/buscador-cliente/buscador-cliente.component';
import {Router} from '@angular/router';

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
      "idEmpleado",
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
      },
      {
          matDef: "idEmpleado",
          label: "idEmpleado",
          relacion: true,
          descripcion: "EMPLEADO",
          columnaRelacion: ["nombre", "apellido"],
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
      public dialog: MatDialog,
      private router: Router
  ){
    this.filtrosForm = this.fb.group({
        fechaCadena: [""],
        idEmpleado: [""],
        nombreEmpleado: [""]
    });
  }

ngOnInit(): void {
    this.paginator.pageSize = CANTIDAD_PAG_DEFAULT;
    // this.listaSemana = WEEKDAYS;
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

agregar(): void {
    this.router.navigate(["horario-excepcion/agregar"]);
}
acciones(data, e) {
    const id = "idPersonaHorarioAgenda";
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
            this.router.navigate(["horario-excepcion/modificar/", data[id]]);
            break;
        default:
            break;
    }
}

mostrarCampo(row, columna) {
    if (columna.relacion) {
        if (row[columna.label] == null) {
            return "";
        }
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
        if (columna.label == "dia") {
            return obtenerDia(row[columna.label]);
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
    const inicio: any = this.paginator.pageIndex;

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
}
