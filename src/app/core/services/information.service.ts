import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InformationService {
  public $information = new Subject<string>();

  constructor() {}
}
