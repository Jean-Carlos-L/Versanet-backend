import dayjs from "dayjs";
dayjs.locale("es-ES");

export class DateUtils {
  /**
   * Get current date and time
   * @returns {Date} Current date object
   */
  static getCurrentDate() {
    return dayjs().toDate();
  }

  /**
   * Format date according to specified format
   * @param {Date|string} date - Date to format
   * @param {string} format - Format pattern (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY', 'DD-MM-YYYY HH:mm:ss')
   * @returns {string} Formatted date string
   */
  static formatDate(date, format = "YYYY-MM-DD") {
    return dayjs(date).format(format);
  }

  /**
   * Get start of month for given date or current month
   * @param {Date|string} date - Optional date, defaults to current date
   * @returns {Date} Start of month date object
   */
  static getStartOfMonth(date = null) {
    const targetDate = date ? dayjs(date) : dayjs();
    return targetDate.startOf("month").toDate();
  }

  /**
   * Get start of year for given date or current year
   * @param {Date|string} date - Optional date, defaults to current date
   * @returns {Date} Start of year date object
   */
  static getStartOfYear(date = null) {
    const targetDate = date ? dayjs(date) : dayjs();
    return targetDate.startOf("year").toDate();
  }

  /**
   * Get end of month for given date or current month
   * @param {Date|string} date - Optional date, defaults to current date
   * @returns {Date} End of month date object
   */
  static getEndOfMonth(date = null) {
    const targetDate = date ? dayjs(date) : dayjs();
    return targetDate.endOf("month").toDate();
  }

  /**
   * Get end of year for given date or current year
   * @param {Date|string} date - Optional date, defaults to current date
   * @returns {Date} End of year date object
   */
  static getEndOfYear(date = null) {
    const targetDate = date ? dayjs(date) : dayjs();
    return targetDate.endOf("year").toDate();
  }

  /**
   * Get current date formatted as string
   * @param {string} format - Format pattern, defaults to 'YYYY-MM-DD'
   * @returns {string} Current date formatted as string
   */
  static getCurrentDateFormatted(format = "YYYY-MM-DD") {
    return dayjs().format(format);
  }

  /**
   * Check if date is valid
   * @param {Date|string} date - Date to validate
   * @returns {boolean} True if date is valid
   */
  static isValidDate(date) {
    return dayjs(date).isValid();
  }

  /**
   * Add time to date
   * @param {Date|string} date - Base date
   * @param {number} amount - Amount to add
   * @param {string} unit - Unit (days, months, years, hours, minutes)
   * @returns {Date} New date with added time
   */
  static addTime(date, amount, unit = "days") {
    return dayjs(date).add(amount, unit).toDate();
  }

  /**
   * Subtract time from date
   * @param {Date|string} date - Base date
   * @param {number} amount - Amount to subtract
   * @param {string} unit - Unit (days, months, years, hours, minutes)
   * @returns {Date} New date with subtracted time
   */
  static subtractTime(date, amount, unit = "days") {
    return dayjs(date).subtract(amount, unit).toDate();
  }

  // DAYS METHODS
  /**
   * Get future date by adding specified number of days
   * @param {number} days - Number of days to add
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Future date
   */
  static getDaysFromNow(days, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.add(days, "days").toDate();
  }

  /**
   * Get past date by subtracting specified number of days
   * @param {number} days - Number of days to subtract
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Past date
   */
  static getDaysAgo(days, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.subtract(days, "days").toDate();
  }

  // MONTHS METHODS
  /**
   * Get future date by adding specified number of months
   * @param {number} months - Number of months to add
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Future date
   */
  static getMonthsFromNow(months, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.add(months, "months").toDate();
  }

  /**
   * Get past date by subtracting specified number of months
   * @param {number} months - Number of months to subtract
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Past date
   */
  static getMonthsAgo(months, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.subtract(months, "months").toDate();
  }

  // YEARS METHODS
  /**
   * Get future date by adding specified number of years
   * @param {number} years - Number of years to add
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Future date
   */
  static getYearsFromNow(years, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.add(years, "years").toDate();
  }

  /**
   * Get past date by subtracting specified number of years
   * @param {number} years - Number of years to subtract
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Past date
   */
  static getYearsAgo(years, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.subtract(years, "years").toDate();
  }

  // GENERIC TIME CALCULATION METHODS
  /**
   * Get future date by adding specified time
   * @param {number} amount - Amount to add
   * @param {string} unit - Unit: 'days', 'months', 'years', 'hours', 'minutes'
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Future date
   */
  static getTimeFromNow(amount, unit, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.add(amount, unit).toDate();
  }

  /**
   * Get past date by subtracting specified time
   * @param {number} amount - Amount to subtract
   * @param {string} unit - Unit: 'days', 'months', 'years', 'hours', 'minutes'
   * @param {Date|string} fromDate - Base date, defaults to current date
   * @returns {Date} Past date
   */
  static getTimeAgo(amount, unit, fromDate = null) {
    const baseDate = fromDate ? dayjs(fromDate) : dayjs();
    return baseDate.subtract(amount, unit).toDate();
  }
}
