import { OutputDTO } from '../../models/output-dto';
import { UtilsService } from '../util/util.service';
import { ILoadTransaction } from '../../models/transaction-info';
import { Injectable } from '@angular/core';

export interface CustomerInfoMap {
  [customerId: string]: CustomerInfo;
}

export interface CustomerInfo {
  dailyTransactionAmount: number;
  weeklyTransactionAmount: number;
  dailyCount: number;
  lastTransaction: {
    date: Date,
    workWeek: number
  },
  visitedTransaction: { [key: string]: boolean }

}

export const DAILY_LOAD_AMOUNT = 5000;
export const DAILY_LOAD_COUNT = 3;
export const WEEKLY_LOAD_LIMIT = 20000;

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  customerInfoMap: CustomerInfoMap = {};

  /**
   * Validates the transaction list.
   * Technically should be able to handle real time if
   * we need didnt need to hide duplicated just set them to false
   *
   * @param {ILoadTransaction[]} transactionList
   * @returns {OutputDTO[]}
   * @memberof ValidatorsService
   */
  validateTransactionList(transactionList: ILoadTransaction[]): OutputDTO[] {
    return transactionList.reduce((validatedTransaction: OutputDTO[], transactionItem) => {
      const outputTransaction = this.validateTransaction(transactionItem);
      if (outputTransaction) {
        return [...validatedTransaction, outputTransaction];
      }
      return validatedTransaction;
    }, []);
  }

  /**
   *
   *
   * @param {ILoadTransaction} transactionInfo
   * @returns {(OutputDTO | false)}
   * @memberof ValidatorsService
   */
  validateTransaction(transactionInfo: ILoadTransaction): OutputDTO | false {

    //Get the user information
    let userInfo = this.customerInfoMap[transactionInfo.customerId];

    //If user doesn't exist create a entry
    if (!userInfo) {
      this.createCustomerInfoEntry(transactionInfo.customerId);
      userInfo = this.customerInfoMap[transactionInfo.customerId]
    }

    // If the transaction has already been proccessed ignore this one if not add to visitedTransaction
    if (userInfo.visitedTransaction[transactionInfo.transactionId]) {
      return false;
    } else {
      userInfo.visitedTransaction[transactionInfo.transactionId] = true;
    }

    // Validate the date and reset data if not same day
    if (!UtilsService.isSameDay(userInfo.lastTransaction.date, transactionInfo.lastAdded)) {
      userInfo.lastTransaction.date = transactionInfo.lastAdded;
      userInfo.dailyCount = 0;
      userInfo.dailyTransactionAmount = 0;
    }

    // Validate the date and reset data if not same work week
    if (userInfo.lastTransaction.workWeek !== UtilsService.getISOWeekNumber(transactionInfo.lastAdded)) {
      userInfo.lastTransaction.workWeek = UtilsService.getISOWeekNumber(transactionInfo.lastAdded);
      userInfo.weeklyTransactionAmount = 0;
    }

    return {
      id: transactionInfo.transactionId,
      customer_id: transactionInfo.customerId,
      accepted:
        this.checkDailyCount(transactionInfo) &&
        this.checkDailyAmount(transactionInfo) &&
        this.checkWeekly(transactionInfo)
    }
  }



  /**
   * Checks if user hasn't made more then the required transactions
   *
   * @param {ILoadTransaction} loadInfoTransaction
   * @returns {boolean}
   * @memberof ValidatorsService
   */
  checkDailyCount(loadInfoTransaction: ILoadTransaction): boolean {
    const userInfo = this.customerInfoMap[loadInfoTransaction.customerId];

    if (!userInfo) {
      return true;
    }

    const updateDailyCount = userInfo.dailyCount + 1;

    if (updateDailyCount <= DAILY_LOAD_COUNT) {
      userInfo.dailyCount = userInfo.dailyCount + 1
      return true;
    }
    return false;

  }


  /**
   * Checks if load transactions isn't going over daily allowed transaction
   *
   * @param {ILoadTransaction} loadInfoTransaction
   * @returns {boolean}
   * @memberof ValidatorsService
   */
  checkDailyAmount(loadInfoTransaction: ILoadTransaction): boolean {
    const userInfo = this.customerInfoMap[loadInfoTransaction.customerId];
    if (!userInfo) {
      return true;
    }

    const updateDailyTotal = userInfo.dailyTransactionAmount + loadInfoTransaction.amount;
    if (updateDailyTotal <= DAILY_LOAD_AMOUNT) {
      userInfo.dailyTransactionAmount = updateDailyTotal
      return true;
    }
    return false;
  }

  /**
   * Checks weekly transaction
   *
   * @param {ILoadTransaction} loadInfoTransaction
   * @returns {boolean}
   * @memberof ValidatorsService
   */
  checkWeekly(loadInfoTransaction: ILoadTransaction): boolean {
    const customerInfo = this.customerInfoMap[loadInfoTransaction.customerId];
    if (!customerInfo) {
      return true;
    }

    const updateWeeklyTotal = customerInfo.weeklyTransactionAmount + loadInfoTransaction.amount;

    if (updateWeeklyTotal <= WEEKLY_LOAD_LIMIT) {
      customerInfo.weeklyTransactionAmount = updateWeeklyTotal;
      return true;
    }
    return false;
  }

  /**
   * Creates a customer info in the map
   *
   * @param {string} customerId
   * @memberof ValidatorsService
   */
  createCustomerInfoEntry(customerId: string) {
    if (!this.customerInfoMap[customerId]) {
      this.customerInfoMap[customerId] = {
        dailyCount: 0,
        dailyTransactionAmount: 0,
        weeklyTransactionAmount: 0,
        lastTransaction: {
          date: new Date(),
          workWeek: 0
        },
        visitedTransaction: {}
      }
    }

  }
}
