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

@NgModule({
  declarations: [
    CategoriaComponent,
    CategoriaEditComponent,
    TipoProductoComponent,
    TipoProductoEditComponent,
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
  entryComponents: [CategoriaEditComponent],
})
export class ViewsModule {}
