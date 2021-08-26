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
import { CategoriaService } from "src/app/services";
import { MatDialog } from "@angular/material/dialog";
import { CategoriaEditComponent } from "./categoria-edit/categoria-edit.component";

@Component({
  selector: "app-categoria",
  templateUrl: "./categoria.component.html",
  styleUrls: ["./categoria.component.css"],
})
export class CategoriaComponent implements OnInit {
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
   * @description Definicion de las columnas a ser mostradas
   */
  displayedColumns: string[] = ["idCategoria", "descripcion"];

  opcionPagina = CANTIDAD_PAG_LIST;

  listaColumnas: any = [
    {
      matDef: "idCategoria",
      label: "idCategoria",
      descripcion: "CATEGORÍA",
    },
    {
      matDef: "descripcion",
      label: "descripcion",
      descripcion: "DESCRICIÓN",
    },
  ];
  data: any[] = [];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private service: CategoriaService,
    public dialog: MatDialog
  ) {
    this.filtrosForm = this.fb.group({
      descripcion: [""],
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
          const params = {
            cantidad: this.paginator.pageSize,
            pagina: this.paginator.pageIndex + 1,
            sortBy: this.sort.active,
            sortOrder: this.sort.direction,
            filtros: JSON.stringify(deleteEmptyData(this.filtrosForm.value)),
          };
          return this.service.listarRecurso(params);
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total;
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
      width: "400px",
      data: { name: "this.name", animal: "this.animal" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed" + result);
    });
  }
}
