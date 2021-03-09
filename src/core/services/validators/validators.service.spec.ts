import { outputTestData } from '../../../test/data/output';
import { inputTestData } from '../../../test/data/input';
import { DataService } from "../data/data.service";
import { inputData } from "../data/input.data";
import { ValidatorsService } from "./validators.service";

const output = []

fdescribe('Test', () => {
  it('should match the output', () => {
    const val = new ValidatorsService();
    const data = new DataService();
    const inputVal = data.mapInputToLoadInfo(inputData);
    const outputTest = val.validateTransactionList(inputVal);
    expect(outputTest).toEqual(outputTestData)
})

xit('should find missing info in output', () => {
  inputTestData.forEach((item, i) => {
    expect(outputTestData[i].id).toEqual(item.id);
    expect(outputTestData[i].customer_id).toEqual(item.customer_id);
  })
})
})
