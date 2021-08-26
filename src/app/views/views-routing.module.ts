import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria/categoria.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "categoria",
        component: CategoriaComponent,
      },
    ],
  },
];
