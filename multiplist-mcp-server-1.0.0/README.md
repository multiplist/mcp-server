# @multiplist/mcp-server

**IP Vault with Citations** — extract decisions, frameworks, and insights
from your AI conversations with full provenance. Every claim traces back
to exactly what you said.

Your AI conversations are intellectual property. Multiplist treats them
that way.

## Connect via MCP

Multiplist works as an MCP server. Connect from Claude Desktop,
Claude Code, or any MCP-compatible client.

**Endpoint:** `https://multiplist.ai/mcp`
**Transport:** StreamableHTTP + OAuth 2.1 with PKCE

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "multiplist": {
      "command": "npx",
      "args": ["-y", "@multiplist/mcp-server"],
      "env": {
        "MULTIPLIST_API_KEY": "your-key-here"
      }
    }
  }
}
```

Or connect directly via the hosted endpoint:

```json
{
  "mcpServers": {
    "multiplist": {
      "type": "streamable-http",
      "url": "https://multiplist.ai/mcp"
    }
  }
}
```

## 19 Curated Tools

| Category | Tools | What They Do |
|----------|-------|--------------|
| **Capture** | create_source, update_source, delete_source | Save conversations to your vault |
| **Extraction** | trigger_extraction, batch_extract, batch_status | Extract structured meaning |
| **Custom Skills** | create_skill, list_skills, get_skill, match_skills | Define domain-specific extraction |
| **Discovery** | get_source, search_vault, search_sources, get_vault_summary, get_vault_gaps | Search and retrieve with citations |
| **Research** | request_brief, get_brief_status | Synthesize across your vault |
| **Annotate** | add_annotation, add_marginalia | Write corrections and evolution notes |

## What Multiplist Extracts

Nine categories of structured meaning from any conversation or document:

- **Decisions** — commitments, with reasoning
- **Frameworks** — named models and structured approaches
- **Actions** — next steps, with ownership
- **Questions** — open threads and unresolved tensions
- **Definitions** — terms with precise meaning in context
- **Emergence** — new concepts forming in real time
- **Golden Passages** — language worth preserving verbatim
- **Exemplars** — concrete examples worth referencing later
- **Offers** — AI suggestions and proposed next steps

Each seed traces back to exact character positions in the original source.

## Custom Extraction Skills

The differentiator: you define what matters in your domain.

A coach creates a "Client Breakthroughs" skill.
A developer creates an "Architecture Signals" skill.
A researcher creates a "Research Distillation" skill.

Skills tell Multiplist what to look for in your specific content type.
The vault learns the shape of your work.

## Get Started

1. Sign up at [multiplist.ai](https://multiplist.ai)
2. Generate an API key in Settings
3. Connect via MCP (see above)
4. Say "save this conversation to my vault"

## Skills Library

See [github.com/multiplist/skills](https://github.com/multiplist/skills)
for pre-built skills and the Seed Doc Renderer, Archivist Research,
and Custom Extraction Skills integrations.

## License

MIT — [multiplist.ai](https://multiplist.ai)
