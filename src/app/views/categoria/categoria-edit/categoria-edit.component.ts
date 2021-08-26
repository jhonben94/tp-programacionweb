import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-categoria-edit",
  templateUrl: "./categoria-edit.component.html",
  styleUrls: ["./categoria-edit.component.css"],
})
export class CategoriaEditComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CategoriaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close({ key: "hi" });
  }
}
