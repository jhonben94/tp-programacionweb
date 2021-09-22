import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PersonaHorarioAgendaService } from "src/app/services";
import { formatearFecha } from "src/app/utlis";
import swal from "sweetalert2";
import {PersonaHorarioAgendaComponent} from '../persona-horario-agenda.component';

@Component({
  selector: 'app-persona-horario-agenda-edit',
  templateUrl: './persona-horario-agenda-edit.component.html',
  styleUrls: ['./persona-horario-agenda-edit.component.css']
})
export class PersonaHorarioAgendaEditComponent implements OnInit {
  form: any;
  id: any;
  titulo: any;
  listaTipoPersona: any[] = [{ codigo: "FISICA" }, { codigo: "JURIDICA" }];
  constructor(
      private fb: FormBuilder,
      private service: PersonaHorarioAgendaService,
      private route: ActivatedRoute,
      private router: Router
  ) {
    this.form = this.fb.group({
        dia: ["", Validators.required],
        horaApertura: ["", Validators.required],
        horaCierre: ["", [Validators.required, Validators.email]],
        intervaloMinutos: ["", Validators.required],
      // ruc: ["", Validators.required],
      // cedula: ["", Validators.required],
      // tipoPersona: ["", Validators.required],
      // fechaNacimiento: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (this.id) {
      this.titulo = "MODIFICAR HORARIO AGENDA";
      //obtener datos de la persona.
      // settear en el formulario.
    } else {
      this.titulo = "AGREGAR HORARIO AGENDA";
    }
  }

  confirmar() {
    let valorForm = this.form.value;

    valorForm.fechaNacimiento = formatearFecha(valorForm.fechaNacimiento);

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
    this.router.navigate(["/persona-horario-agenda"]);
  }
}

