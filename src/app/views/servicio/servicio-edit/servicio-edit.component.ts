import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ServicioService,
} from "src/app/services";
import swal from "sweetalert2";
import { BuscadorClienteComponent } from "../../buscadores/buscador-cliente/buscador-cliente.component";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { BuscadorTipoProductoComponent } from "../../buscadores/buscador-tipo-producto/buscador-tipo-producto/buscador-tipo-producto.component";

@Component({
  selector: 'app-servicio-edit',
  templateUrl: './servicio-edit.component.html',
  styleUrls: ['./servicio-edit.component.css']
})
export class ServicioEditComponent implements OnInit {
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
    private service: ServicioService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      observacion: [""],
      idEmpleado: [""],
      idCliente: [""],
      nombreEmpleado: [""],
      nombreCliente: [""],
      fechaDesde: [""],
      fechaHasta: [""],
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.service.listarRecurso({}).subscribe((res: any) => {
      this.listaCategoria = res.lista;
    });

    if (this.id) {
      this.titulo = "MODIFICAR SERVICIO";
      //obtener datos de la persona.
      // settear en el formulario.
    } else {
      this.titulo = "AGREGAR SERVICIO";
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
  confirmar() {
    let valorForm = this.form.value;

    delete valorForm.nombreEmpleado;
    console.log(valorForm);

    if (this.id) {
      this.service.modificarRecurso(valorForm, this.id).subscribe(
        (res) => {
          swal
            .fire({
              title: "Éxito!",
              text: "El registro fue modificado correctamente.",
              icon: "success",
              customClass: {
                confirmButton: "btn btn-success",
              },
              buttonsStyling: false,
            })
            .then(() => {
              this.form.reset();
            });
        },
        (err) => {
          swal.fire({
            title: "Error!",
            text: "Error al modificar el registro.",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-info",
            },
            buttonsStyling: false,
          });
        }
      );
    } else {
      this.service.agregarRecurso(valorForm).subscribe(
        (res) => {
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
              this.form.reset();
            });
        },
        (err) => {
          swal.fire({
            title: "Error!",
            text: "Error al guardar el registro.",
            icon: "error",
            customClass: {
              confirmButton: "btn btn-info",
            },
            buttonsStyling: false,
          });
        }
      );
    }
  }
  cancelar() {
    this.router.navigate(["/servicio"]);
  }

}
