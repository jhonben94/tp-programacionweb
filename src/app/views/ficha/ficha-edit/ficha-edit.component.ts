import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CategoriaService,
  FichaService,
  TipoProductoService,
} from "src/app/services";
import { PresentacionProductoService } from "src/app/services/presentacion-producto.service";
import { BuscadorClienteComponent } from "../../buscadores/buscador-cliente/buscador-cliente.component";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { BuscadorTipoProductoComponent } from "../../buscadores/buscador-tipo-producto/buscador-tipo-producto/buscador-tipo-producto.component";

@Component({
  selector: "app-ficha-edit",
  templateUrl: "./ficha-edit.component.html",
  styleUrls: ["./ficha-edit.component.css"],
})
export class FichaEditComponent implements OnInit {
  /**
   * @type {boolean}
   * @description Flag que maneja el Expansion Panel de filtros
   */
  expanded = true;
  /**
   * @type {object}
   * @description Form para capturar los datos a ser utilizado como filtros para la grilla
   */
  form = this.fb.group({
    descripcion: [""],
  });
  listaCategoria: any[] = [];
  listaTipoProducto: any[] = [];
  id: string;
  titulo: string;
  constructor(
    private fb: FormBuilder,
    private service: FichaService,
    public dialog: MatDialog,
    public categoriaService: CategoriaService,
    private tipoProductoService: TipoProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
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
    this.id = this.route.snapshot.paramMap.get("id");

    this.categoriaService.listarRecurso({}).subscribe((res: any) => {
      this.listaCategoria = res.lista;
    });

    this.form.get("idCategoria").valueChanges.subscribe((x) => {
      console.log(x);
      this.buscarTipoProducto(x);
    });

    if (this.id) {
      this.titulo = "MODIFICAR FICHA CLÍNICA";
      //obtener datos de la persona.
      // settear en el formulario.
    } else {
      this.titulo = "AGREGAR FICHA CLÍNICA";
    }
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
  get f() {
    return this.form.controls;
  }
  confirmar() {}
  cancelar() {
    this.router.navigate(["/ficha"]);
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
