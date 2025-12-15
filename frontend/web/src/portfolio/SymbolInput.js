export default function SymbolInput({ symbols, setSymbols }) {
  return (
    <div className="input-group">
      <label>Stock Symbols</label>
      <input
        type="text"
        placeholder="RELIANCE, TCS, INFY"
        value={symbols}
        onChange={(e) => setSymbols(e.target.value)}
      />
    </div>
  );
}
