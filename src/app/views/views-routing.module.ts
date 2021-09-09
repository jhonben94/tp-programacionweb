import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria/categoria.component";
import { PersonaEditComponent } from "./persona/persona-edit/persona-edit.component";
import { PersonaComponent } from "./persona/persona.component";
import { PresentacionProductoComponent } from "./presentacion-producto/presentacion-producto.component";
import { CrearReservaComponent } from "./reservas/crear-reserva/crear-reserva.component";
import { ReservasComponent } from "./reservas/reservas.component";
import { TipoProductoComponent } from "./tipo-producto/tipo-producto.component";

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
        path: "reserva",
        component: ReservasComponent,
      },
      {
        path: "reserva/agregar",
        component: CrearReservaComponent,
      },
    ],
  },
];
