import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria/categoria.component";
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
    ],
  },
];
