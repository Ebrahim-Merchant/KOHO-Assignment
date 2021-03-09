import { UtilsService } from './util.service';
describe('UtilsService', () => {

  describe('#isSameDay', () => {

    it('should return true if it same day', () => {
      const isSameDay = UtilsService.isSameDay(
        new Date('2000-01-01T01:01:22Z'),
        new Date('2000-01-01T02:02:44Z')
      );

      expect(isSameDay).toBeTrue();
    });

  })

  describe('#isSameWeek', () => {

    it('should return true if it same week', () => {
      const resp = UtilsService.isSameWeek(
        new Date('2000-01-03T00:00:00Z'),
        new Date('2000-01-09T23:59:59Z')
      );

      expect(resp).toBeTrue();
    });

  })


})
