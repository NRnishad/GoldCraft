import React, { useEffect, useState } from 'react';
import { shopRateApi, type IShopEffectiveRate } from '../api/shopRateApi';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage';
import toast from 'react-hot-toast'; // Import Toast
import './ShopPages.css';

export const ShopRatesDashboard: React.FC = () => {
  const [rate, setRate] = useState<IShopEffectiveRate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOverriding, setIsOverriding] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // NEW: Track exact error
  
  const [override22k, setOverride22k] = useState<string>('');
  const [override18k, setOverride18k] = useState<string>('');
  const [overrideSilver, setOverrideSilver] = useState<string>('');

  useEffect(() => {
    fetchTodayRate();
  }, []);

  const fetchTodayRate = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const currentRate = await shopRateApi.getTodayRate();
      setRate(currentRate);
      setOverride22k(currentRate.rate22KPerGram.toString());
      setOverride18k(currentRate.rate18KPerGram.toString());
      setOverrideSilver(currentRate.silverPerGram.toString());
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrorMsg(msg); // Save error to show on screen
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsOverriding(true);
      await shopRateApi.updateRateOverride({
        rate22KPerGram: Number(override22k),
        rate18KPerGram: Number(override18k),
        silverPerGram: Number(overrideSilver),
      });
      await fetchTodayRate(); 
      toast.success('Shop Override Applied Successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsOverriding(false);
    }
  };

  if (loading) return <div>Loading your shop's daily rate...</div>;
  
  // NEW: Display the EXACT error text from the backend
  if (errorMsg) return <div className="alert-warning">Error: {errorMsg}</div>;
  
  if (!rate) return <div>Rate not available yet.</div>;

  return (

    <div className="dashboard-container">
      <h2>Your Active Rates for Today</h2>
      
      {rate.isOverridden && (
        <div className="alert-warning">
          ⚠️ You are currently using custom Shop Override rates, not the Global Market rates.
        </div>
      )}

      <div className="rate-display-grid">
         <div className="rate-box-primary">
           <h3>22K Gold (1g)</h3>
           <h2>₹{rate.rate22KPerGram.toLocaleString()}</h2>
           <p className="subtext">₹{rate.rate22KPer8Gram.toLocaleString()} per 8g</p>
         </div>
         <div className="rate-box-secondary">
           <h3>18K Gold (1g)</h3>
           <h2>₹{rate.rate18KPerGram.toLocaleString()}</h2>
           <p className="subtext">₹{rate.rate18KPer8Gram.toLocaleString()} per 8g</p>
         </div>
         <div className="rate-box-secondary">
           <h3>Silver (1g)</h3>
           <h2>₹{rate.silverPerGram.toLocaleString()}</h2>
         </div>
      </div>

      <div className="override-section">
        <h3>Adjust Shop Rates (Override)</h3>
        <p>Set a custom rate for your shop today. This will override the global market rate.</p>
        
        <form onSubmit={handleApplyOverride} className="override-form">
          <div className="form-group">
            <label>22K Gold per Gram (₹)</label>
            <input 
              type="number" 
              value={override22k} 
              onChange={(e) => setOverride22k(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>18K Gold per Gram (₹)</label>
            <input 
              type="number" 
              value={override18k} 
              onChange={(e) => setOverride18k(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Silver per Gram (₹)</label>
            <input 
              type="number" 
              value={overrideSilver} 
              onChange={(e) => setOverrideSilver(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" disabled={isOverriding} className="btn-primary-rate">
            {isOverriding ? 'Applying...' : 'Apply Shop Override'}
          </button>
        </form>
      </div>
    </div>
  );
};