import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { OptionContract, OptionsStrategy } from '../types';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Tooltip,Legend);

interface OptionsStrategyGraphProps {
  strategy: OptionsStrategy;
}

function calculateProfitOrLoss(price: number, contract: OptionContract): number {
  const { type, strike, premium, quantity } = contract;
  if (type === 'call') {
    return quantity * ((price > strike ? price - strike : 0) - premium);
  } else {
    return quantity * ((price < strike ? strike - price : 0) - premium);
  }
}

function calculateTotalProfitOrLoss(price: number, contracts: OptionContract[]): number {
  return contracts.reduce((total, contract) => total + calculateProfitOrLoss(price, contract), 0);
}

function getPriceRange(contracts: OptionContract[]): [number, number] {
  const strikes = contracts.map(contract => contract.strike);
  const minPrice = Math.min(...strikes) * 0.5;
  const maxPrice = Math.max(...strikes) * 1.5;
  return [minPrice, maxPrice];
}

function findExtremesAndBreakevens(contracts: OptionContract[], minPrice: number, maxPrice: number): [number, number, number[]] {
  let maxProfit = -Infinity, maxLoss = Infinity;
  const breakevens: number[] = [];
  for (let price = minPrice; price <= maxPrice; price += 0.1) {
    const profitOrLoss = calculateTotalProfitOrLoss(price, contracts);
    maxProfit = Math.max(maxProfit, profitOrLoss);
    maxLoss = Math.min(maxLoss, profitOrLoss);
    if (Math.abs(profitOrLoss) < 0.1) {
      breakevens.push(price);
    }
  }
  return [maxProfit, maxLoss, breakevens];
}

const OptionsStrategyGraph = ({ strategy }: OptionsStrategyGraphProps) => {
  const { contracts } = strategy;
  const [minPrice, maxPrice] = getPriceRange(contracts);
  const labels = [];
  const data = [];

  for (let price = minPrice; price <= maxPrice; price += 1) {
    labels.push(price.toFixed(2));
    data.push(calculateTotalProfitOrLoss(price, contracts));
  }

  const [maxProfit, maxLoss, breakevens] = findExtremesAndBreakevens(contracts, minPrice, maxPrice);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Profit/Loss',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  return (
    <div className="mt-5 p-5 bg-white rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Risk & Reward Graph</h2>
      <Line data={chartData} options={options} />
      <p>Max Profit: {maxProfit}</p>
      <p>Max Loss: {maxLoss}</p>
      <p>Break Even Points: {breakevens.join(', ')}</p>
    </div>
  );
};

export default OptionsStrategyGraph;
