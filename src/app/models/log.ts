export interface LogMsg {
  date: string;
  text: string;
  label?: string;
}

export type Log = Array<LogMsg>;
