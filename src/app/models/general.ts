export enum StocksFilterTypes {
  none = 'none',
  include = 'include',
  exclude = 'exclude',
}


export interface BotConfig {
  enabled: boolean;
  priceUpDelta: number;
  priceDownDelta: number;
  defaultLotAmount: number;
}

export interface StocksFilter {
  type: StocksFilterTypes;
  include: Array<string>;
  exclude: Array<string>;
}
