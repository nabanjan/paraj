import React from "react";

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">University of Washington • Paul G. Allen School of CSE</p>
          <h1>Ranjay Krishna</h1>
          <p className="subtitle">
            Assistant Professor | Co-director, RAIVN Lab | Director, PRIOR at the Allen Institute for AI
          </p>
          <div className="cta-row">
            <a className="btn primary" href="mailto:ranjay@cs.washington.edu">Email: ranjay@cs.washington.edu</a>
            <a className="btn secondary" href="https://wa.me/914086554917" target="_blank" rel="noreferrer">WhatsApp: +914086554917</a>
            <button className="cta">Call: +914086554917</button>
          </div>
        </div>
        <div className="hero-card">
          <h3>Office</h3>
          <p>Bill & Melinda Gates Center (Allen Center), Room 304</p>
          <p>3800 E Stevens Way NE, Seattle, WA 98195</p>
          <div className="pill-row">
            <span className="pill">RAIVN Lab</span>
            <span className="pill">AI2 PRIOR</span>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Research Focus</h2>
        <p>
          Leads research at the intersection of computer vision, machine learning, natural language processing,
          robotics, and human–computer interaction. Advises students and collaborates across UW and the Allen Institute for AI.
        </p>
        <div className="grid">
          <div className="card">
            <h4>RAIVN Lab (Reasoning, AI, and VisioN)</h4>
            <p>Co-directed with Ali Farhadi, advancing reasoning-centric vision and multimodal AI.</p>
          </div>
          <div className="card">
            <h4>PRIOR Team at AI2</h4>
            <p>Directs the PRIOR team, building datasets, models, and tools for robust vision-language systems.</p>
          </div>
          <div className="card">
            <h4>Foundational Work</h4>
            <p>Contributed foundational work on scene graphs and the Visual Genome dataset, widely used in pretraining and vision-language research.</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <h2>Notable Projects & Datasets</h2>
        <div className="grid">
          <div className="card">
            <h4>Visual Genome</h4>
            <p>Large-scale dataset for scene graph generation and multimodal learning.</p>
          </div>
          <div className="card">
            <h4>DataComp</h4>
            <p>Benchmarking dataset curation for large-scale multimodal models.</p>
          </div>
          <div className="card">
            <h4>Objaverse-XL</h4>
            <p>Massive 3D dataset for vision and embodied AI.</p>
          </div>
          <div className="card">
            <h4>OpenCLIP</h4>
            <p>Open-source vision-language models and training pipelines.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Teaching</h2>
        <div className="grid">
          <div className="card">
            <h4>CSE 455 — Computer Vision</h4>
            <p>Winter 2025</p>
          </div>
          <div className="card">
            <h4>CSE 493G1 — Deep Learning</h4>
            <p>Spring 2025</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <h2>Recognition & Support</h2>
        <div className="grid">
          <div className="card">
            <h4>MIT Technology Review</h4>
            <p>Innovators Under 35 Asia Pacific (2025).</p>
          </div>
          <div className="card">
            <h4>Media Coverage</h4>
            <p>Research cited by Science, Forbes, The Wall Street Journal, and PBS NOVA.</p>
          </div>
          <div className="card">
            <h4>Research Support</h4>
            <p>Supported by Google, Apple, AI2, Amazon, Cisco, Toyota/TRI, NSF, ONR, and Yahoo.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Ranjay Krishna</strong>
          <p>Assistant Professor, Paul G. Allen School of Computer Science & Engineering, University of Washington</p>
        </div>
        <div className="footer-links">
          <a href="mailto:ranjay@cs.washington.edu">ranjay@cs.washington.edu</a>
          <span>•</span>
          <a href="https://wa.me/914086554917" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}
