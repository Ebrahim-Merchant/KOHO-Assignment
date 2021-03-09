import { InputDTO } from '../../models/input-dto';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ILoadTransaction } from '../../models/transaction-info';
import { inputData } from './input.data';

@Injectable({ providedIn: 'root' })
export class DataService {

  getInputData(): Observable<ILoadTransaction[]> {
    return of(inputData).pipe(
      map((inputDataList) => this.mapInputToLoadInfo(inputDataList)),
    )
  }

  mapInputToLoadInfo(inputDataList: InputDTO[]): ILoadTransaction[] {
    return inputDataList.map((inputItem) => {
      const currency = inputItem.load_amount.replace(/[^0-9\.-]+/g, "")
      return {
          customerId: inputItem.customer_id,
          transactionId: inputItem.id,
          amount: !isNaN(parseFloat(currency)) ? parseFloat(currency) : 0,
          lastAdded: new Date(inputItem.time)
      }
    })
    // .filter((item) => item.customerId === '137')
  }
}
