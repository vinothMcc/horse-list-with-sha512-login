import { Component, OnInit } from "@angular/core";
import { HorseListService } from "../service/horse-list.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

import { MatTableDataSource } from "@angular/material";
import { AddEditRowComponent } from "../add-edit-row/add-edit-row.component";
import { map } from "rxjs/operators";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { AuthServiceService } from "../service/auth-service.service";
@Component({
  selector: "app-horse-list",
  templateUrl: "./horse-list.component.html",
  styleUrls: ["./horse-list.component.scss"]
})
export class HorseListComponent implements OnInit {
  constructor(
    private _horseService: HorseListService,
    public dialog: MatDialog,
    private _auth: AuthServiceService
  ) {
    this._horseService.horseList$.subscribe(res => {
      if (res != null) {
        this.dataSource = new MatTableDataSource(res);
      }
    });
  }
  displayedColumns: string[] = [
    "horse_name",
    "horse_number",
    "age_verified",
    "dob",
    "color",
    "ushja_registered",
    "action"
  ];
  dataSource;
  ngOnInit() {
    this._horseService
      .getHorseList()
      .pipe(map((res: any) => res.data))
      .subscribe(list => {
        this._horseService.horseList$.next(list);
        this.dataSource = new MatTableDataSource(list);
      });
  }

  addEditRow(id: string) {
    const data = {
      id,
      type: "Add"
    };
    if (id) {
      data.type = "Update";
    }
    const dialogRef = this.dialog.open(AddEditRowComponent, {
      width: "500px",
      data
    });
  }
  deleteRow(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: "Do you confirm the deletion of this data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._horseService
          .deleteHorseData(id)
          .pipe(map((res: any) => res.data))
          .subscribe(res => {
            const listData = this._horseService.horseListValue.filter(
              data => data.id === res.id
            );
            this._horseService.horseList$.next(listData);
          });
      }
    });
  }
  logout() {
    this._auth.logout();
  }
}
