import { DateFormat } from "@/util/type/ui";

export interface TimeFormatResult {
  text: string;
  value: string;
}

export interface DateCompareOptions {
  includeDay?: boolean;
  timezone?: string;
}

export class DateUtils {
  private static readonly DATE_REGEX_MAP = new Map<DateFormat, RegExp>([
    ["hhmm", /^([0-1]\d|2[0-3])([0-5]\d)$/],
    ["hhmmss", /^([0-1]\d|2[0-3])([0-5]\d)([0-5]\d)$/],
    ["hhmmssSSS", /^([0-1]\d|2[0-3])([0-5]\d)([0-5]\d)(\d{3})$/],
    ["yyyymmdd", /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/],
    ["yyyy-mm-dd", /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/],
    [
      "yyyymmddhhmm",
      /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-1]\d|2[0-3])([0-5]\d)$/,
    ],
    [
      "yyyymmddhhmmss",
      /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-1]\d|2[0-3])([0-5]\d)([0-5]\d)$/,
    ],
    [
      "yyyymmddhhmmssSSS",
      /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([0-1]\d|2[0-3])([0-5]\d)([0-5]\d)(\d{3})$/,
    ],
    ["dd/MM", /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])$/],
    ["dd_MM", /^(0[1-9]|[12]\d|3[01])_(0[1-9]|1[0-2])$/],
    ["yyyy_mm_dd", /^(19|20)\d{2}_(0[1-9]|1[0-2])_(0[1-9]|[12]\d|3[01])$/],
  ]);

  /**
   * 오늘 기준으로 과거 날짜를 문자열로 반환
   */
  public static getDateFromTodayAsString(
    value: number,
    type: "weeks" | "months",
    timezone?: string
  ): string {
    const date = new Date();

    if (type === "weeks") {
      date.setDate(date.getDate() - 7 * value);
    } else {
      date.setMonth(date.getMonth() - value);
    }

    return this.formatDate(date, "yyyy-mm-dd", timezone);
  }

  /**
   * 오늘 기준으로 미래 날짜를 문자열로 반환
   */
  public static getNextDateFromTodayAsString(
    value: number,
    type: "weeks" | "months",
    timezone?: string
  ): string {
    const date = new Date();

    if (type === "weeks") {
      date.setDate(date.getDate() + 7 * value);
    } else {
      date.setMonth(date.getMonth() + value);
    }

    return this.formatDate(date, "yyyy-mm-dd", timezone);
  }

  /**
   * 현재 날짜를 YYYY-MM-DD 형식으로 반환
   */
  public static getCurrentDateYYYYMMDD(separator: string = "-"): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}${separator}${month}${separator}${day}`;
  }

  /**
   * 서버 형식으로 날짜 반환 (YYYYMMDD)
   */
  public static getDateAsServerFormat(date?: string | Date): string {
    const dateObj = this.parseDate(date);
    return this.formatDate(dateObj, "yyyymmdd");
  }

  /**
   * 시간 문자열을 포맷팅
   */
  public static getTimeFormat(val: string): TimeFormatResult | null {
    const cleanVal = val.replace(/\D/g, "");

    if (cleanVal.length !== 4) {
      console.warn(`Invalid time format: ${val}. Expected 4 digits.`);
      return null;
    }

    const hours = cleanVal.substring(0, 2);
    const minutes = cleanVal.substring(2, 4);

    // 시간 유효성 검사
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);

    if (hoursNum > 23 || minutesNum > 59) {
      console.warn(`Invalid time values: ${hours}:${minutes}`);
      return null;
    }

    return {
      text: `${hours}:${minutes}`,
      value: cleanVal,
    };
  }

  /**
   * 현재 날짜/시간을 반환 (Next.js 환경에서 안전)
   */
  public static getCurrentDateTime(
    type: "date" | "time" = "date",
    format: "default" | "server" = "default",
    timezone?: string
  ): string {
    const date = new Date();

    if (timezone) {
      // Intl.DateTimeFormat을 사용하여 타임존 처리
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const dateStr = `${parts.find((p) => p.type === "year")?.value}-${
        parts.find((p) => p.type === "month")?.value
      }-${parts.find((p) => p.type === "day")?.value}`;
      const timeStr = `${parts.find((p) => p.type === "hour")?.value}:${
        parts.find((p) => p.type === "minute")?.value
      }:${parts.find((p) => p.type === "second")?.value}`;

      if (type === "time") {
        return format === "server" ? timeStr.replace(/:/g, "") : timeStr;
      }
      return format === "server" ? dateStr.replace(/-/g, "") : dateStr;
    }

    return this.formatDate(
      date,
      type === "time" ? "hhmmss" : "yyyy-mm-dd",
      undefined,
      format
    );
  }

  /**
   * 날짜 문자열을 표준 형식으로 변환
   */
  public static getDateAsString(
    str: string,
    includeTime: boolean = false,
    includeSeconds: boolean = false
  ): string {
    const format = this.getDateFormat(str);
    if (!format) {
      throw new Error(`Invalid date format: ${str}`);
    }

    const regex = this.DATE_REGEX_MAP.get(format);
    if (!regex) {
      throw new Error(`No regex found for format: ${format}`);
    }

    let result = str.replace(regex, "$1-$2-$3");

    if (includeTime) {
      const timeStr = this.getTimeAsString(str, includeSeconds);
      if (timeStr) {
        result += `T${timeStr}`;
      }
    }

    return result;
  }

  /**
   * 시간 문자열을 표준 형식으로 변환
   */
  public static getTimeAsString(
    str: string,
    includeSeconds: boolean = false
  ): string {
    const format = this.getDateFormat(str);
    if (!format) {
      throw new Error(`Invalid date format: ${str}`);
    }

    const regex = this.DATE_REGEX_MAP.get(format);
    if (!regex) {
      return "";
    }

    const patterns: Record<DateFormat, string> = {
      hhmm: `$1:$2${includeSeconds ? ":00" : ""}`,
      hhmmss: `$1:$2${includeSeconds ? ":$3" : ""}`,
      hhmmssSSS: `$1:$2${includeSeconds ? ":$3" : ""}`,
      yyyymmddhhmm: `$4:$5${includeSeconds ? ":00" : ""}`,
      yyyymmddhhmmss: `$4:$5${includeSeconds ? ":$6" : ""}`,
      yyyymmddhhmmssSSS: `$4:$5${includeSeconds ? ":$6" : ""}`,
      yyyymmdd: "",
      "yyyy-mm-dd": "",
      yyyy_mm_dd: "",
      dd_MM: "",
      "dd/MM": "",
    };

    return str.replace(regex, patterns[format]);
  }

  /**
   * 날짜 포맷 감지
   */
  public static getDateFormat(str: string): DateFormat | null {
    for (const [format, regex] of this.DATE_REGEX_MAP) {
      if (regex.test(str)) {
        return format;
      }
    }
    return null;
  }

  /**
   * 두 날짜 사이의 일수 계산
   */
  public static getDaysBetweenDates(
    fromDate: Date | string,
    toDate: Date | string = new Date()
  ): number {
    return Math.abs(this.compareDates(fromDate, toDate));
  }

  /**
   * 두 날짜 사이의 개월 수 계산
   */
  public static getMonthsBetweenDates(
    fromDate: Date | string = new Date(),
    toDate: Date | string = new Date(),
    options: DateCompareOptions = {}
  ): number {
    return Math.abs(this.compareDatesAsMonths(fromDate, toDate, options));
  }

  /**
   * 날짜 비교 (일 단위)
   */
  public static compareDates(
    fromDate: Date | string = new Date(),
    toDate: Date | string = new Date()
  ): number {
    const date1 = this.parseDate(fromDate);
    const date2 = this.parseDate(toDate);

    // 시간 정보 제거 (일 단위 비교)
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    const timeDiff = date2.getTime() - date1.getTime();
    return Math.round(timeDiff / (1000 * 60 * 60 * 24));
  }

  /**
   * 날짜 비교 (월 단위)
   */
  public static compareDatesAsMonths(
    fromDate: Date | string = new Date(),
    toDate: Date | string = new Date(),
    options: DateCompareOptions = {}
  ): number {
    const date1 = this.parseDate(fromDate);
    const date2 = this.parseDate(toDate);

    const yearDiff = date2.getFullYear() - date1.getFullYear();
    let monthDiff = date2.getMonth() - date1.getMonth();
    const dayDiff = date2.getDate() - date1.getDate();

    monthDiff += yearDiff * 12;

    if (options.includeDay && dayDiff < 0) {
      monthDiff -= 1;
    }

    return monthDiff;
  }

  /**
   * 날짜 문자열 유효성 검사
   */
  public static isValid(str: string, format: DateFormat): boolean {
    const regex = this.DATE_REGEX_MAP.get(format);
    return regex?.test(str) ?? false;
  }

  /**
   * 문자열을 Date 객체로 변환
   */
  public static toDate(str: string): Date {
    const format = this.getDateFormat(str);
    if (!format) {
      throw new Error(`Invalid date format: ${str}`);
    }

    const dateStr = this.getDateAsString(str);
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date: ${str}`);
    }

    return date;
  }

  /**
   * 현재 시간을 다음 정시로 반올림
   */
  public static getCurrentTimeTransaction(): string {
    const date = new Date();
    const minutes = date.getMinutes();
    let hours = date.getHours();

    if (minutes > 0) {
      hours += 1;
    }

    return String(hours).padStart(2, "0") + "00";
  }

  /**
   * 포괄적인 날짜 비교 함수
   */
  public static dateCompare(
    value: string,
    mode:
      | "compareTo"
      | "count"
      | "count before"
      | "count after"
      | "count as months"
      | "equals"
      | "before"
      | "before or equals"
      | "after"
      | "after or equals",
    compareToValue: string = this.getCurrentDateYYYYMMDD()
  ): number | boolean {
    const days = this.compareDates(compareToValue, value);

    switch (mode) {
      case "compareTo":
        return days;
      case "count":
        return Math.abs(days);
      case "count before":
        return days < 0 ? -days : 0;
      case "count after":
        return days > 0 ? days : 0;
      case "count as months":
        return this.getMonthsBetweenDates(compareToValue, value);
      case "equals":
        return days === 0;
      case "before":
        return days < 0;
      case "before or equals":
        return days <= 0;
      case "after":
        return days > 0;
      case "after or equals":
        return days >= 0;
      default:
        throw new Error(`Unknown comparison mode: ${mode}`);
    }
  }

  // Private helper methods
  private static parseDate(date?: string | Date): Date {
    if (date instanceof Date) {
      return new Date(date);
    }

    if (typeof date === "string") {
      const format = this.getDateFormat(date);
      if (format) {
        return this.toDate(date);
      }
      // ISO 문자열이나 다른 표준 형식 시도
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return new Date();
  }

  private static formatDate(
    date: Date,
    format: DateFormat | "yyyy-mm-dd" = "yyyy-mm-dd",
    timezone?: string,
    serverFormat?: "default" | "server"
  ): string {
    let targetDate = date;

    if (timezone) {
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const parts = formatter.formatToParts(date);
      const dateStr = `${parts.find((p) => p.type === "year")?.value}-${
        parts.find((p) => p.type === "month")?.value
      }-${parts.find((p) => p.type === "day")?.value}T${
        parts.find((p) => p.type === "hour")?.value
      }:${parts.find((p) => p.type === "minute")?.value}:${
        parts.find((p) => p.type === "second")?.value
      }`;
      targetDate = new Date(dateStr);
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const hours = String(targetDate.getHours()).padStart(2, "0");
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");
    const seconds = String(targetDate.getSeconds()).padStart(2, "0");

    const isServer = serverFormat === "server";
    const separator = isServer ? "" : "-";
    const timeSeparator = isServer ? "" : ":";

    switch (format) {
      case "yyyy-mm-dd":
        return `${year}${separator}${month}${separator}${day}`;
      case "yyyymmdd":
        return `${year}${month}${day}`;
      case "hhmmss":
        return `${hours}${timeSeparator}${minutes}${timeSeparator}${seconds}`;
      case "hhmm":
        return `${hours}${timeSeparator}${minutes}`;
      default:
        return `${year}${separator}${month}${separator}${day}`;
    }
  }

  /**
   * YYYYMMDD 형식을 YYYY-MM-DD로 변환
   */
  public static formatDateWithSeparator(
    date: string,
    separator: string = "-"
  ): string {
    if (date.length !== 8) {
      throw new Error(`Invalid date format: ${date}. Expected YYYYMMDD.`);
    }

    return date.replace(
      /(\d{4})(\d{2})(\d{2})/,
      `$1${separator}$2${separator}$3`
    );
  }
}
