import { useEffect, useState } from 'react';
import { fetchCurrencyRates, type CurrencyRate } from './services/api';
import './App.css';

function App() {
    const [displayRates, setDisplayRates] = useState<CurrencyRate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [amount, setAmount] = useState<string>('100');
    const [fromCurrency, setFromCurrency] = useState<string>('EUR');
    const [toCurrency, setToCurrency] = useState<string>('PLN');
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

    useEffect(() => {
        fetchCurrencyRates()
            .then((data) => {
                const plnRateInUsd = data.find(r => r.currencyCode === 'PLN')?.rate || 1;

                const plnBasedRates = data.map(item => ({
                    ...item,
                    rate: item.rate / plnRateInUsd
                }));

                const sortedRates = plnBasedRates.sort((a, b) => {
                    if (a.currencyCode === 'PLN') return -1;
                    if (b.currencyCode === 'PLN') return 1;
                    return a.currencyCode.localeCompare(b.currencyCode);
                });

                setDisplayRates(sortedRates);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Connecting to Java server failed...');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0 || displayRates.length === 0) {
            setConvertedAmount(null);
            return;
        }

        const fromRateObj = displayRates.find(r => r.currencyCode === fromCurrency);
        const toRateObj = displayRates.find(r => r.currencyCode === toCurrency);

        if (fromRateObj && toRateObj) {
            const amountInBase = numericAmount / fromRateObj.rate;
            const finalAmount = amountInBase * toRateObj.rate;
            setConvertedAmount(finalAmount);
        }
    }, [amount, fromCurrency, toCurrency, displayRates]);

    if (loading) return <div className="container"><p style={{ textAlign: 'center' }}>Connecting to Java server...</p></div>;
    if (error) return <div className="container" style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="container">
            <header className="header">
                <h1>Currency Exchange Hub</h1>
            </header>

            <div className="main-layout">
                <div className="card">
                    <h2>Convert Currency</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>Amount</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="any"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>From</label>
                                <select
                                    value={fromCurrency}
                                    onChange={(e) => setFromCurrency(e.target.value)}
                                >
                                    {displayRates.map((item) => (
                                        <option key={item.currencyCode} value={item.currencyCode}>
                                            {item.currencyCode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>To</label>
                                <select
                                    value={toCurrency}
                                    onChange={(e) => setToCurrency(e.target.value)}
                                >
                                    {displayRates.map((item) => (
                                        <option key={item.currencyCode} value={item.currencyCode}>
                                            {item.currencyCode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </form>

                    {convertedAmount !== null && (
                        <div className="result-box">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                CONVERSION RESULT
              </span>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                                {Number(amount).toFixed(2)} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Rates normalized to PLN reference base
              </span>
                        </div>
                    )}
                </div>

                <div className="card">
                    <h2>Exchange Rates Dashboard</h2>
                    <div className="table-responsive">
                        <table className="exchange-table">
                            <thead>
                            <tr>
                                <th>Currency</th>
                                <th>Rate (Relative to PLN)</th>
                                <th>Last Updated Cache</th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayRates.map((item) => (
                                <tr key={item.currencyCode}>
                                    <td><span className="badge-id">{item.currencyCode}</span></td>
                                    <td><strong>{item.rate.toFixed(4)}</strong></td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(item.lastUpdated).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;