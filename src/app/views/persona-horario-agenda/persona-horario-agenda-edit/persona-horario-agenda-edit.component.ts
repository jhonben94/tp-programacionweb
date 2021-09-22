import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonaHorarioAgendaService } from "src/app/services";
import { formatearFecha, WEEKDAYS } from "src/app/utlis";
import swal from "sweetalert2";
import { BuscadorEmpleadoComponent } from "../../buscadores/buscador-empleado/buscador-empleado.component";
import { PersonaHorarioAgendaComponent } from "../persona-horario-agenda.component";

@Component({
  selector: "app-persona-horario-agenda-edit",
  templateUrl: "./persona-horario-agenda-edit.component.html",
  styleUrls: ["./persona-horario-agenda-edit.component.css"],
})
export class PersonaHorarioAgendaEditComponent implements OnInit {
  form: FormGroup;
  id: any;
  titulo: any;
  listaSemana: any[];
  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service: PersonaHorarioAgendaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      dia: ["", Validators.required],
      horaAperturaCadena: ["", Validators.required],
      horaCierreCadena: ["", Validators.required],
      intervaloMinutos: ["", Validators.required],
      idEmpleado: ["", Validators.required],
      nombreEmpleado: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.listaSemana = WEEKDAYS;
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.titulo = "MODIFICAR HORARIO AGENDA";
      //obtener datos de la persona.
      // settear en el formulario.
      this.service.obtenerRecurso(this.id).subscribe((res: any) => {
        console.log(res);

        this.f.dia.setValue(res.dia);
        this.f.horaCierreCadena.setValue(res.horaCierreCadena);
        this.f.horaAperturaCadena.setValue(res.horaAperturaCadena);
        this.f.intervaloMinutos.setValue(res.intervaloMinutos);
        this.f.idEmpleado.setValue(res.idEmpleado.idPersona);
        this.f.nombreEmpleado.setValue(res.idEmpleado.nombreCompleto);
      });
    } else {
      this.titulo = "AGREGAR HORARIO AGENDA";
    }
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
      default:
        break;
    }
  }

  get f() {
    return this.form.controls;
  }

  cancelar() {
    this.router.navigate(["/persona-horario-agenda"]);
  }
}
