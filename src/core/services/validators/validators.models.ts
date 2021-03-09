export interface CustomerInfoMap {
  [customerId: string]: CustomerInfo;
}

export interface CustomerInfo {
  dailyTransactionAmount: number;
  weeklyTransactionAmount: number;
  dailyCount: number;
  lastTransaction: {
    date: Date;
    workWeek: number;
  };
  visitedTransaction: { [key: string]: boolean };
}
