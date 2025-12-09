import { useEffect, useState } from "react";

function App() {
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/users")    // <- GET users from backend
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        console.log("Backend /users response:", data);
        setResp(data);
      })
      .catch(e => {
        console.error("Fetch error:", e);
        setErr(String(e));
      });
  }, []);

  return (
    <div style={{padding:20}}>
      <h2>Frontend ↔ Backend Debug — Users from DB</h2>

      <div style={{marginBottom:12}}>
        <strong>Error:</strong> <span style={{color:'red'}}>{err || ''}</span>
      </div>

      <div>
        <strong>Response:</strong>
        {resp === null && !err && <div> Loading... </div>}
        {resp && Array.isArray(resp.users) && resp.users.length === 0 && <div>No users found</div>}

        {resp && Array.isArray(resp.users) && resp.users.length > 0 && (
          <table style={{borderCollapse:'collapse', marginTop:8}}>
            <thead>
              <tr>
                <th style={{border:'1px solid #ddd', padding:8}}>ID</th>
                <th style={{border:'1px solid #ddd', padding:8}}>Name</th>
              </tr>
            </thead>
            <tbody>
              {resp.users.map(user => (
                <tr key={user.id}>
                  <td style={{border:'1px solid #ddd', padding:8}}>{user.id}</td>
                  <td style={{border:'1px solid #ddd', padding:8}}>{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* fallback: show raw response if format is unexpected */}
        {resp && !Array.isArray(resp.users) && (
          <pre style={{whiteSpace:'pre-wrap', marginTop:8}}>{JSON.stringify(resp, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default App;
