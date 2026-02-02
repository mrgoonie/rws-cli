# rws-cli

Command-line interface for [ReviewWeb.site](https://reviewweb.site) API. Create website reviews, scrape content, extract data, get SEO insights, and more.

## Installation

```bash
npm install -g rws-cli
```

## Quick Start

```bash
# Set your API key (get one at https://reviewweb.site/profile)
rws config set api-key YOUR_API_KEY

# Check API health
rws health

# Create a website review
rws review create --url https://example.com

# Convert a URL to markdown
rws convert markdown --url https://example.com

# Get SEO keyword ideas
rws seo keyword-ideas --keyword "digital marketing"
```

## Authentication

The CLI resolves your API key in this order:

1. `--api-key` flag (highest priority)
2. `RWEB_API_KEY` environment variable
3. Config file (set via `rws config set api-key`)

```bash
# Option 1: Flag
rws review list --api-key YOUR_API_KEY

# Option 2: Environment variable
export RWEB_API_KEY=YOUR_API_KEY
rws review list

# Option 3: Config file (recommended)
rws config set api-key YOUR_API_KEY
rws review list
```

## Commands

### Review Management

```bash
rws review create --url <url> [--instructions <text>]
rws review get <id>
rws review list [--page 1] [--limit 10]
rws review update <id> [--url <url>] [--instructions <text>]
rws review delete <id>
```

### Content Conversion

```bash
rws convert markdown --url <url> [--model <model>]
rws convert markdown-batch --urls <url1,url2,url3>
```

### Data Extraction

```bash
rws extract data --url <url> --instructions <text> --template <json>
```

### Web Scraping

```bash
rws scrape url --url <url>
rws scrape extract --url <url> [--type all|web|image|file]
```

### Content Summarization

```bash
rws summarize url --url <url> [--model <model>]
rws summarize website --url <url> [--max-links 10]
```

### SEO Insights

```bash
rws seo backlinks --domain <domain>
rws seo keyword-ideas --keyword <keyword> [--country us]
rws seo keyword-difficulty --keyword <keyword>
rws seo traffic --domain <domain> [--mode subdomains]
```

### Utilities

```bash
rws screenshot --url <url>
rws url-check --url <url>
rws profile
rws health
```

### API Key Management

```bash
rws api-key create --name <name>
rws api-key list
rws api-key delete <id>
```

### Configuration

```bash
rws config set api-key <key>
rws config set base-url <url>
rws config set default-format <json|table|raw>
rws config get <key>
rws config list
rws config path
```

## Output Formats

All commands support `--format` flag:

```bash
# JSON (default, great for piping)
rws review list --format json | jq '.reviews[0]'

# Table (human-readable)
rws review list --format table

# Raw (minimal processing)
rws convert markdown --url example.com --format raw > page.md
```

## Shell Completions

```bash
# Bash
rws completion bash > /etc/bash_completion.d/rws

# Zsh
rws completion zsh > ~/.zsh/completions/_rws

# Fish
rws completion fish > ~/.config/fish/completions/rws.fish
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RWEB_API_KEY` | API key for authentication |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication error |

## API Documentation

Full API documentation: https://reviewweb.site/api-docs/

## License

MIT
