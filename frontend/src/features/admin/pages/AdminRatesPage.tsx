import React, { useEffect, useState } from 'react';
import { adminRateApi, type IRateData } from '../api/adminRateApi';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage';
import toast from 'react-hot-toast'; // [NEW] Imported toast
import './AdminPages.css';

export const AdminRatesPage: React.FC = () => {
  const [rates, setRates] = useState<IRateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminRateApi.getRateHistory(30);
      
      // [FIX] Defensively sort dates descending (newest first) 
      // so rates[0] is guaranteed to be the most recent rate.
      const sortedData = (data || []).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setRates(sortedData);
    } catch (err) {
      setError(getErrorMessage(err));
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerLiveFetch = async () => {
    try {
      setIsFetchingLive(true);
      await adminRateApi.triggerManualFetch();
      await fetchHistory(); 
      // [NEW] Replaced alert with toast.success
      toast.success('Live rates fetched successfully from the market!');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.includes('429')) {
        // [NEW] Replaced alert with toast.error
        toast.error('Rate limit reached (Max 3 requests per hour). Please try again later.');
      } else {
        toast.error(`Fetch Failed: ${errorMessage}`);
      }
    } finally {
      setIsFetchingLive(false);
    }
  };

 const handleToggleHoliday = async () => {
    if (!rates || rates.length === 0) return; 
    const todayRate = rates[0];
    
    // Check what the current status is
    const isCurrentlyHoliday = todayRate.isMarketHoliday;

    try {
      await adminRateApi.updateTodayRate({
        rate22KPerGram: todayRate.rate22KPerGram,
        rate18KPerGram: todayRate.rate18KPerGram,
        silverPerGram: todayRate.silverPerGram,
        isMarketHoliday: !isCurrentlyHoliday // Send the OPPOSITE to the backend
      });
      await fetchHistory(); 
      toast.success(
        isCurrentlyHoliday 
          ? 'Holiday removed. Market is back open.' 
          : 'Market marked as holiday successfully.'
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <div>Loading rates...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const todayRate = (rates && rates.length > 0) ? rates[0] : null;

  return (
    <div className="admin-page-container">
      <header className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2>Gold rates</h2>
          <button 
            className="btn-primary" 
            onClick={handleTriggerLiveFetch}
            disabled={isFetchingLive}
          >
            {isFetchingLive ? 'Fetching...' : 'Trigger Fetch'}
          </button>
        </div>
        
        <div className="tags-container">
          
        </div>
      </header>

      {todayRate && (
        <section className="today-card">
          <div className="card-header">
            <div>
              <h3>TODAY'S GOLD RATE – {new Date(todayRate.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</h3>
              <p className="success-text">Auto-fetched</p>
            </div>
            <div className="action-buttons">
              <button className="btn-outline">Edit today's rates</button>
              
              <button 
                className={todayRate.isMarketHoliday ? "btn-outline" : "btn-danger-outline"} 
                onClick={handleToggleHoliday}
              >
                {todayRate.isMarketHoliday ? 'Undo market holiday' : 'Mark market holiday'}
              </button>
            </div>
          </div>
          
          <div className="rates-grid">
             <div className="rate-box">
               <label>22K / 1G</label>
               <p>₹{todayRate.rate22KPerGram.toLocaleString()}</p>
             </div>
             <div className="rate-box">
               <label>22K / 8G</label>
               <p>₹{todayRate.rate22KPer8Gram.toLocaleString()}</p>
             </div>
             <div className="rate-box">
               <label>18K / 1G</label>
               <p>₹{todayRate.rate18KPerGram.toLocaleString()}</p>
             </div>
             <div className="rate-box">
               <label>18K / 8G</label>
               <p>₹{todayRate.rate18KPer8Gram.toLocaleString()}</p>
             </div>
             <div className="rate-box">
               <label>SILVER / 1G</label>
               <p>₹{todayRate.silverPerGram.toLocaleString()}</p>
             </div>
             <div className="rate-box">
               <label>SILVER / 8G</label>
               <p>₹{todayRate.silverPer8Gram.toLocaleString()}</p>
             </div>
          </div>
        </section>
      )}

      <section className="table-section">
        <div className="table-header">
           <h3>Rate History</h3>
           <span>Showing last 30 days</span>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>22K / 1G</th>
                <th>22K / 8G</th>
                <th>18K / 1G</th>
                <th>18K / 8G</th>
                <th>SILVER (1G)</th>
                <th>SOURCE</th>
                <th>HOLIDAY</th>
              </tr>
            </thead>
            <tbody>
              {(rates || []).map((rate) => (
                <tr key={rate.date} className={rate.isMarketHoliday ? 'holiday-row' : ''}>
                  <td>{new Date(rate.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>₹{rate.rate22KPerGram.toLocaleString()}</td>
                  <td>₹{rate.rate22KPer8Gram.toLocaleString()}</td>
                  <td>₹{rate.rate18KPerGram.toLocaleString()}</td>
                  <td>₹{rate.rate18KPer8Gram.toLocaleString()}</td>
                  <td>₹{rate.silverPerGram.toLocaleString()}</td>
                  <td>
                    <span className={rate.source === 'admin' ? 'badge-warning' : 'badge-success'}>
                      {rate.source.toUpperCase()}
                    </span>
                  </td>
                  <td>{rate.isMarketHoliday ? '📅 HOLIDAY' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};