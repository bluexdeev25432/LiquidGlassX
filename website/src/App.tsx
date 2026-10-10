import { useEffect, useMemo, useState } from 'react';
import {
  IconAdjustmentsHorizontal,
  IconArrowDown,
  IconBattery,
  IconBluetooth,
  IconBrandGithub,
  IconBrightness,
  IconDeviceMobile,
  IconDownload,
  IconFocus2,
  IconGlass,
  IconMoonStars,
  IconPackage,
  IconPlane,
  IconRotate,
  IconShieldCheck,
  IconSignal4g,
  IconSparkles,
  IconSun,
  IconVolume,
  IconWifi,
} from '@tabler/icons-react';
import GlassScene from './GlassScene';
import releaseManifest from './data/releases.json';

type ReleaseManifest = {
  version: string;
  packageIdentifier: string;
  filename: string;
  downloadPath: string;
  architecture: string;
  fileSize: string;
  sha256: string;
  releaseDate: string;
  testedIosVersions: string[];
  changelog: string;
  verificationStatus: string;
  downloadEnabled: boolean;
};

const release = releaseManifest as ReleaseManifest;

const featureCards = [
  { title: 'Battery appearance', description: 'Glass battery container, outline treatment, and adaptive tinting for the status bar.', status: 'Not Verified', accent: 'amber', icon: IconBattery },
  { title: 'Cellular signal', description: 'Status bar signal styling and glass layering for native network indicators.', status: 'Not Verified', accent: 'cyan', icon: IconSignal4g },
  { title: '4G/LTE indicator', description: 'Refined text treatment and visibility for the network type label without claiming unsupported technologies.', status: 'Not Verified', accent: 'blue', icon: IconSignal4g },
  { title: 'Wi‑Fi', description: 'Glass-style Wi‑Fi badge and support for display tinting while preserving native behavior.', status: 'Not Verified', accent: 'cyan', icon: IconWifi },
  { title: 'Control Center connectivity', description: 'Simulated Control Center surfaces and native-like controls for preview purposes.', status: 'In Development', accent: 'mint', icon: IconAdjustmentsHorizontal },
  { title: 'Glass blur and tint', description: 'Backdrop blur, tint presets, and opacity controls in the visual preview.', status: 'In Development', accent: 'coral', icon: IconGlass }
];

const featureDetails = [
  { name: 'Control Center', icon: IconAdjustmentsHorizontal, description: 'Glass cards and native-like controls presented in the website preview.', status: 'In Development' },
  { name: 'Status Bar', icon: IconDeviceMobile, description: 'Status indicators and network treatment with light and dark appearance previews.', status: 'Not Verified' },
  { name: 'Battery', icon: IconBattery, description: 'Battery outline styling and low-power visual states that remain safe by default.', status: 'Not Verified' },
  { name: 'Cellular Signal', icon: IconSignal4g, description: 'Signal ornamentation and contrast support designed for iPhone-compatible layouts.', status: 'Not Verified' },
  { name: 'Wi‑Fi', icon: IconWifi, description: 'Wi‑Fi icon styling and overlays built with the system’s native visual rhythm.', status: 'Not Verified' },
  { name: 'Glass Customization', icon: IconGlass, description: 'Opacity, blur and tint variables delivered through a central management layer.', status: 'In Development' },
  { name: 'Dark Mode', icon: IconMoonStars, description: 'Dark and light appearance previews for system surfaces.', status: 'In Development' },
  { name: 'Safe Mode', icon: IconShieldCheck, description: 'Emergency master disable and safe fallback mode for crash prevention and recovery.', status: 'Implemented' }
];

const compatibility = [
  { label: 'Supported jailbreak type', value: 'Rootless jailbreak with mobile substrate compatibility' },
  { label: 'Package architecture', value: release.architecture },
  { label: 'Minimum tested iOS version', value: 'Not yet device verified' },
  { label: 'Latest tested iOS version', value: 'Not yet device verified' },
  { label: 'Device testing status', value: 'No physical device was available in this environment' },
  { label: 'Known limitations', value: 'Unsupported private hooks remain disabled unless validated on a compatible system.' }
];

const changelogEntries = [
  { version: release.version, date: release.releaseDate, features: ['Rootless arm64 package generated with Theos', 'Interactive glass preview and Preferences controls', 'Tabler icon assets and release verification tooling'], fixes: ['Package metadata and rootless install paths verified'], issues: ['No physical-device validation; private system hooks remain experimental'], compatibility: ['Build artifact verified; runtime compatibility not verified'] }
];

