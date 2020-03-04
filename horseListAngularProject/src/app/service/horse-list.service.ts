import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class HorseListService {
  constructor(private _http: HttpClient, private _config: Constants) {}

  getHorseList() {
    return this._http.get(`${this._config.BASE_URL}/horses`);
  }
}
