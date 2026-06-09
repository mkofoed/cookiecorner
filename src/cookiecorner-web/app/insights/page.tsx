import styles from "../_components/page-section.module.css";
import pageStyles from "./insights.module.css";

type Metric = {
  label: string;
  value: string;
  detail: string;
};

type SalesSlice = {
  label: string;
  value: number;
  color: string;
};

type MonthlyRevenue = {
  month: string;
  revenue: number;
  orders: number;
};

const heroMetrics: Metric[] = [
  {
    label: "Presentation revenue",
    value: "DKK 482,000",
    detail: "Mock trailing 6-month teddy bear revenue for the sales deck.",
  },
  {
    label: "Units sold",
    value: "3,640",
    detail: "Demo volume across the signature plush collection.",
  },
  {
    label: "Average order value",
    value: "DKK 132",
    detail: "Bundled gift wraps and accessories lift basket size.",
  },
];

const salesMix: SalesSlice[] = [
  { label: "Classic cuddle bears", value: 38, color: "#b95c2c" },
  { label: "Seasonal gift bears", value: 24, color: "#d97a41" },
  { label: "Personalised keepsakes", value: 22, color: "#f0a35b" },
  { label: "Mini impulse plushies", value: 16, color: "#f7c588" },
];

const regionalSales: SalesSlice[] = [
  { label: "Copenhagen flagship", value: 34, color: "#70452a" },
  { label: "Online store", value: 29, color: "#9c4e24" },
  { label: "Retail partners", value: 21, color: "#d97a41" },
  { label: "Event pop-ups", value: 16, color: "#efb06f" },
];

const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan", revenue: 54000, orders: 390 },
  { month: "Feb", revenue: 61800, orders: 450 },
  { month: "Mar", revenue: 72900, orders: 560 },
  { month: "Apr", revenue: 81100, orders: 615 },
  { month: "May", revenue: 94800, orders: 720 },
  { month: "Jun", revenue: 107400, orders: 790 },
];

const donutSize = 220;
const donutStrokeWidth = 28;
const donutRadius = (donutSize - donutStrokeWidth) / 2;
const donutCircumference = 2 * Math.PI * donutRadius;

function formatDkk(value: number) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildDonutSegments(slices: SalesSlice[]) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let accumulatedLength = 0;

  return slices.map((slice, index) => {
    const rawLength = (slice.value / total) * donutCircumference;
    const segmentLength =
      index === slices.length - 1 ? donutCircumference - accumulatedLength : rawLength;
    const dashOffset = -accumulatedLength;

    accumulatedLength += segmentLength;

    return {
      ...slice,
      dashArray: `${segmentLength} ${donutCircumference - segmentLength}`,
      dashOffset,
      percentage: Math.round((slice.value / total) * 100),
    };
  });
}

function getBarChartLabel(data: MonthlyRevenue[]) {
  return data
    .map((entry) => `${entry.month}: ${formatDkk(entry.revenue)} from ${entry.orders} orders`)
    .join(". ");
}

