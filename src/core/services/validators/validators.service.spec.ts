import { DAILY_LOAD_AMOUNT, DAILY_LOAD_COUNT, WEEKLY_LOAD_LIMIT } from './validators.constants';
import { ILoadTransaction } from './../../models/transaction-info';
import { UtilsService } from './../util/util.service';
import { inputTestData } from './../../../test/data/input';
import { HttpClient } from '@angular/common/http';
import { outputTestData } from '../../../test/data/output';
import { DataService } from '../data/data.service';
import { ValidatorsService } from './validators.service';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { fakeAsync, tick } from '@angular/core/testing';
import { CustomerInfo } from './validators.models';
import { transactionInfoTestData } from 'src/test/data/transaction-info';


describe('Validators Service', () => {
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let validationService: ValidatorsService;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
    validationService = new ValidatorsService();
  });

  describe('validateTransactionList', () => {
    it('should match the output data from KOHO', fakeAsync(() => {
      mockHttpClient.get.and.returnValue(
        of(
          inputTestData
            .map(item => JSON.stringify(item))
            .join('\n'))
      );
      const data = new DataService(mockHttpClient);

      data.getInputData()
        .pipe(take(1))
        .subscribe((inputData) => {
          const outputTest = validationService.validateTransactionList(inputData);
          expect(outputTest).toEqual(outputTestData);
        });

      tick(10000);
    }));
  });


  describe('validateTransaction', () => {
    it('should call createAccountEntry when it doesnt exists in map', () => {
      const spyOnCreateCustomerInfoEntry =
      spyOn(validationService, 'createCustomerInfoEntry').and.callThrough();

      const transactionInfo = {
        transactionId: '1',
        customerId: '3',
        amount: 44.4,
        lastAdded: new Date()
      };
      const resp = validationService.validateTransaction(transactionInfo);

      expect(spyOnCreateCustomerInfoEntry).toHaveBeenCalledWith('3');

      expect(resp).toEqual({
        id: '1',
        customer_id: '3',
        accepted: true
      });
    });

    it('should call reset account map when dates are different', () => {
      spyOn(UtilsService, 'isSameDay').and.returnValue(false);
      validationService.createCustomerInfoEntry('3');
      const custEntry = validationService.customerInfoMap['3'];

      custEntry.dailyCount = 3;
      custEntry.dailyTransactionAmount = 5000;

      const transactionInfo = transactionInfoTestData;
      const resp = validationService.validateTransaction(transactionInfo);

      expect(custEntry.dailyCount).toEqual(1);
      expect(custEntry.dailyTransactionAmount).toEqual(44.4);

      expect(resp).toEqual({
        id: '1',
        customer_id: '3',
        accepted: true
      });
    });

    it('should call reset account map when workWeeks are different', () => {
      spyOn(UtilsService, 'getISOWeekNumber').and.returnValue(2);
      validationService.createCustomerInfoEntry('3');
      const custEntry = validationService.customerInfoMap['3'];

      custEntry.lastTransaction.workWeek = 1;
      custEntry.weeklyTransactionAmount = 20000;

      const transactionInfo = transactionInfoTestData;


      const resp = validationService.validateTransaction(transactionInfo);

      expect(custEntry.weeklyTransactionAmount).toEqual(44.4);

      expect(resp).toEqual({
        id: '1',
        customer_id: '3',
        accepted: true
      });
    });
  });

  describe('checkDailyCount', () => {
    let custEntry: CustomerInfo;
    let transactionInfo: ILoadTransaction;
    beforeEach(() => {
      transactionInfo = transactionInfoTestData;
      validationService.createCustomerInfoEntry('3');
      custEntry = validationService.customerInfoMap['3'];
    });

    it('should update dailyCount', () => {
      custEntry.dailyCount = 1;
      const resp = validationService.checkDailyCount(transactionInfo);

      expect(resp).toBeTrue();
      expect(custEntry.dailyCount).toEqual(2);
    });

    it('should not update dailyCount as more than dailyCount', () => {
      custEntry.dailyCount = DAILY_LOAD_COUNT;
      const resp = validationService.checkDailyCount(transactionInfo);

      expect(resp).toBeFalse();
      expect(custEntry.dailyCount).toEqual(DAILY_LOAD_COUNT);
    });

  });


  describe('checkDailyAmount', () => {
    let custEntry: CustomerInfo;
    let transactionInfo: ILoadTransaction;
    beforeEach(() => {
      transactionInfo = transactionInfoTestData;
      validationService.createCustomerInfoEntry('3');
      custEntry = validationService.customerInfoMap['3'];
    });

    it('should update dailyTransactionAmount', () => {
      custEntry.dailyTransactionAmount = 55;
      const resp = validationService.checkDailyAmount(transactionInfo);

      expect(resp).toBeTrue();
      expect(custEntry.dailyTransactionAmount).toEqual(55 + 44.4);
    });

    it('should not update dailyTransactionAmount as more than DAILY_ALLOWED_LIMIT', () => {
      custEntry.dailyTransactionAmount = DAILY_LOAD_AMOUNT;
      const resp = validationService.checkDailyAmount(transactionInfo);

      expect(resp).toBeFalse();
      expect(custEntry.dailyTransactionAmount).toEqual(DAILY_LOAD_AMOUNT);
    });

  });



  describe('checkWeeklyAmount', () => {
    let custEntry: CustomerInfo;
    let transactionInfo: ILoadTransaction;
    beforeEach(() => {
      transactionInfo = transactionInfoTestData;
      validationService.createCustomerInfoEntry('3');
      custEntry = validationService.customerInfoMap['3'];
    });

    it('should update weeklyTransactionAmount', () => {
      custEntry.weeklyTransactionAmount = 5550;
      const resp = validationService.checkWeeklyAmount(transactionInfo);

      expect(resp).toBeTrue();
      expect(custEntry.weeklyTransactionAmount).toEqual(5550 + 44.4);
    });

    it('should not update weeklyTransactionAmount as more than WEEKLY_ALLOWED_LIMIT', () => {
      custEntry.weeklyTransactionAmount = WEEKLY_LOAD_LIMIT;
      const resp = validationService.checkWeeklyAmount(transactionInfo);

      expect(resp).toBeFalse();
      expect(custEntry.weeklyTransactionAmount).toEqual(WEEKLY_LOAD_LIMIT);
    });

  });


});
