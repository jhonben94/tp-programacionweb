import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DialogModel } from "src/app/models";

@Component({
  selector: "app-tipo-producto-edit",
  templateUrl: "./tipo-producto-edit.component.html",
  styleUrls: ["./tipo-producto-edit.component.css"],
})
export class TipoProductoEditComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TipoProductoEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel
  ) {}

  entity: any;
  lista: any[];
  ngOnInit(): void {
    this.entity = this.data.entity;
    this.lista = this.data.lista;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
