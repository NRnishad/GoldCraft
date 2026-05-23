import React, { useEffect, useState } from 'react';
import { adminRateApi, type IRateData } from '../api/adminRateApi';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage';
import toast from 'react-hot-toast';
import './AdminPages.css';

export const AdminRatesPage: React.FC = () => {
  const [rates, setRates] = useState<IRateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: Edit Mode State ---
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    rate22KPerGram: 0,
    rate18KPerGram: 0,
    silverPerGram: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminRateApi.getRateHistory(30);
      
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
      toast.success('Live rates fetched successfully from the market!');
      setIsEditing(false); // Close edit mode if open
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.includes('429')) {
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
    
    const isCurrentlyHoliday = todayRate.isMarketHoliday;

    try {
      await adminRateApi.updateTodayRate({
        rate22KPerGram: todayRate.rate22KPerGram,
        rate18KPerGram: todayRate.rate18KPerGram,
        silverPerGram: todayRate.silverPerGram,
        isMarketHoliday: !isCurrentlyHoliday 
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

  // --- NEW: Handle Edit Submission ---
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rates || rates.length === 0) return;
    
    try {
      setIsSubmitting(true);
      await adminRateApi.updateTodayRate({
        rate22KPerGram: editForm.rate22KPerGram,
        rate18KPerGram: editForm.rate18KPerGram,
        silverPerGram: editForm.silverPerGram,
        isMarketHoliday: rates[0].isMarketHoliday // Preserve current holiday status
      });
      await fetchHistory();
      toast.success("Today's rates updated successfully (Admin Override)!");
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
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
              <p className={todayRate.source === 'admin' ? "warning-text" : "success-text"}>
                {todayRate.source === 'admin' ? '⚠️ Admin Overridden' : '✓ Auto-fetched'}
              </p>
            </div>
            <div className="action-buttons">
              {/* --- NEW: Toggle Edit Mode --- */}
              <button 
                className="btn-outline"
                onClick={() => {
                  if (!isEditing) {
                    setEditForm({
                      rate22KPerGram: todayRate.rate22KPerGram,
                      rate18KPerGram: todayRate.rate18KPerGram,
                      silverPerGram: todayRate.silverPerGram,
                    });
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel Edit' : "Edit today's rates"}
              </button>
              
              <button 
                className={todayRate.isMarketHoliday ? "btn-outline" : "btn-danger-outline"} 
                onClick={handleToggleHoliday}
                disabled={isEditing} // Prevent holiday toggle while editing
              >
                {todayRate.isMarketHoliday ? 'Undo market holiday' : 'Mark market holiday'}
              </button>
            </div>
          </div>
          
          {/* --- NEW: Conditionally render Form or Grid --- */}
          {isEditing ? (
            <form onSubmit={handleEditSubmit} style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '15px', color: '#334155' }}>Override Market Rates (Per Gram)</h4>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>22K GOLD / 1G (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.rate22KPerGram || ''} 
                    onChange={e => setEditForm({...editForm, rate22KPerGram: Number(e.target.value)})} 
                    required 
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>18K GOLD / 1G (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.rate18KPerGram || ''} 
                    onChange={e => setEditForm({...editForm, rate18KPerGram: Number(e.target.value)})} 
                    required 
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>SILVER / 1G (₹)</label>
                  <input 
                    type="number" 
                    value={editForm.silverPerGram || ''} 
                    onChange={e => setEditForm({...editForm, silverPerGram: Number(e.target.value)})} 
                    required 
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Admin Override'}
              </button>
            </form>
          ) : (
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
          )}
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