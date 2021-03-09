import { OutputDTO } from './../core/models/output-dto';
import { DataService } from '../core/services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { ValidatorsService } from 'src/core/services/validators/validators.service';
import { map, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * keys for the table heading
   *
   * @type {string[]}
   * @memberof AppComponent
   */
  keys: string[] = [];

  /**
   * Observable of Ouput results
   *
   * @type {Observable<OutputDTO[]>}
   * @memberof AppComponent
   */
  validatedTransaction$?: Observable<OutputDTO[]>;

  /**
   *Creates an instance of AppComponent.
   * @param {DataService} dataService
   * @param {ValidatorsService} validationService
   * @memberof AppComponent
   */
  constructor(
    public dataService: DataService,
    public validationService: ValidatorsService
  ) { }

  /**
   * On init hook
   *
   * @memberof AppComponent
   */
  ngOnInit() {
    this.validatedTransaction$ = this.dataService.getInputData().pipe(
      map((attemptedTransactionList) => this.validationService.validateTransactionList(attemptedTransactionList)),
      tap((resp) => this.keys = resp[0] ? Object.keys(resp[0]) : [])
    );
  }

  /**
   * Downloads the data as text
   *
   * @param {OutputDTO[]} data
   * @memberof AppComponent
   */
  downloadFile(data: OutputDTO[]) {
    const jsonData = data.map((dataItem) => JSON.stringify(dataItem) + '\n');
    const blob = new Blob(jsonData, { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'output.txt');
  }
}
