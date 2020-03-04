import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorseListService {
  public horseList$ = new BehaviorSubject(null);
  constructor(private _http: HttpClient, private _config: Constants) {}

  getHorseList() {
    return this._http.get(`${this._config.BASE_URL}/horses`);
  }

  //  PATCH method is not supported for this route. Supported methods: GET, HEAD, POST.
  putHorseData(data) {
    return this._http.post(`${this._config.BASE_URL}/horses`, data);
  }

  getHorseData(id) {
    return this._http.get(`${this._config.BASE_URL}/horses/${id}`);
  }

  //  PATCH method is not supported for this route. Supported methods: GET, HEAD, POST.
  updateHorseData(data) {
    return this._http.post(`${this._config.BASE_URL}/horses`, data);
  }

  public get horseListValue() {
    return this.horseList$.value;
  }
}
