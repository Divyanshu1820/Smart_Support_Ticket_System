
export default function Home() {
  return (
    <section className="hero">
      <h1>Welcome to Agentic Helpdesk</h1>
      <p>
        A modern, AI-ready helpdesk to streamline support, automate workflows,
        and delight your users.
      </p>
     
      <div className="hero-grid">
        <div className="card">
          <h3>Ticket Automation</h3>
          <p>Reduce manual triage with agentic routing and smart suggestions.</p>
        </div>
        <div className="card">
          <h3>Multi-channel Support</h3>
          <p>Unify email, chat, and portal interactions in one place.</p>
        </div>
        <div className="card">
          <h3>Analytics</h3>
          <p>Track SLA, CSAT, and response times with real-time dashboards.</p>
        </div>
      </div>
    </section>
  );
}
