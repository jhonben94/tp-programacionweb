import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  deleteEmptyData,
  formatearFechaFiltros,
  WEEKDAYS,
} from "../../../utlis";
import swal from "sweetalert2";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { HorarioExcepcionService } from "../../../services";

@Component({
  selector: "app-horario-excepcion-edit",
  templateUrl: "./horario-excepcion-edit.component.html",
  styleUrls: ["./horario-excepcion-edit.component.css"],
})
export class HorarioExcepcionEditComponent implements OnInit {
  form: FormGroup;
  id: any;
  titulo: any;
  listaSemana: any[];
  filtrosForm = this.fb.group({
    descripcion: [""],
  });
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: HorarioExcepcionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      fechaCadena: ["", Validators.required],
      flagEsHabilitar: [""],
      idEmpleado: ["", Validators.required],
      nombreEmpleado: [""],
    });
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.listaSemana = WEEKDAYS;
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.titulo = "MODIFICAR HORARIO EXCEPCIONAL";
      //obtener datos de la persona.
      // settear en el formulario.
      this.service.obtenerRecurso(this.id).subscribe((res: any) => {
        console.log(res);
        let filterData = this.filtrosForm.value;
        filterData.fechaCadena = formatearFechaFiltros(filterData.fechaCadena);
        this.f.fechaCadena.setValue(res.fechaCadena);
        this.f.flagEsHabilitar.setValue(
          res.flagEsHabilitar == "S" ? true : false
        );
        this.f.idEmpleado.setValue(res.idEmpleado.idPersona);
        this.f.nombreEmpleado.setValue(res.idEmpleado.nombreCompleto);
      });
    } else {
      this.titulo = "AGREGAR HORARIO EXCEPCIONAL";
      this.f.flagEsHabilitar.setValue(true);
    }
  }

  confirmar() {
    let valorForm = Object.assign({}, this.form.value);
    delete valorForm.nombreEmpleado;
    valorForm.fechaCadena = formatearFechaFiltros(valorForm.fechaCadena);
    valorForm.flagEsHabilitar = valorForm.flagEsHabilitar ? "S" : "N";
    valorForm.idEmpleado = {
      idPersona: valorForm.idEmpleado,
    };
    console.log(valorForm);
    console.log(this.form.valid);

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
      default:
        break;
    }
  }
  cancelar() {
    this.router.navigate(["/horario-excepcion"]);
  }
}
