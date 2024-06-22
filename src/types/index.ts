export interface OptionContract {
  type: 'call' | 'put';
  strike: number;
  premium: number;
  quantity: number;
}

export interface OptionsStrategy {
  contracts: OptionContract[];
}
