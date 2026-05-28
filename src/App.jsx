import React from "react";

export default function App() {
  return (
    <>
      <div className="container">
        <header className="header">
          <h1>Nabanjan Das</h1>
          <p>IIT Kanpur &bull; Class of 1996</p>
        </header>
        <section className="contact-section">
          <button className="cta">Call: +48572288114</button>
          <a className="whatsapp-link" href="https://wa.me/48572288114" target="_blank" rel="noopener noreferrer">
            Message on WhatsApp
          </a>
        </section>
      </div>
    </>
  );
}