export default function InsightsPage() {
  const productMixSegments = buildDonutSegments(salesMix);
  const regionalSegments = buildDonutSegments(regionalSales);
  const bestMonth = monthlyRevenue.reduce((highest, current) =>
    current.revenue > highest.revenue ? current : highest,
  );
  const maxRevenue = Math.max(...monthlyRevenue.map((entry) => entry.revenue));

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Insights</span>
        <h1>Teddy bear sales insights for the presentation deck.</h1>
        <p>
          A polished demo dashboard with mock revenue, channel mix, and product
          trends so the team can present the CookieCorner concept like a live retail
          brand.
        </p>
      </section>

      <section className={styles.grid}>
        {heroMetrics.map((metric) => (
          <article key={metric.label} className={styles.card}>
            <span className={pageStyles.metricLabel}>{metric.label}</span>
            <strong className={pageStyles.metricValue}>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className={pageStyles.chartGrid}>
        <article className={pageStyles.chartCard}>
          <div className={pageStyles.chartHeader}>
            <div>
              <span className={styles.eyebrow}>Product mix</span>
              <h2 className={styles.sectionTitle}>Best-selling teddy bear lines</h2>
            </div>
            <p>Classic cuddle bears anchor the assortment, while gift-ready plush drives upsell.</p>
          </div>

          <div className={pageStyles.donutLayout}>
            <div
              className={pageStyles.donutWrap}
              role="img"
              aria-label="Share of sales by teddy bear line. Classic cuddle bears 38 percent. Seasonal gift bears 24 percent. Personalised keepsakes 22 percent. Mini impulse plushies 16 percent."
            >
              <svg
                className={pageStyles.donutChart}
                viewBox={`0 0 ${donutSize} ${donutSize}`}
                aria-hidden="true"
              >
                <circle
                  className={pageStyles.donutTrack}
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                />
                <g transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}>
                  {productMixSegments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={donutRadius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={donutStrokeWidth}
                      strokeDasharray={segment.dashArray}
                      strokeDashoffset={segment.dashOffset}
                    />
                  ))}
                </g>
              </svg>
              <div className={pageStyles.donutCenter}>
                <span>Top line</span>
                <strong>38%</strong>
                <p>Classic cuddle bears</p>
              </div>
            </div>

            <ul className={pageStyles.legendList}>
              {productMixSegments.map((segment) => (
                <li key={segment.label} className={pageStyles.legendItem}>
                  <span
                    className={pageStyles.legendSwatch}
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>
                      {segment.label} · {segment.percentage}%
                    </strong>
                    <span>{segment.value} share points in the mock dataset</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className={pageStyles.chartCard}>
          <div className={pageStyles.chartHeader}>
            <div>
              <span className={styles.eyebrow}>Channel split</span>
              <h2 className={styles.sectionTitle}>Revenue by sales channel</h2>
            </div>
            <p>Direct retail still leads, with ecommerce nearly matching flagship performance.</p>
          </div>

          <div className={pageStyles.donutLayout}>
            <div
              className={pageStyles.donutWrap}
              role="img"
              aria-label="Share of revenue by channel. Copenhagen flagship 34 percent. Online store 29 percent. Retail partners 21 percent. Event pop-ups 16 percent."
            >
              <svg
                className={pageStyles.donutChart}
                viewBox={`0 0 ${donutSize} ${donutSize}`}
                aria-hidden="true"
              >
                <circle
                  className={pageStyles.donutTrack}
                  cx={donutSize / 2}
                  cy={donutSize / 2}
                  r={donutRadius}
                />
                <g transform={`rotate(-90 ${donutSize / 2} ${donutSize / 2})`}>
                  {regionalSegments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={donutRadius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={donutStrokeWidth}
                      strokeDasharray={segment.dashArray}
                      strokeDashoffset={segment.dashOffset}
                    />
                  ))}
                </g>
              </svg>
              <div className={pageStyles.donutCenter}>
                <span>Fastest scale</span>
                <strong>29%</strong>
                <p>Online store</p>
              </div>
            </div>

            <ul className={pageStyles.legendList}>
              {regionalSegments.map((segment) => (
                <li key={segment.label} className={pageStyles.legendItem}>
                  <span
                    className={pageStyles.legendSwatch}
                    style={{ backgroundColor: segment.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>
                      {segment.label} · {segment.percentage}%
                    </strong>
                    <span>{segment.value} share points in the mock dataset</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section className={pageStyles.chartCard}>
        <div className={pageStyles.chartHeader}>
          <div>
            <span className={styles.eyebrow}>Momentum</span>
            <h2 className={styles.sectionTitle}>Monthly revenue climb</h2>
          </div>
          <p>
            The strongest month is {bestMonth.month}, landing at {formatDkk(bestMonth.revenue)} on{" "}
            {bestMonth.orders} orders in this mock sales story.
          </p>
        </div>

        <div
          className={pageStyles.barChart}
          role="img"
          aria-label={`Monthly revenue bar chart. ${getBarChartLabel(monthlyRevenue)}`}
        >
          {monthlyRevenue.map((entry) => (
            <div key={entry.month} className={pageStyles.barColumn}>
              <span className={pageStyles.barValue}>{formatDkk(entry.revenue)}</span>
              <div className={pageStyles.barTrack}>
                <div
                  className={pageStyles.barFill}
                  style={{ height: `${(entry.revenue / maxRevenue) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className={pageStyles.barMonth}>{entry.month}</span>
              <span className={pageStyles.barOrders}>{entry.orders} orders</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
