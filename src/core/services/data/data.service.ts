import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoadTransaction } from '../../models/transaction-info';
import { HttpClient } from '@angular/common/http';

export const DEFAULT_INPUT = 'assets/input.txt';

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(
    private http: HttpClient
  ) {}

  getInputData(inputPath = DEFAULT_INPUT): Observable<ILoadTransaction[]> {
    return  this.http.get(inputPath, { responseType: 'text' }).pipe(
      map((inputFile) => inputFile.split('\n')),
      map((inputDataList) => this.mapInputToLoadInfo(inputDataList)),
    );
  }

  mapInputToLoadInfo(inputDataList: string[]): ILoadTransaction[] {

    // Checks if last element is not an empty string if it is remove it from list
    if (!inputDataList[inputDataList.length - 1]) {
      inputDataList.pop();
    }

    return inputDataList.map((inputItemStr) => {
      const inputItem =  JSON.parse(inputItemStr);
      // Removes everything but numbers from currency
      const currency = inputItem.load_amount.replace(/[^0-9\.-]+/g, '');
      return {
          customerId: inputItem.customer_id,
          transactionId: inputItem.id,
          amount: !isNaN(parseFloat(currency)) ? parseFloat(currency) : 0,
          lastAdded: new Date(inputItem.time)
      };
    });
  }
}
