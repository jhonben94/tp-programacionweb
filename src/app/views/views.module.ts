import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CategoriaComponent } from "./categoria/categoria.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../app.module";
import { MdModule } from "../md/md.module";
import { routes } from "./views-routing.module";

@NgModule({
  declarations: [CategoriaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MdModule,
    MaterialModule,
  ],
})
export class ViewsModule {}
