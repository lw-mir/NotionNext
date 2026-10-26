export const Style = () => (
  <style jsx global>{`
    .personal-blog {
      --ink: #262c2a;
      --muted: #7c827e;
      --line: #e8ebe7;
      --accent: #28735a;
      background: #fff;
      color: var(--ink);
      min-height: 100vh;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
        'Microsoft YaHei', sans-serif;
      font-size: 15px;
      line-height: 1.8;
      display: flex;
      flex-direction: column;
    }
    .personal-blog * {
      box-sizing: border-box;
    }
    .personal-blog a {
      color: inherit;
      text-decoration: none;
    }
    .personal-blog a:hover {
      color: var(--accent);
    }
    .personal-blog a:focus-visible,
    .personal-blog button:focus-visible,
    .personal-blog input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 5px;
    }
    .personal-blog h1,
    .personal-blog h2,
    .personal-blog p {
      margin: 0;
    }
    .site-header {
      max-width: 1040px;
      width: 100%;
      margin: 0 auto;
      padding: 36px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand {
      font-size: 23px;
      font-weight: 700;
      letter-spacing: -0.7px;
    }
    .brand span {
      font-size: 12px;
      font-weight: 400;
      color: var(--muted);
      border-left: 1px solid #ddd;
      margin-left: 16px;
      padding-left: 16px;
      letter-spacing: 1px;
    }
    .site-header nav {
      display: flex;
      gap: 28px;
      font-size: 14px;
      color: #717773;
    }
    .site-header nav a[aria-current='page'] {
      color: var(--accent);
    }
    .site-main {
      max-width: 920px;
      width: 100%;
      padding: 0 32px;
      margin: 0 auto;
      flex: 1;
    }
    .intro {
      padding: 76px 0 68px;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 2px;
      color: var(--accent);
      margin-bottom: 18px !important;
    }
    .intro h1 {
      font-size: 40px;
      line-height: 1.55;
      letter-spacing: -1px;
      font-weight: 650;
      margin-bottom: 22px;
    }
    .intro > p:last-child {
      color: #747c76;
      line-height: 2;
      font-size: 14px;
    }
    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--line);
      padding-bottom: 18px;
    }
    .section-heading h2,
    .tag-section h2 {
      font-size: 15px;
      font-weight: 600;
    }
    .section-heading > a {
      font-size: 12px;
      color: var(--muted);
    }
    .post-row {
      display: grid;
      grid-template-columns: 104px minmax(0, 1fr);
      gap: 20px;
      border-bottom: 1px solid var(--line);
      padding: 29px 0 28px;
    }
    .post-row > time {
      font-size: 12px;
      color: #90958f;
      padding-top: 4px;
      font-variant-numeric: tabular-nums;
    }
    .post-row h2 {
      font-size: 19px;
      font-weight: 600;
      line-height: 1.6;
      overflow-wrap: anywhere;
    }
    .post-row p {
      font-size: 13px;
      line-height: 1.9;
      color: #7c827e;
      margin-top: 8px;
    }
    .post-labels {
      display: flex;
      gap: 13px;
      flex-wrap: wrap;
      font-size: 11px;
      color: #92978f;
      margin-top: 12px;
    }
    .post-labels > a:first-child {
      color: var(--accent);
    }
    .pagination {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      font-size: 13px;
    }
    .muted,
    .empty-state {
      color: var(--muted);
      font-size: 14px;
    }
    .empty-state {
      padding: 45px 0;
    }
    .site-footer {
      max-width: 920px;
      width: 100%;
      margin: 80px auto 0;
      padding: 26px 32px 34px;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #92978f;
    }
    .page-heading {
      padding: 64px 0 36px;
    }
    .page-heading h1,
    .about-page h1 {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.6;
      margin-bottom: 18px;
    }
    .page-heading > p:not(.eyebrow) {
      color: var(--muted);
      font-size: 14px;
    }
    .page-heading > a {
      font-size: 13px;
      color: var(--accent);
    }
    .search-form {
      display: flex;
      max-width: 560px;
      gap: 10px;
      margin-top: 26px;
    }
    .search-form input {
      border: 1px solid #dbe1db;
      background: #fff;
      border-radius: 5px;
      min-width: 0;
      flex: 1;
      padding: 11px 14px;
      font: inherit;
    }
    .search-form button {
      border: 0;
      border-radius: 5px;
      background: var(--accent);
      color: white;
      padding: 10px 23px;
      cursor: pointer;
      font: inherit;
    }
    .topic-list > a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 26px 0;
      border-bottom: 1px solid var(--line);
    }
    .topic-list h2 {
      font-size: 20px;
    }
    .topic-list span {
      font-size: 12px;
      color: var(--muted);
    }
    .tag-section {
      margin-top: 44px;
    }
    .tag-list {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    .tag-list a {
      padding: 6px 13px;
      border: 1px solid var(--line);
      border-radius: 4px;
      font-size: 13px;
      color: var(--accent);
    }
    .tag-list span {
      margin-left: 12px;
      color: var(--muted);
    }
    .reading-layout {
      position: relative;
      padding-top: 44px;
    }
    .reading-article {
      max-width: 700px;
    }
    .article-header {
      padding-bottom: 28px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 30px;
    }
    .back-link {
      font-size: 12px;
      color: var(--muted) !important;
    }
    .article-header h1 {
      font-size: 34px;
      line-height: 1.5;
      font-weight: 650;
      margin: 27px 0 18px;
      overflow-wrap: anywhere;
    }
    .article-meta {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: var(--muted);
    }
    .article-summary {
      font-size: 15px;
      color: #737c75;
      margin-top: 22px !important;
    }
    .article-toc {
      position: fixed;
      top: 180px;
      left: calc(50% + 370px);
      width: 180px;
      max-height: 65vh;
      overflow: auto;
      border-left: 1px solid var(--line);
      padding-left: 20px;
      font-size: 12px;
      color: var(--muted);
    }
    .article-toc p {
      margin-bottom: 12px;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .article-toc a {
      display: block;
      line-height: 1.7;
      margin: 9px 0;
      overflow-wrap: anywhere;
    }
    .article-end {
      border-top: 1px solid var(--line);
      margin-top: 45px;
      padding-top: 25px;
      color: var(--muted);
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }
    .personal-blog .notion {
      font-family: inherit;
      color: var(--ink);
      font-size: 16px;
      line-height: 1.95;
    }
    .personal-blog .notion-page {
      padding: 0 !important;
      width: 100%;
      max-width: 100%;
    }
    .personal-blog .notion-h {
      scroll-margin-top: 30px;
    }
    .personal-blog .notion-text {
      padding: 6px 0;
    }
    .personal-blog .notion-asset-wrapper {
      max-width: 100%;
    }
    .personal-blog .notion-code {
      font-size: 13px;
      line-height: 1.8;
      border: 1px solid var(--line);
      border-radius: 6px;
      background: #f6f8f5;
      max-width: 100%;
      overflow-x: auto;
    }
    .personal-blog .notion-quote {
      border-color: var(--accent);
      color: #68756c;
    }
    .personal-blog .notion-simple-table-wrapper {
      overflow-x: auto;
      max-width: 100%;
    }
    .personal-blog .notion-link {
      color: var(--accent);
    }
    .about-page {
      max-width: 680px;
      padding: 64px 0 30px;
    }
    .about-page > p:not(.eyebrow) {
      line-height: 2.1;
      color: #6e776f;
      margin: 20px 0;
    }
    .about-page h2 {
      font-size: 20px;
      margin-top: 38px;
    }
    .about-page a {
      color: var(--accent);
    }
    .about-lead {
      font-size: 18px;
    }
    .skip-link {
      position: absolute;
      left: 16px;
      top: -80px;
      background: white;
      padding: 10px;
      z-index: 99;
    }
    .skip-link:focus {
      top: 8px;
    }
    @media (min-width: 1200px) {
      .reading-layout {
        margin-left: -25px;
      }
    }
    @media (max-width: 1199px) {
      .article-toc {
        display: none;
      }
    }
    @media (max-width: 640px) {
      .site-header {
        padding: 24px 22px;
      }
      .brand {
        font-size: 21px;
      }
      .brand span {
        display: none;
      }
      .site-header nav {
        gap: 20px;
        font-size: 13px;
      }
      .site-main {
        padding: 0 24px;
      }
      .intro {
        padding: 48px 0 45px;
      }
      .intro h1 {
        font-size: 29px;
        line-height: 1.6;
      }
      .intro > p:last-child {
        font-size: 13px;
      }
      .desktop-break {
        display: none;
      }
      .post-row {
        display: block;
        padding: 25px 0;
      }
      .post-row > time {
        display: block;
        margin-bottom: 8px;
      }
      .post-row h2 {
        font-size: 18px;
      }
      .post-row p {
        font-size: 13px;
      }
      .site-footer {
        padding: 24px;
        display: block;
        margin-top: 55px;
      }
      .site-footer > a {
        display: block;
        margin-top: 10px;
      }
      .page-heading,
      .about-page {
        padding-top: 42px;
      }
      .page-heading h1,
      .about-page h1 {
        font-size: 28px;
      }
      .reading-layout {
        padding-top: 24px;
      }
      .article-header h1 {
        font-size: 27px;
      }
      .personal-blog .notion {
        font-size: 15px;
      }
      .article-end {
        display: block;
      }
      .article-end a {
        display: block;
        margin-top: 12px;
      }
      .search-form button {
        padding: 10px 16px;
      }
    }
  `}</style>
)
