
export default function Footer() {
  const year = new Date().getFullYear();

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    // TODO: navigate to /privacy or open a modal
    alert("Privacy Policy coming soon!");
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    // TODO: navigate to /terms or open a modal
    alert("Terms & Conditions coming soon!");
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>© {year} Agentic Helpdesk • Built with ❤️ for seamless support</p>

        <div className="footer-links">
          {/* Contact via email */}
          <a href="mailto:support@agentic-helpdesk.exampleContact"></a>

          {/* Privacy & Terms (placeholder handlers) */}
          <a href="#" >Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
