import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CategoriaComponent } from "./categoria/categoria.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../app.module";
import { MdModule } from "../md/md.module";
import { routes } from "./views-routing.module";
import { CategoriaEditComponent } from "./categoria/categoria-edit/categoria-edit.component";
import { TipoProductoComponent } from "./tipo-producto/tipo-producto.component";
import { TipoProductoEditComponent } from "./tipo-producto/tipo-producto-edit/tipo-producto-edit.component";

import { PresentacionProductoComponent } from "./presentacion-producto/presentacion-producto.component";
import { PresentacionProductoEditComponent } from "./presentacion-producto/presentacion-producto-edit/presentacion-producto-edit.component";
import { PersonaComponent } from "./persona/persona.component";
import { PersonaEditComponent } from "./persona/persona-edit/persona-edit.component";
import { ReservasComponent } from "./reservas/reservas.component";
import { BuscadorEmpleadoComponent } from "./buscadores/buscador-empleado/buscador-empleado.component";
import { BuscadorClienteComponent } from "./buscadores/buscador-cliente/buscador-cliente.component";
import { CrearReservaComponent } from "./reservas/crear-reserva/crear-reserva.component";
import { PersonaHorarioAgendaComponent } from './persona-horario-agenda/persona-horario-agenda.component';
import { PersonaHorarioAgendaEditComponent } from './persona-horario-agenda/persona-horario-agenda-edit/persona-horario-agenda-edit.component';
import { HorarioExcepcionComponent } from './horario-excepcion/horario-excepcion.component';
import { HorarioExcepcionEditComponent } from './horario-excepcion/horario-excepcion-edit/horario-excepcion-edit.component';
import { FichaComponent } from './ficha/ficha.component';
import { FichaEditComponent } from './ficha/ficha-edit/ficha-edit.component';
import { BuscadorTipoProductoComponent } from './buscadores/buscador-tipo-producto/buscador-tipo-producto/buscador-tipo-producto.component';
import { ReporteServicioComponent } from './reportes/reporte-servicio/reporte-servicio.component';
import { ReporteServicioDetalleComponent } from './reportes/reporte-servicio-detalle/reporte-servicio-detalle.component';
import { ServicioComponent } from './servicio/servicio.component';
import { ServicioEditComponent } from './servicio/servicio-edit/servicio-edit.component';

@NgModule({
  declarations: [
    CategoriaComponent,
    CategoriaEditComponent,
    TipoProductoComponent,
    TipoProductoEditComponent,
    PresentacionProductoComponent,
    PresentacionProductoEditComponent,
    PersonaComponent,
    PersonaEditComponent,
    FichaComponent,
    FichaEditComponent,
    ReservasComponent,
    BuscadorClienteComponent,
    BuscadorEmpleadoComponent,
    CrearReservaComponent,
    PersonaHorarioAgendaComponent,
    PersonaHorarioAgendaEditComponent,
    HorarioExcepcionComponent,
    HorarioExcepcionEditComponent,
    BuscadorTipoProductoComponent,
    ReporteServicioComponent,
    ReporteServicioDetalleComponent,
    ServicioComponent,
    ServicioEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MdModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    CategoriaEditComponent,
    BuscadorEmpleadoComponent,
    BuscadorClienteComponent,
  ],
})
export class ViewsModule { }
