import { useNavigate } from "react-router-dom";


export function DashboardPage() {
  const navigate = useNavigate();
  
  return (
    <div className="page-shell">
      <section className="dashboard">
        <div className="dashboard-header">
          <div>
           
            <h1 className="title">Dashboard</h1>
            
          </div>

          
        </div>

        
      </section>
    </div>
  );
}
