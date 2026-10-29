import { useEffect } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { LeftSidebar, type Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import { Footer } from '../../components/layout/Footer/Footer';
import DownloadIcon from '../../assets/icons/Download.svg?react';
import OpenInNewIcon from '../../assets/icons/OpeninNewFilled.svg?react';
import ArrowForwardIcon from '../../assets/icons/ArrowForwardFilled.svg?react';
import reportImg from '../../assets/typing-tools/segmentation-report.svg';
import './KenyaTypingToolsPage.css';

interface KenyaTypingToolsPageProps {
  onNavigate: (page: Page, tag?: string) => void;
  currentPage: Page;
}

// Download and preview point at the real files on the live platform
const LIVE_ORIGIN = 'https://withpathways.org';
const REPORT_URL = 'https://reports.withpathways.org/reports/published/Kenya_2022DHS8_1.0';

const TYPING_TOOLS = [
  {
    id: 'q4aisd47hsuhtlg0bx5n7gng',
    typesTo: 'Segment',
    tag: 'latest' as const,
    version: 'KenyaDHS8-1-TTv2.2',
    released: 'January 2025',
    note: 'The “number of years of education” question was changed to “level of education.” There was also a significant reduction in the number of questions in both rural and urban sections.',
  },
  {
    id: 'jmscm1kgtojm0lmdfthkuz7b',
    typesTo: 'Segment',
    tag: 'retired' as const,
    version: 'KenyaDHS8-1-TTv1.1',
    released: 'January 2025',
    note: 'Original version published',
  },
];

const RESOURCES = [
  {
    id: 'why-trust',
    title: 'Why trust Pathways data',
    body: 'Trust in Pathways data is built on scientific rigour, transparent methodology, and real-world validation. Six pillars underpin the credibility of every Pathways output. A high-quality data backbone Pathways is anchored i…',
  },
  {
    id: 'limitations',
    title: 'Limitations of the approach',
    body: 'As with any data-driven approach, Pathways has boundaries worth understanding before you rely on it. Because segmentations are built from survey data collected at a single point in time, they can show which factors are a…',
  },
];

export function KenyaTypingToolsPage({ onNavigate, currentPage }: KenyaTypingToolsPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Typing tools & more';
  }, []);

  const openResource = () => onNavigate('guide-article', 'understand');

  return (
    <div className="ktt-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="ktt-page__main">
        <LeftSidebar currentPage={currentPage} onNavigate={onNavigate} />
        <div className="ktt-page__content">
          <div className="ktt-page__header">
            <h1 className="ktt-page__title">Typing tools &amp; more</h1>
            <p className="ktt-page__description">Quickly &amp; easily identify segments in your population of focus with the typing tool.</p>
          </div>

          <div className="ktt-page__body">
            {/* Typing tools table */}
            <div className="ktt-table-wrap">
              <table className="ktt-table">
                <thead>
                  <tr>
                    <th>Types to</th>
                    <th>Version</th>
                    <th>Released</th>
                    <th>Note</th>
                    <th><span className="ktt-visually-hidden">Preview</span></th>
                    <th><span className="ktt-table__actions-label">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {TYPING_TOOLS.map(tt => (
                    <tr key={tt.id}>
                      <td>
                        <span className="ktt-table__types-to">
                          {tt.typesTo}
                          <span className={`ktt-chip ktt-chip--${tt.tag}`}>{tt.tag === 'latest' ? 'Latest' : 'Retired'}</span>
                        </span>
                      </td>
                      <td>{tt.version}</td>
                      <td>{tt.released}</td>
                      <td>{tt.note}</td>
                      <td>
                        <a
                          className="ktt-table__action"
                          href={`${LIVE_ORIGIN}/en/typing-tools/${tt.id}/preview`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Preview (opens in a new tab)"
                        >
                          <span className="ktt-table__action-label">Preview</span>
                          <OpenInNewIcon className="ktt-table__action-icon" aria-hidden="true" />
                        </a>
                      </td>
                      <td>
                        <a
                          className="ktt-table__action"
                          href={`${LIVE_ORIGIN}/api/typing-tools/${tt.id}/download`}
                          aria-label="Download"
                        >
                          <span className="ktt-table__action-label">Download</span>
                          <DownloadIcon className="ktt-table__action-icon ktt-table__action-icon--download" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Segmentation report */}
            <div className="ktt-report">
              <div className="ktt-report__image">
                <img src={reportImg} alt="" width={160} height={159} />
              </div>
              <div className="ktt-report__text">
                <h2 className="ktt-report__title">Segmentation report</h2>
                <p className="ktt-report__body">Compare segment-level data across health outcomes, behaviours, and vulnerability factors.</p>
                <a className="ktt-report__btn" href={REPORT_URL} target="_blank" rel="noopener noreferrer">
                  View report
                  <OpenInNewIcon className="ktt-report__btn-icon" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Helpful resources */}
            <div className="ktt-resources">
              {RESOURCES.map(item => (
                <div
                  key={item.id}
                  className="ktt-resource"
                  role="button"
                  tabIndex={0}
                  onClick={openResource}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), openResource())}
                >
                  <div>
                    <h3 className="ktt-resource__title">{item.title}</h3>
                    <p className="ktt-resource__body">{item.body}</p>
                  </div>
                  <span className="ktt-resource__link">
                    Read more
                    <ArrowForwardIcon className="ktt-resource__link-icon" aria-hidden="true" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
