import { OutputDTO } from './../core/models/output-dto';
import { DataService } from '../core/services/data/data.service';
import { Component } from '@angular/core';
import { ValidatorsService } from 'src/core/services/validators/validators.service';
import { map, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  readonly Object = Object;
  keys: string[] = [];

  inputValue$ = this.dataService.getInputData().pipe(
    map((attemptedTransactionList) => this.validationService.validateTransactionList(attemptedTransactionList)),
    tap((resp) => this.keys = Object.keys(resp[0])),
  )

  constructor(
    public dataService: DataService,
    public validationService: ValidatorsService
  ) {}

  downloadFile(data: OutputDTO[]) {
   const jsonData =  data.map((dataItem) => JSON.stringify(dataItem) + '\n');
   var blob = new Blob(jsonData, {type: "text/plain;charset=utf-8"});
   saveAs(blob, "output.txt");  }
}
