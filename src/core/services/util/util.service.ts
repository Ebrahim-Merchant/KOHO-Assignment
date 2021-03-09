import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {

  /**
   * return the if two dates are on the same day in UTC time
   *
   * @static
   * @param {Date} dateOne
   * @param {Date} dateTwo
   * @returns
   * @memberof UtilsService
   */
  static isSameDay(dateOne: Date, dateTwo: Date) {
    return (
      dateOne.getUTCDate() === dateTwo.getUTCDate() &&
      dateOne.getUTCMonth() === dateTwo.getUTCMonth() &&
      dateOne.getUTCFullYear() === dateTwo.getUTCFullYear()
    );
  }

  /**
   * get the ISO week number by using UTC time
   *
   * @static
   * @param {Date} date
   * @returns
   * @memberof UtilsService
   */
  static getISOWeekNumber(date: Date) {
    const targetDate = new Date(date.valueOf());

    // First Monday of the year will help us calculate the number of weeks in ISO
    let firstMondayOfYear = UtilsService.getFirstMondayOfYear(
      targetDate.getUTCFullYear()
    );

    // If the value we have is before the current first monday of the year for instance
    // Jan 1 2000 is technically in the previous years last week as ISO weeks starts on Monday
    // So we need to find its distance from last years Jan to this one to get the right week
    if (date.valueOf() < firstMondayOfYear.valueOf()) {
      firstMondayOfYear = UtilsService.getFirstMondayOfYear(
        targetDate.getUTCFullYear() - 1
      );
    }

    // Get the days from first Monday of the year. There are 86400000 ms in a day as the diff is in milliseconds
    const dayDiff =
      (targetDate.valueOf() - firstMondayOfYear.valueOf()) / 86400000;

    // Convert it to week numbers
    return Math.ceil(dayDiff / 7);
  }

  /**
   * Returns the first monday of given year in terms of week
   * So technically December 29 could be the start of ISO and new year
   *
   * @static
   * @param {number} year
   * @returns
   * @memberof UtilsService
   */
  static getFirstMondayOfYear(year: number) {
    // So the fourth of Jan is always in the first week
    // for ISO so we need to find the closest Monday to it
    const firstMondayOfYear = new Date(year, 0, 4);
    const diffToClosestMonday =
      1 -
      (firstMondayOfYear.getUTCDay() === 0 ? 7 : firstMondayOfYear.getUTCDay());
    firstMondayOfYear.setDate(
      firstMondayOfYear.getUTCDate() + diffToClosestMonday
    );

    return firstMondayOfYear;
  }
}
