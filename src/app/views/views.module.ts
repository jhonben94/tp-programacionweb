import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CategoriaComponent } from "./categoria/categoria.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../app.module";
import { MdModule } from "../md/md.module";
import { routes } from "./views-routing.module";
import { CategoriaEditComponent } from "./categoria/categoria-edit/categoria-edit.component";

@NgModule({
  declarations: [CategoriaComponent, CategoriaEditComponent],
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
