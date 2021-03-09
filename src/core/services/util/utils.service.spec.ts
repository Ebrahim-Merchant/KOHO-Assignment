import { UtilsService } from './util.service';

describe('UtilsService', () => {
  describe('#isSameDay', () => {
    it('should return true as it is same day', () => {
      const isSameDay = UtilsService.isSameDay(
        new Date('2000-01-01T01:01:22Z'),
        new Date('2000-01-01T02:02:44Z')
      );

      expect(isSameDay).toBeTrue();
    });

    it('should return false as it not same same day', () => {
      const isSameDay = UtilsService.isSameDay(
        new Date('2000-01-01T01:01:22Z'),
        new Date('2020-01-05T02:02:44Z')
      );

      expect(isSameDay).toBeFalse();
    });
  });

  describe('#getISOWeekNumber', () => {
    it('should return iso week of one of the year', () => {
      const isoNumber = UtilsService.getISOWeekNumber(
        new Date('1999-01-02T08:01:22Z')
      );
      expect(isoNumber).toEqual(53);
    });

    it('should return iso week of 53 as the date is still in last year according to ISO', () => {
      const isoNumber = UtilsService.getISOWeekNumber(
        new Date('1999-01-02T08:01:22Z')
      );
      expect(isoNumber).toEqual(53);
    });
  });

  describe('#getFirstMondayOfYear', () => {
    it('should get firstMonday of the last 20 years', () => {
      const result = Array(20)
        .fill(null)
        .forEach((value, i) => {
          const resp = UtilsService.getFirstMondayOfYear(200 + 1 + i);
          expect(resp.getUTCDay()).toEqual(1);
        });
    });
  });
});
