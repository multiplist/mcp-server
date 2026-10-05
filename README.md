# @multiplist/mcp-server

> **Sovereign AI Conversation Vault, 8-Category Epistemic Extraction & Continuous Workspaces**  
> Connect Claude Desktop, Claude Code, Cursor, Antigravity IDE, and frontier LLMs directly to your private Multiplist brain.

[![npm version](https://img.shields.io/npm/v/@multiplist/mcp-server.svg)](https://www.npmjs.com/package/@multiplist/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Spec](https://img.shields.io/badge/MCP-2025--12--11-green.svg)](https://modelcontextprotocol.io)

---

## 🌟 What is Multiplist?

Your AI conversations are high-density intellectual property. Most memory tools save flat markdown text or generic summaries. Multiplist treats your thinking as structured capital:

1. **8 Canonical Categories of Meaning:** Automatically mines conversations for decisions, frameworks, golden passages, definitions, actions, questions, offers, and emergence.
2. **Exact Provenance:** Every claim, decision, and model traces back to exact line and character boundaries in your source conversations (`[Seed <uuid>]`).
3. **Continuous Workspaces:** Tactile Bento containers, studio desks, 5-lane progression boards (`📥 Intake` ➔ `⚡ Doing` ➔ `⏸️ Needs Context` ➔ `👁️ Review` ➔ `🚢 Shipped`), and card graduation.
4. **Sovereign Local Silicon:** Free BYOK integration for local Ollama models (`list_local_models`, `query_local_model`) at $0 third-party compute.
5. **Zero Data Custody:** Transcripts and extractions write directly into your private Multiplist vault.

---

## 🚀 Quickstart

### 1. Claude Desktop (stdio Proxy)

Add Multiplist to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "multiplist": {
      "command": "npx",
      "args": ["-y", "@multiplist/mcp-server@latest"],
      "env": {
        "MULTIPLIST_MCP_TOKEN": "mcp_live_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

> 🔑 **Get your MCP Token:** Log in to [multiplist.ai](https://multiplist.ai) ➔ **Settings** ➔ **MCP Tokens** ➔ Generate a live token (prefix `mcp_live_`).

### 2. Direct Hosted StreamableHTTP

For remote agents or clients supporting StreamableHTTP:

```json
{
  "mcpServers": {
    "multiplist": {
      "url": "https://multiplist.ai/mcp",
      "headers": {
        "x-mcp-key": "mcp_live_YOUR_TOKEN_HERE"
      }
    }
  }
}
```

---

## 🛠️ 71 Canonical Tools Across 4 Tiers

Multiplist features progressive tool disclosure matching your provisioned workspace tier:

| Tier | Price | Tools | Capabilities |
| :--- | :--- | :--- | :--- |
| **Core** | Free / BYOK | **12** | Single-source capture, extraction, epistemic search, discovery, local silicon |
| **Plus** | $19/mo | **48** | Bento workspaces, studios, decks, lanes, cards, folders, custom skills, marginalia |
| **Pro** | $49/mo | **6** | Autonomous agent runways, desk state, autonomy audit logs, production deliverables |
| **Realm** | $149/mo | **5** | Sovereign realm mesh, cross-realm sharing, domain isolation |

### 🟢 Core Tools (12 Free / BYOK)
- `create_source`: Save a conversation, document, or transcript to the vault with automatic extraction.
- `update_source`: Append or update saved conversations with incremental extraction.
- `delete_source`: Soft-delete a source while preserving extracted seed provenance.
- `trigger_extraction`: Run single-source extraction across the 8 canonical categories.
- `get_source`: Retrieve a complete source with its abstract, seeds, and character citations.
- `search_vault`: Semantic recall for extracted seeds across all conversations.
- `search_sources`: Browse the catalog of sources by title, date, or keyword.
- `get_vault_summary`: Vault-wide overview of sources, seed counts, and category clusters.
- `get_vault_gaps`: Surface unextracted areas, sparse categories, and missing knowledge.
- `get_capabilities`: Session orientation and progressive disclosure introspection.
- `list_local_models`: Discover locally available Ollama models at $0 compute.
- `query_local_model`: Execute zero-cost local LLM inference against local models.

### 🔵 Plus Tools (48 Workspace Tools)
- **Spatial Workstations:** `compose_workspace`, `resolve_workspace`, `list_containers`, `create_container`, `update_container`, `delete_container`, `get_container`, `get_container_structure`, `get_container_stats`
- **Studios & Pins:** `list_studios`, `create_studio`, `update_studio`, `delete_studio`, `get_deck_state`, `pin_source`, `unpin_source`, `list_pins`
- **Decks, Lanes & Cards:** `list_lanes`, `create_lane`, `update_lane`, `delete_lane`, `get_lane_contents`, `list_cards`, `get_card`, `create_card`, `update_card`, `move_card`, `delete_card`, `graduate_card`
- **Research & Folders:** `request_brief`, `get_brief_status`, `create_vault_folder`, `delete_vault_folder`, `rename_vault_folder`, `add_sources_to_folder`, `remove_source_from_folder`, `batch_extract`, `batch_status`
- **Custom Domain Skills:** `create_skill`, `list_skills`, `get_skill`, `match_skills`, `update_skill`, `delete_skill`
- **Living Marginalia & Assets:** `add_annotation`, `add_marginalia`, `list_source_assets`, `rescue_excerpt`

### 🟣 Pro Tools (6 Autonomy Tools)
- `scaffold_agent_runway`: Scaffold autonomous agent runways and 5-lane pipelines in a studio.
- `get_desk_state`: Inspect active desk cards, agent configs, and tool bouquets.
- `query_agent_log`: Audit autonomous agent execution history and tool invocations.
- `list_production_skills`: Discover Assemblist production deliverable templates.
- `produce_deliverable`: Generate holographic capsules, executive briefs, and deliverables.
- `get_context`: Fetch full context capsule snapshots for high-reasoning tasks.

### 🌐 Realm Tools (5 Mesh Tools)
- `list_realms`, `get_current_realm`, `switch_realm`, `share_source_to_realm`, `move_source_to_realm`: Sovereign domain isolation and zero-token cross-vault asset sharing.

---

## 💬 18 Interactive MCP Prompts

Multiplist exports 18 interactive prompt templates with typed arguments for 1-click execution in Claude Desktop, Cursor, and any MCP host:

| Category | Prompt | Arguments | Description |
| :--- | :--- | :--- | :--- |
| **Core Flow** | `/save-conversation` | — | Save current session to vault with automatic 8-category extraction |
| | `/show-seed-doc` | — | Render full structured Seed Doc of current conversation |
| **Extraction** | `/show-decisions` | `topic?` | Recall locked decisions with exact source provenance |
| | `/show-frameworks` | `topic?` | Surface mental models and structured frameworks |
| | `/show-golden-passages` | `topic?` | Find memorable verbatim insights and quotes |
| | `/show-definitions` | `term?` | Recall defined terms and coinages across past sessions |
| | `/show-actions` | `topic?` | Find open tasks, commitments, and follow-ups |
| | `/show-questions` | `topic?` | Surface unresolved inquiries and open loops |
| | `/show-offers` | `topic?` | Recall action opportunities and invitations |
| | `/show-emergence` | `topic?` | Discover nascent patterns forming across topics |
| **Research** | `/research-topic` | `topic` (req) | Synthesize a multi-source citable research document |
| | `/browse-recent` | `timeframe?` | Browse recently saved sources by time horizon |
| | `/vault-summary` | — | Full high-level overview of vault landscape & coverage |
| **Workspaces** | `/compose-workspace` | `goal` (req) | Talk a complete container, studios, and lanes into being |
| | `/desk-orientation` | `studio` (req) | Inspect desk state, resident agent, tool bouquet & active cards |
| | `/scaffold-runway` | `studio` (req) | Scaffold canonical 5-lane agent runway for a studio |
| **Marginalia** | `/add-marginalia` | `source`, `note` (req) | Attach commentary, corrections, or tension flags with scribe provenance |
| **Local Silicon** | `/query-local-model` | `prompt` (req), `model?` | Run zero-cost local inference on Apple Silicon via Ollama |

---

## 🧬 Provenance & 8 Canonical Categories

When you save content, Multiplist extracts 8 canonical categories:
- **Decisions:** Commitments made, positions locked, rationale cited.
- **Frameworks:** Mental models, named structures, repeatable systems.
- **Golden Passages:** Key quotes and phrasing worth preserving verbatim.
- **Definitions:** Terminology and domain definitions established in context.
- **Actions:** Concrete deliverables and commitments with owners.
- **Questions:** Unresolved inquiry vectors and deliberate open loops.
- **Offers:** High-leverage candidate actions and propositions.
- **Emergence:** Nascent concepts forming in dialogue.

---

## 📜 Public Discovery & Directory Specifications

- **Hosted Server Card:** `https://multiplist.ai/.well-known/mcp/server-card.json`
- **Glama Manifest:** `glama.json` (root)
- **MCP Registry Manifest:** `server.json` (root)
- **Smithery Registry:** `@multiplist/mcp-server`

---

## 📄 License

MIT © [Multiplist](https://multiplist.ai) & Mystic Quarterly
