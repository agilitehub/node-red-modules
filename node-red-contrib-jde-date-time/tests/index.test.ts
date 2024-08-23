const jde = require('jde-date-time')

describe('JDE Date and Time Conversion', () => {
  describe('Convert JDE Date to JS Date', () => {
    it('should convert JDE Date to JS Date', () => {
      const jdeDateTime = 121001
      const jsDateTime = jde.convertJDEDateToJSDate(jdeDateTime)
      expect(jsDateTime).toEqual('Fri Jan 01 2021')
    })

    it('should convert JDE Date to JS Date', () => {
      const jdeDateTime = 120101
      const jsDateTime = jde.convertJDEDateToJSDate(jdeDateTime)
      expect(jsDateTime).toEqual('Fri Apr 10 2020')
    })
  })

  describe('Convert JS Date to JDE Date', () => {
    it('should convert JS Date to JDE Date', () => {
      const jsDate = '2024-01-01'
      const jdeDate = jde.convertJSDateToJDEDate(jsDate)
      expect(jdeDate).toEqual('124001')
    })

    it('should convert JS Date to JDE Date', () => {
      const jsDate = '2020-04-10'
      const jdeDate = jde.convertJSDateToJDEDate(jsDate)
      expect(jdeDate).toEqual('120101')
    })
  })

  describe('Convert JDE Time to JS Time', () => {
    it('should convert JDE Time to JS Time', () => {
      const jdeTime = 1200
      const jsTime = jde.convertJDETimeToJSTime(jdeTime)
      expect(jsTime).toEqual('00:12:00')
    })

    it('should convert JDE Time to JS Time', () => {
      const jdeTime = 2359
      const jsTime = jde.convertJDETimeToJSTime(jdeTime)
      expect(jsTime).toEqual('00:23:59')
    })
  })

  describe('Convert JS Time to JDE Time', () => {
    it('should convert JS Time to JDE Time', () => {
      const jsTime = '12:00'
      const jdeTime = jde.convertJSTimeToJDETime(jsTime)
      expect(jdeTime).toEqual('1200')
    })

    it('should convert JS Time to JDE Time', () => {
      const jsTime = '11:59'
      const jdeTime = jde.convertJSTimeToJDETime(jsTime)
      expect(jdeTime).toEqual('1159')
    })
  })
})
