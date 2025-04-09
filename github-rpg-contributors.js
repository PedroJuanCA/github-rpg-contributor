import { LitElement, html, css } from 'lit';
import '@haxtheweb/rpg-character/rpg-character.js';

export class GithubRpgContributors extends LitElement {
  static properties = {
    organization: { type: String },
    repo: { type: String },
    limit: { type: Number },
    allContributors: { type: Array },
    visibleCount: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    .repo-link {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 1rem;
      color: #555;
    }

    .repo-link a {
      text-decoration: none;
      color: #0366d6;
    }

    .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
    }

    .card {
      text-align: center;
      background: white;
      border-radius: 10px;
      padding: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    rpg-character {
      height: 100px;
      width: 100px;
      transition: transform 0.3s ease;
    }

    .card:hover rpg-character {
      transform: scale(1.1);
    }

    .username {
      font-size: 0.95rem;
      margin-top: 0.4rem;
      font-weight: 600;
    }

    .contribs {
      font-size: 0.85rem;
      color: #777;
    }

    .show-more {
      margin-top: 1rem;
      text-align: center;
    }

    .show-more button {
      background-color: #0366d6;
      color: white;
      border: none;
      padding: 0.5rem 1.2rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1rem;
    }

    .show-more button:hover {
      background-color: #024f9f;
    }
  `;

  constructor() {
    super();
    this.organization = '';
    this.repo = '';
    this.limit = 10;
    this.allContributors = [];
    this.visibleCount = 0;
  }

  updated(changedProps) {
    if (changedProps.has('organization') || changedProps.has('repo')) {
      this.fetchContributors();
    }
  }

  async fetchContributors() {
    if (!this.organization || !this.repo) return;

    const url = `https://api.github.com/repos/${this.organization}/${this.repo}/contributors`;

    try {
      const res = await fetch(url, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      });

      const data = await res.json();
      console.log('Fetched data:', data);

      if (!Array.isArray(data)) {
        this.allContributors = [];
        this.visibleCount = 0;
        return;
      }

      this.allContributors = data;
      this.visibleCount = Math.min(this.limit, data.length);
    } catch (err) {
      console.error('Fetch failed:', err);
      this.allContributors = [];
      this.visibleCount = 0;
    }
  }

  showMore() {
    this.visibleCount = Math.min(this.visibleCount + 5, this.allContributors.length);
  }

  render() {
    const visibleContributors = this.allContributors.slice(0, this.visibleCount);

    return html`
      <div class="repo-link">
        <a href="https://github.com/${this.organization}/${this.repo}" target="_blank">
          ${this.organization}/${this.repo}
        </a>
      </div>
      <div class="container">
        ${visibleContributors.map(
          (user) => html`
            <div class="card">
              <a href="${user.html_url}" target="_blank">
                <rpg-character seed="${user.login}"></rpg-character>
                <div class="username">${user.login}</div>
                <div class="contribs">Contribs: ${user.contributions}</div>
              </a>
            </div>
          `
        )}
      </div>

      ${this.visibleCount < this.allContributors.length
        ? html`
            <div class="show-more">
              <button @click="${this.showMore}">Show More</button>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('github-rpg-contributors', GithubRpgContributors);