import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HorseListService } from '../service/horse-list.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

interface Color {
  value: string;
  viewValue: string;
}

interface Horse {
  horse_name: string;
  horse_number: string;
  age_verified: boolean;
  dob: string;
  color: string;
  ushja_registered: boolean;
}

@Component({
  selector: 'app-add-edit-row',
  templateUrl: './add-edit-row.component.html',
  styleUrls: ['./add-edit-row.component.scss']
})
export class AddEditRowComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _horseService: HorseListService,
    public dialogRef: MatDialog
  ) {}
  addEditForm: FormGroup;
  colors: Color[] = [
    { value: 'brown', viewValue: 'brown' },
    { value: 'white', viewValue: 'white' },
    { value: 'gray', viewValue: 'gray' }
  ];
  operation: string;
  get;
  ngOnInit() {
    console.log(this.data.id);
    this.operation = this.data.type;

    this.addEditForm = this._fb.group({
      horse_name: ['', Validators.required],
      horse_number: [''],
      age_verified: [''],
      dob: [''],
      color: [''],
      ushja_registered: ['']
    });

    if (this.data.id) {
      this._horseService
        .getHorseData(this.data.id)
        .pipe(map(res => res.data))
        .subscribe(horseData => {
          console.log(horseData);

          this.addEditForm.controls.horse_name.setValue(horseData.horse_name);

          this.addEditForm.controls.horse_number.setValue(
            horseData.horse_number
          );
          this.addEditForm.controls.age_verified.setValue(
            horseData.age_verified === 1 ? true : false
          );
          this.addEditForm.controls.dob.setValue(horseData.dob);
          this.addEditForm.controls.color.setValue(horseData.color);
          this.addEditForm.controls.ushja_registered.setValue(
            horseData.ushja_registered === 1 ? true : false
          );
        });
    }
  }

  onSubmit() {
    if (this.addEditForm.value.dob) {
      this.addEditForm.value.dob = moment(this.addEditForm.value.dob._d).format(
        'YYYY-MM-DD'
      );
    }
    if (this.data.id) {
      this.addEditForm.value.id = this.data.id;
      this._horseService
        .updateHorseData(this.addEditForm.value)
        .pipe(map(res => res.data))
        .subscribe(updateData => {
          const listData: [] = this._horseService.horseListValue;
          const index = listData.findIndex(data => data.id === updateData.id);
          if (index > 0) {
            listData[index] = updateData;
            this._horseService.horseList$.next(listData);
          }
        });
    } else {
      this._horseService
        .putHorseData(this.addEditForm.value)
        .pipe(map(res => res.data))
        .subscribe(patchData => {
          console.log(this._horseService.horseListValue);
          const listData: [] = this._horseService.horseListValue;
          listData.push(patchData);
          this._horseService.horseList$.next(listData);
        });
    }
  }
  dialogClose(): void {
    this.dialogRef.closeAll();
  }
}