const faqItems = [
  { question: 'What is LiquidGlassX?', answer: 'LiquidGlassX is a rootless jailbreak tweak project focused on iOS 27-inspired glass styling for Control Center, status bar, and system overlays.' },
  { question: 'Which devices are supported?', answer: 'The intended target is iPhone 11 class hardware running a compatible rootless jailbreak. This project does not claim verified support beyond the scoped build and source scaffolding.' },
  { question: 'Which iOS versions are tested?', answer: 'No device-tested iOS version is currently verified in this environment. The project keeps runtime compatibility intentionally conservative.' },
  { question: 'Does it work on iPhone 11?', answer: 'The project is designed around iPhone 11 class hardware in principle, but it has not been installed or validated on a real device here.' },
  { question: 'Does it make the display 120 Hz?', answer: 'No. A software tweak cannot upgrade a phone’s display hardware. This project does not claim 120 Hz or display upgrades.' },
  { question: 'Does it make an iPhone 11 support 5G?', answer: 'No. Radio hardware and carrier support are unrelated to a theming tweak. This project does not claim 5G support.' },
  { question: 'How do I install the .deb?', answer: 'Download the verified package from the linked GitHub Release, then open it in Sileo or Zebra on a compatible rootless jailbroken device. The LiquidGlassX APT source is not yet published.' },
  { question: 'What if Settings or SpringBoard crashes?', answer: 'Disable the tweak from the package manager or by toggling the master-safe switch and remove it from the system configuration. The project includes a safe-mode disabled path, but it is not device tested.' },
  { question: 'How do I uninstall the tweak?', answer: 'Remove the package through your package manager or use the compatible uninstall flow for the installed jailbreak package manager.' },
  { question: 'Where can I report a bug?', answer: 'Use the project issue tracker once a repository is configured. Until then, report problems through the repository metadata and the source project instructions.' }
];

