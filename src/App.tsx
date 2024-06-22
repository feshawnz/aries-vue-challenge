import React, { useState, ChangeEvent, FormEvent } from 'react';
import { OptionContract } from './types';
import OptionsStrategyGraph from './components/OptionsStrategyGraph';
import './index.scss';

const App = () => {
  const [contracts, setContracts] = useState<OptionContract[]>([]);
  const [inputContract, setInputContract] = useState<OptionContract>({
    type: "call",
    strike: 0,
    premium: 0,
    quantity: 0
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof OptionContract) => {
    const value = field === 'type' ? e.target.value : parseFloat(e.target.value);
    setInputContract(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addContract = () => {
    if (contracts.length < 4) {
      setContracts([...contracts, { ...inputContract }]);
      setInputContract({ type: "call", strike: 0, premium: 0, quantity: 0 }); // Reset input for new entry
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addContract();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="container">
        <h1>Options Strategy Visualizer</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              value={inputContract.type}
              onChange={(e) => handleInputChange(e, 'type')}
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>
          </div>
          <div>
            <label htmlFor="strike">Strike Price:</label>
            <input
              id="strike"
              type="number"
              value={inputContract.strike}
              onChange={(e) => handleInputChange(e, 'strike')}
            />
          </div>
          <div>
            <label htmlFor="premium">Premium:</label>
            <input
              id="premium"
              type="number"
              value={inputContract.premium}
              onChange={(e) => handleInputChange(e, 'premium')}
            />
          </div>
          <div>
            <label htmlFor="quantity">Quantity (positive for long, negative for short):</label>
            <input
              id="quantity"
              type="number"
              value={inputContract.quantity}
              onChange={(e) => handleInputChange(e, 'quantity')}
            />
          </div>
          <button type="submit">Add Contract</button>
        </form>
        {contracts.length > 0 && (
          <div className="graph-container">
            <OptionsStrategyGraph strategy={{ contracts }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
