import styles from "../_components/page-section.module.css";

const configurationSteps = [
  "Choose size",
  "Pick color",
  "Add gift wrap",
  "Review price and availability",
];

export default function ConfiguratorPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Configurator</span>
        <h1>First step-by-step placeholder for configuring a Hyggefis.</h1>
        <p>
          The eventual configurator will use structured product options from the
          backend. For now, this page defines the main user journey and the UI
          space it needs.
        </p>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Planned flow</h2>
      </section>

      <section className={styles.grid}>
        {configurationSteps.map((step, index) => (
          <article key={step} className={styles.card}>
            <h3>
              Step {index + 1}: {step}
            </h3>
            <p>
              Placeholder content for the future configurator state, validations,
              and pricing feedback.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