function App() {
  const [blur, setBlur] = useState(24);
  const [opacity, setOpacity] = useState(0.7);
  const [tint, setTint] = useState('#7aa2ff');
  const [appearance, setAppearance] = useState<'dark' | 'light'>('dark');
  const [intensity, setIntensity] = useState(1);
  const [statusMode, setStatusMode] = useState<'dark' | 'light'>('dark');
  const [batteryLevel, setBatteryLevel] = useState(72);
  const [compareValue, setCompareValue] = useState(50);
  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(60);
  const [enabledControls, setEnabledControls] = useState(() => new Set(['Wi-Fi', 'Bluetooth']));

  const glassStyle = useMemo(() => ({
    '--demo-blur': `${blur}px`,
    '--demo-opacity': String(opacity),
    '--demo-tint': tint,
    '--demo-intensity': String(intensity),
    '--demo-appearance': appearance,
    '--demo-animation-duration': `${Math.max(0.5, 2.8 / intensity)}s`,
  }) as React.CSSProperties, [appearance, blur, intensity, opacity, tint]);

  const downloadLink = release.downloadEnabled ? release.downloadPath : '#download';
  const repositoryUrl = 'https://github.com/bluexdeev25432/LiquidGlassX';

  useEffect(() => {
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: IntersectionObserver | undefined;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      observer = revealObserver;
      revealItems.forEach((item) => revealObserver.observe(item));
    }

    const tiltItems = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    const onTiltMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === 'touch') return;
      const target = event.currentTarget as HTMLElement;
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      target.style.setProperty('--tilt-x', `${x * 5}deg`);
      target.style.setProperty('--tilt-y', `${-y * 5}deg`);
    };
    const onTiltLeave = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.setProperty('--tilt-x', '0deg');
      target.style.setProperty('--tilt-y', '0deg');
    };
    if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
      tiltItems.forEach((item) => {
        item.addEventListener('pointermove', onTiltMove);
        item.addEventListener('pointerleave', onTiltLeave);
      });
    }

    return () => {
      observer?.disconnect();
      tiltItems.forEach((item) => {
        item.removeEventListener('pointermove', onTiltMove);
        item.removeEventListener('pointerleave', onTiltLeave);
      });
    };
  }, []);

  const toggleControl = (name: string) => {
    setEnabledControls((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="page-shell">
      <header className="topbar glass-panel" id="top">
        <div className="brand-wrap">
          <div className="brand-mark">LGX</div>
          <span>LiquidGlassX</span>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#features">Features</a>
          <a href="#preview">Preview</a>
          <a href="#compatibility">Compatibility</a>
          <a href="#changelog">Changelog</a>
          <a href="#download">Download</a>
        </nav>
        <a className="nav-button" href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="Open LiquidGlassX on GitHub">
          <IconBrandGithub size={17} stroke={1.8} />
          <span>GitHub</span>
        </a>
      </header>

      <main>
        <section className="hero" id="overview" data-reveal>
          <div className="hero-copy">
            <span className="eyebrow">iOS 27-inspired rootless tweak</span>
            <h1>Liquid Glass. Reimagined.</h1>
            <p>
              Bring an iOS 27-inspired glass experience to your jailbroken iPhone with a
              restrained, polished aesthetic tuned for control surfaces and overlays.
            </p>
            <div className="cta-row">
              <a className={`primary-button ${release.downloadEnabled ? '' : 'disabled'}`} href={downloadLink} aria-disabled={!release.downloadEnabled} onClick={(event) => !release.downloadEnabled && event.preventDefault()}>
                <IconDownload size={18} stroke={1.8} />
                <span>{release.downloadEnabled ? 'Download .deb' : 'No verified release yet'}</span>
              </a>
              <a className="secondary-button" href="#features"><IconArrowDown size={17} stroke={1.8} /><span>Explore features</span></a>
            </div>
            <div className="meta-pills" aria-label="Product metadata">
              <span>Version {release.version}</span>
              <span>{release.verificationStatus}</span>
              <span>Package {release.packageIdentifier}</span>
            </div>
          </div>

          <div className="hero-visual">
            <GlassScene />
            <div className="hero-phone tilt-card" data-tilt aria-label="LiquidGlassX Control Center concept preview">
              <div className="statusbar statusbar-dark">
                <span>9:41</span>
                <div className="status-icons">
                  <span className="signal-bars" aria-label="Cellular signal bars">
                    <i /> <i /> <i /> <i />
                  </span>
                  <IconWifi className="wifi-icon" size={15} stroke={2} aria-label="Wi-Fi" />
                  <span className="battery-pill">
                    <span className="battery-shell"><span className="battery-fill" style={{ width: `${batteryLevel}%` }} /></span>
                    <span>{batteryLevel}%</span>
                  </span>
                </div>
              </div>

              <div className="cc-surface">
                <div className="cc-header">
                  <span>Control Center</span>
                  <button className={`cc-toggle ${enabledControls.has('Connectivity') ? 'on' : ''}`} aria-label="Toggle Control Center preview" aria-pressed={enabledControls.has('Connectivity')} onClick={() => toggleControl('Connectivity')} />
                </div>

                <div className="cc-grid">
                  <button className={`cc-chip ${enabledControls.has('Wi-Fi') ? 'active' : ''}`} aria-pressed={enabledControls.has('Wi-Fi')} onClick={() => toggleControl('Wi-Fi')}><IconWifi size={19} /><span>Wi-Fi</span></button>
                  <button className={`cc-chip ${enabledControls.has('Bluetooth') ? 'active' : ''}`} aria-pressed={enabledControls.has('Bluetooth')} onClick={() => toggleControl('Bluetooth')}><IconBluetooth size={19} /><span>Bluetooth</span></button>
                  <button className={`cc-chip ${enabledControls.has('Airplane') ? 'active' : ''}`} aria-pressed={enabledControls.has('Airplane')} onClick={() => toggleControl('Airplane')}><IconPlane size={19} /><span>Airplane</span></button>
                  <button className={`cc-chip ${enabledControls.has('Cellular') ? 'active' : ''}`} aria-pressed={enabledControls.has('Cellular')} onClick={() => toggleControl('Cellular')}><IconSignal4g size={19} /><span>Cellular</span></button>
                  <div className="cc-chip large"><label htmlFor="hero-brightness"><IconBrightness size={17} /><span>Brightness</span><output>{brightness}%</output></label><input id="hero-brightness" type="range" min="0" max="100" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} /></div>
                  <div className="cc-chip large"><label htmlFor="hero-volume"><IconVolume size={17} /><span>Volume</span><output>{volume}%</output></label><input id="hero-volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></div>
                  <button className={`cc-chip ${enabledControls.has('Focus') ? 'active' : ''}`} aria-pressed={enabledControls.has('Focus')} onClick={() => toggleControl('Focus')}><IconFocus2 size={19} /><span>Focus</span></button>
                  <button className={`cc-chip ${enabledControls.has('Rotation') ? 'active' : ''}`} aria-pressed={enabledControls.has('Rotation')} onClick={() => toggleControl('Rotation')}><IconRotate size={19} /><span>Rotation</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-demo section-wrap" id="demo" data-reveal>
          <div className="section-header narrow">
            <span className="eyebrow">Interactive preview</span>
            <h2>Visual glass tuning</h2>
          </div>

          <div className="demo-layout">
            <div className="controls-panel glass-panel">
              <label>
                <span>Blur intensity</span>
                <input type="range" min="0" max="42" value={blur} onChange={(event) => setBlur(Number(event.target.value))} />
              </label>
              <label>
                <span>Glass opacity</span>
                <input type="range" min="0.2" max="1" step="0.01" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} />
              </label>
              <label>
                <span>Tint color</span>
                <input type="color" value={tint} onChange={(event) => setTint(event.target.value)} />
              </label>
              <label>
                <span>Appearance</span>
                <select value={appearance} onChange={(event) => setAppearance(event.target.value as 'dark' | 'light')}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label>
                <span>Animation intensity</span>
                <input type="range" min="0.3" max="2" step="0.1" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
              </label>
            </div>

            <div className="preview-panel glass-panel" style={glassStyle}>
              <div className="preview-window">
                <div className="preview-header">
                  <span>Liquid Glass preview</span>
                  <span className="badge">Visual demo only</span>
                </div>
                <div className="preview-cards">
                  <div className="mini-card active">Wi‑Fi</div>
                  <div className="mini-card">Bluetooth</div>
                  <div className="mini-card">Cellular</div>
                  <div className="mini-card">Focus</div>
                </div>
                <div className="preview-spectrum" />
              </div>
            </div>
          </div>
        </section>

        <section className="features section-wrap" id="features" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Core features</span>
            <h2>Refined surface treatments</h2>
          </div>

          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article className="feature-card glass-panel tilt-card" data-tilt key={feature.title}>
                <div className={`status-tag status-${feature.accent}`}>
                  {feature.status}
                </div>
                <div className="feature-icon"><feature.icon size={22} stroke={1.7} aria-hidden="true" /></div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="status-showcase section-wrap" id="status-bar" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Status bar</span>
            <h2>light and dark appearance</h2>
          </div>

          <div className="status-demo-wrap glass-panel">
            <div className="status-toggle-row">
              <button className={statusMode === 'dark' ? 'active' : ''} aria-pressed={statusMode === 'dark'} onClick={() => setStatusMode('dark')}><IconMoonStars size={16} />Dark</button>
              <button className={statusMode === 'light' ? 'active' : ''} aria-pressed={statusMode === 'light'} onClick={() => setStatusMode('light')}><IconSun size={16} />Light</button>
            </div>

            <div className={`status-demo ${statusMode}`}>
              <div className="statusbar statusbar-demo">
                <span>9:41</span>
                <div className="status-icons">
                  <span className="signal-bars" aria-label="Cellular signal bars">
                    <i /> <i /> <i /> <i />
                  </span>
                  <IconWifi className="wifi-icon" size={15} stroke={2} aria-label="Wi-Fi" />
                  <span className="network-type">4G</span>
                  <span className="battery-pill">
                    <span className="battery-shell"><span className="battery-fill" style={{ width: `${batteryLevel}%` }} /></span>
                    <span>{batteryLevel}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="battery-rail">
              <label>
                <span>Battery level</span>
                <input type="range" min="15" max="100" value={batteryLevel} onChange={(event) => setBatteryLevel(Number(event.target.value))} />
              </label>
            </div>
          </div>
        </section>

        <section className="compare section-wrap" id="preview" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Before / after</span>
            <h2>Conventional vs LiquidGlassX</h2>
          </div>

          <div className="compare-shell glass-panel">
            <div className="compare-image standard" aria-label="Standard iOS inspired preview">
              <div className="compare-label">Conventional</div>
            </div>
            <div className="compare-image glassed" style={{ clipPath: `inset(0 ${100 - compareValue}% 0 0)` }} aria-label="LiquidGlassX inspired preview">
              <div className="compare-label">LiquidGlassX</div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={compareValue}
              onChange={(event) => setCompareValue(Number(event.target.value))}
              aria-label="Preview comparison slider"
              className="compare-slider"
            />
          </div>
        </section>

        <section className="feature-details section-wrap" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Feature detail</span>
            <h2>Honest implementation status</h2>
          </div>

          <div className="detail-grid">
            {featureDetails.map((item) => (
              <article className="detail-item glass-panel tilt-card" data-tilt key={item.name}>
                <div className="detail-icon"><item.icon size={20} stroke={1.7} aria-hidden="true" /></div>
                <div>
                  <div className="detail-head">
                    <h3>{item.name}</h3>
                    <span className="detail-status">{item.status}</span>
                  </div>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="compatibility section-wrap" id="compatibility" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Compatibility</span>
            <h2>Source and build status</h2>
          </div>

          <div className="compat-grid glass-panel">
            {compatibility.map((item) => (
              <div className="compat-row" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="download section-wrap" id="download" data-reveal>
          <div className="section-header narrow">
            <span className="eyebrow">Download</span>
            <h2>Verified release workflow</h2>
          </div>

          <div className="download-panel glass-panel">
            <div>
              <span className="download-kicker">Latest verified version</span>
              <h3>{release.version}</h3>
              <p>{release.verificationStatus}</p>
            </div>
            <div className="download-meta">
              <span>Package: {release.packageIdentifier}</span>
              <span>Architecture: {release.architecture}</span>
              <span>File: {release.filename || 'Not published'}</span>
              <span>Size: {release.fileSize}</span>
              <span>SHA‑256: {release.sha256 || 'Not generated'}</span>
              <span>Release date: {release.releaseDate}</span>
            </div>
            <a
              className={`download-button ${release.downloadEnabled ? '' : 'disabled'}`}
              href={downloadLink}
              aria-disabled={!release.downloadEnabled}
              onClick={(event) => {
                if (!release.downloadEnabled) {
                  event.preventDefault();
                }
              }}
            >
              <IconDownload size={18} stroke={1.8} />
              <span>{release.downloadEnabled ? 'Download verified .deb' : 'No verified release available yet'}</span>
            </a>
          </div>
        </section>

        <section className="sileo section-wrap" id="sileo" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Sileo</span>
            <h2>Install from a verified release</h2>
          </div>
          <div className="sileo-panel glass-panel">
            <div className="sileo-mark"><IconPackage size={24} stroke={1.7} /></div>
            <div className="sileo-copy">
              <h3>APT source not published</h3>
              <p>The repository structure is prepared, but no public Sileo source is available yet. Add no source URL until deployment is confirmed.</p>
              <ol>
                <li>Install Sileo on a compatible rootless jailbreak.</li>
                <li>Download the verified LiquidGlassX package from the GitHub Release.</li>
                <li>Open the downloaded package in Sileo and review its package details before installing.</li>
              </ol>
            </div>
            <a className="secondary-button" href={`${repositoryUrl}/releases`} target="_blank" rel="noreferrer">
              <IconBrandGithub size={17} stroke={1.8} /><span>View releases</span>
            </a>
          </div>
        </section>

        <section className="changelog section-wrap" id="changelog" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Changelog</span>
            <h2>Release history</h2>
          </div>

          <div className="changelog-list">
            {changelogEntries.map((entry) => (
              <article className="glass-panel changelog-item" key={entry.version}>
                <div className="changelog-header">
                  <h3>{entry.version}</h3>
                  <span>{entry.date}</span>
                </div>
                <div className="changelog-columns">
                  <div>
                    <h4>New features</h4>
                    <ul>{entry.features.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Fixes</h4>
                    <ul>{entry.fixes.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Known issues</h4>
                    <ul>{entry.issues.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Compatibility</h4>
                    <ul>{entry.compatibility.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="install section-wrap" id="install" data-reveal>
          <div className="section-header">
            <span className="eyebrow">Installation</span>
            <h2>Supported flow</h2>
          </div>

          <div className="install-grid glass-panel">
            <ol>
              <li>Ensure you are on a compatible rootless jailbreak with package installation enabled.</li>
              <li>Install the verified LiquidGlassX .deb through Sileo, Zebra, or another compatible package manager.</li>
              <li>Open Settings or a configured preferences bundle if available and enable LiquidGlassX.</li>
              <li>Use the master disable switch or safe mode toggle if the tweak causes a system issue.</li>
              <li>Remove the package using the package manager if you need to recover the device.</li>
            </ol>
          </div>
        </section>

        <section className="faq section-wrap" id="faq" data-reveal>
          <div className="section-header">
            <span className="eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>

          <div className="faq-list">
            {faqItems.map((item) => (
              <details className="glass-panel faq-item" key={item.question} open={item.question === 'What is LiquidGlassX?'}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand-mark small">LGX</div>
          <div>
            <strong>LiquidGlassX</strong>
            <p>iOS 27-inspired glass styling for jailbreak systems.</p>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Navigation</h4>
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#download">Download</a>
          </div>
          <div>
            <h4>Source</h4>
            <a href={repositoryUrl} target="_blank" rel="noreferrer"><IconBrandGithub size={15} /> Project source</a>
            <a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">Report an issue</a>
            <a href={`${repositoryUrl}/releases`} target="_blank" rel="noreferrer">GitHub Releases</a>
            <a href="#changelog">Changelog</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h4>Release</h4>
            <span>{release.version}</span>
            <span>{release.verificationStatus}</span>
            <span>{release.packageIdentifier}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
