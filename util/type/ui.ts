export interface PaginationData {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ValidationRule {
  id: string;
  label: string;
  test: (value: string, confirmValue?: string) => boolean;
}

export type DateFormat =
  | "hhmm"
  | "hhmmss"
  | "hhmmssSSS"
  | "yyyymmdd"
  | "yyyy-mm-dd"
  | "yyyymmddhhmm"
  | "yyyymmddhhmmss"
  | "yyyymmddhhmmssSSS"
  | "dd/MM"
  | "yyyy_mm_dd"
  | "dd_MM";
