import { Component, OnInit } from '@angular/core';
import { HorseListService } from '../service/horse-list.service';
// import {
//   MatDialog,
//   MatDialogRef,
//   MAT_DIALOG_DATA
// } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-horse-list',
  templateUrl: './horse-list.component.html',
  styleUrls: ['./horse-list.component.scss']
})
export class HorseListComponent implements OnInit {
  constructor(private _horseService: HorseListService) {}
  displayedColumns: string[] = [
    'horse_name',
    'horse_number',
    'age_verified',
    'dob',
    'color',
    'ushja_registered',
    'action'
  ];
  dataSource;
  ngOnInit() {
    this._horseService.getHorseList().subscribe(list => {
      this.dataSource = new MatTableDataSource(list.data);
    });
  }
}
