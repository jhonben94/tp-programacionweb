import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria/categoria.component";
import { FichaComponent } from "./ficha/ficha.component";
import { PersonaEditComponent } from "./persona/persona-edit/persona-edit.component";
import { PersonaComponent } from "./persona/persona.component";
import { PresentacionProductoComponent } from "./presentacion-producto/presentacion-producto.component";
import { CrearReservaComponent } from "./reservas/crear-reserva/crear-reserva.component";
import { ReservasComponent } from "./reservas/reservas.component";
import { TipoProductoComponent } from "./tipo-producto/tipo-producto.component";
import { PersonaHorarioAgendaComponent } from "./persona-horario-agenda/persona-horario-agenda.component";
import { HorarioExcepcionComponent } from "./horario-excepcion/horario-excepcion.component";
import { PersonaHorarioAgendaEditComponent } from "./persona-horario-agenda/persona-horario-agenda-edit/persona-horario-agenda-edit.component";
import { FichaEditComponent } from "./ficha/ficha-edit/ficha-edit.component";
import { ServicioComponent } from "./servicio/servicio.component";
import { ServicioEditComponent } from "./servicio/servicio-edit/servicio-edit.component";
import { HorarioExcepcionEditComponent } from "./horario-excepcion/horario-excepcion-edit/horario-excepcion-edit.component";
import { ReporteServicioComponent } from "./reportes/reporte-servicio/reporte-servicio.component";
import { ReporteServicioDetalleComponent } from "./reportes/reporte-servicio-detalle/reporte-servicio-detalle.component";
import {HorarioExcepcionFisioComponent} from './horario-excepcion/horario-excepcion-fisio/horario-excepcion-fisio.component';

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "categoria",
        component: CategoriaComponent,
      },
      {
        path: "tipo-producto",
        component: TipoProductoComponent,
      },
      {
        path: "presentacion-producto",
        component: PresentacionProductoComponent,
      },
      {
        path: "persona-horario-agenda",
        component: PersonaHorarioAgendaComponent,
      },
      {
        path: "persona-horario-agenda/agregar",
        component: PersonaHorarioAgendaEditComponent,
      },
      {
        path: "persona-horario-agenda/modificar/:id",
        component: PersonaHorarioAgendaEditComponent,
      },
      {
        path: "horario-excepcion",
        component: HorarioExcepcionComponent,
      },
      {
        path: "horario-excepcion/agregar",
        component: HorarioExcepcionEditComponent,
      },
      {
        path: "horario-excepcion/agregar-fisio",
        component: HorarioExcepcionFisioComponent,
      },
      {
        path: "horario-excepcion/modificar/:id",
        component: HorarioExcepcionEditComponent,
      },
      {
        path: "persona",
        component: PersonaComponent,
      },
      {
        path: "persona/agregar",
        component: PersonaEditComponent,
      },
      {
        path: "persona/modificar/:id",
        component: PersonaEditComponent,
      },
      {
        path: "ficha",
        component: FichaComponent,
      },
      {
        path: "ficha/agregar",
        component: FichaEditComponent,
      },
      {
        path: "ficha/modificar/:id",
        component: FichaEditComponent,
      },
      {
        path: "reserva",
        component: ReservasComponent,
      },
      {
        path: "reserva/agregar",
        component: CrearReservaComponent,
      },
      {
        path: "servicio",
        component: ServicioComponent,
      },
      {
        path: "reporte/servicio",
        component: ReporteServicioComponent,
      },
      {
        path: "reporte/servicio-detalle",
        component: ReporteServicioDetalleComponent,
      },
    ],
  },
];
