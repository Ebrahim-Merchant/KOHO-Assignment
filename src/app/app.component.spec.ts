import { DataService } from './../core/services/data/data.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { transactionInfoTestData } from 'src/test/data/transaction-info';
import * as FileSaver from 'file-saver';

describe('AppComponent', () => {
  let dataService: jasmine.SpyObj<DataService>;
  let component: AppComponent;

  beforeEach(async () => {
    dataService = jasmine.createSpyObj('DataService', ['getInputData']);
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: DataService, useValue: dataService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should validate inputValues', fakeAsync(() => {
    const transactionInfo = transactionInfoTestData;
    dataService.getInputData.and.returnValue(of([transactionInfo]));
    component.ngOnInit();
    component.validatedTransaction$?.subscribe((validatedTrans) => {
      expect(validatedTrans).toEqual([{
        id: transactionInfo.transactionId,
        customer_id: transactionInfo.customerId,
        accepted: true
      }]);
    });
    tick(100);
  }));

  it('should download call saveAs with the right value', () => {
    const transactionInfo = transactionInfoTestData;
    const saveAsSpy = spyOn(FileSaver, 'saveAs');
    component.downloadFile([{
      id: transactionInfo.transactionId,
      customer_id: transactionInfo.customerId,
      accepted: true
    }]);

    expect(saveAsSpy).toHaveBeenCalled();
  });
});
