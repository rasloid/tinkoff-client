export enum StocksFilterTypes {
  none = 'none',
  include = 'include',
  exclude = 'exclude',
}

export interface StocksFilter {
  type: StocksFilterTypes;
  include: Array<string>;
  exclude: Array<string>;
}

export interface BotConfig {
  enabled: boolean;
  priceUpDelta: number;
  priceDownDelta: number;
  defaultLotAmount: number;
  stocksFilter: StocksFilter;
}

export interface BotLogMsg {
  date: string;
  text: string;
  label?: string;
}

export type BotLog = Array<BotLogMsg>;

export interface ActiveInstrument {
  ticker: string;
  prevStopPrice: number;
  processing: boolean;
  currPrice?: number;
  error?: any;
}

export interface BotState {
  enabled: boolean;
  activeItems: Array<ActiveInstrument>;
}
