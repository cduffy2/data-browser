import { useEffect, useState } from 'react';
import { PrimaryNavBar } from '../../components/layout/PrimaryNavBar/PrimaryNavBar';
import { Footer } from '../../components/layout/Footer/Footer';
import type { Page } from '../../components/layout/LeftSidebar/LeftSidebar';
import './ContactPage.css';

interface ContactPageProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function ContactPage({ currentPage, onNavigate }: ContactPageProps) {
  useEffect(() => {
    document.title = 'Pathways | Contact';
  }, []);

  const [form, setForm] = useState({ name: '', org: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="contact-page">
      <PrimaryNavBar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="contact-page__body">
        <div className="contact-page__container">

          {/* Left: heading + description */}
          <div className="contact-page__content">
            <h1 className="contact-page__heading">Contact us</h1>
            <p className="contact-page__description">
              If you have questions or would like additional information, please email{' '}
              <a href="mailto:hello@withpathways.org" className="contact-page__email-link">
                hello@withpathways.org
              </a>
              {' '}or complete this form.
            </p>
          </div>

          {/* Right: form */}
          <form className="contact-page__form" onSubmit={e => e.preventDefault()}>

            <div className="contact-page__field">
              <label className="contact-page__label" htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="contact-page__input"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="contact-page__field">
              <label className="contact-page__label" htmlFor="org">Organisation (optional)</label>
              <input
                id="org"
                name="org"
                type="text"
                className="contact-page__input"
                value={form.org}
                onChange={handleChange}
              />
            </div>

            <div className="contact-page__field">
              <label className="contact-page__label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="contact-page__input"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="contact-page__field">
              <label className="contact-page__label" htmlFor="message">Your message</label>
              <textarea
                id="message"
                name="message"
                className="contact-page__textarea"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {/* reCAPTCHA mock */}
            <div className="contact-page__captcha">
              <div className="contact-page__captcha-checkbox" />
              <span className="contact-page__captcha-label">I'm not a robot</span>
              <div className="contact-page__captcha-logo">
                <div className="contact-page__captcha-logo-icon">reCAPTCHA</div>
                <span className="contact-page__captcha-privacy">Privacy - Terms</span>
              </div>
            </div>

            <button type="submit" className="contact-page__submit">
              Submit
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
