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
  horseName: string;
  horseNumber: string;
  ageVerified: boolean;
  dob: string;
  color: string;
  ushjaRegistered: boolean;
}

@Component({
  selector: 'app-add-edit-row',
  templateUrl: './add-edit-row.component.html',
  styleUrls: ['./add-edit-row.component.scss']
})
export class AddEditRowComponent implements OnInit {
  addEditForm: FormGroup;
  formData: Horse;
  colors: Color[] = [
    { value: 'red', viewValue: 'red' },
    { value: 'blue', viewValue: 'blue' },
    { value: 'green', viewValue: 'green' }
  ];
  operation: string;
  constructor(
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _horseService: HorseListService,
    public dialogRef: MatDialog
  ) {}

  ngOnInit() {
    this.formData = {
      horseName: '',
      horseNumber: '',
      ageVerified: false,
      dob: '',
      color: '',
      ushjaRegistered: false
    };
    this.addEditForm = this._fb.group({
      horse_name: ['', Validators.required],
      horse_number: [''],
      age_verified: [''],
      dob: [''],
      color: [''],
      ushja_registered: ['']
    });
    this.operation = this.data.type;
  }
  get f() {
    return this.addEditForm.controls;
  }

  onSubmit() {
    if (this.addEditForm.value.dob) {
      this.addEditForm.value.dob = moment(this.addEditForm.value.dob._d).format(
        'YYYY-MM-DD'
      );
    }
    this._horseService
      .patchHorseData(this.addEditForm.value)
      .pipe(map(res => res.data))
      .subscribe(patchData => {
        console.log(this._horseService.horseListValue);
        const listData: [] = this._horseService.horseListValue;
        listData.push(patchData);
        this._horseService.horseList$.next(listData);
      });
  }
  dialogClose(): void {
    this.dialogRef.closeAll();
  }
}
