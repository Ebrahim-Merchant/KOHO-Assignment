import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UtilsService {
  static isSameDay(dateOne: Date, dateTwo: Date) {
    return (
      dateOne.getUTCDate() === dateTwo.getUTCDate() &&
      dateOne.getUTCMonth() === dateTwo.getUTCMonth() &&
      dateOne.getUTCFullYear() === dateTwo.getUTCFullYear()
    );
  }

  static getISOWeekNumber(date: Date) {
    const dateCopy = new Date(date.valueOf());

    // ISO week date weeks start on Monday
    // so correct the day number
    const dayNumber = (date.getUTCDay() + 6) % 7;

    // Set the target to the Thursday of this week so the
    // target date is in the right year
    dateCopy.setDate(dateCopy.getUTCDate() - dayNumber + 3);

    // ISO 8601 states that week 1 is the week
    // with January 4th in it
    const janFourth = new Date(dateCopy.getUTCFullYear(), 0, 4);

    // Number of days between target date and January 4th
    // 1000 ms/sec * 60 sec/min * 60 min/hour * 24 hour/day = 86400000 ms/day
    const dayDiff = (dateCopy.valueOf() - janFourth.valueOf()) / 86400000;

    // Calculate week number: Week 1 (January 4th) plus the
    // number of weeks between target date and January 4th
    const weekNumber = 1 + Math.ceil(dayDiff / 7);

    return weekNumber;
  }
}
