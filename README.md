# LLM Skills

Public home for Blake Oxford's open-source agent skills.

## Included skills

- `section-review` — a first-principles, truth-seeking review skill for evaluating a product section or workflow.

This repository intentionally publishes only one ICCI-originated skill: `section-review`.

## Repository layout

```text
llm-skills/
└── skills/
    └── section-review/
        ├── SKILL.md
        └── references/
```

## Install for GitHub Copilot CLI

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
mkdir -p ~/.copilot/skills
rsync -a ~/Documents/GitHub/llm-skills/skills/section-review/ ~/.copilot/skills/section-review/
```

Start a new Copilot session after installing or updating the skill so it gets picked up.

## Usage

Invoke the skill by asking Copilot for a section review, for example:

- `Review the onboarding flow.`
- `Give me a blunt review of the settings page.`
- `Rate the search workflow and tell me what should be cut.`

## Updating

```bash
cd ~/Documents/GitHub/llm-skills
git pull
rsync -a ~/Documents/GitHub/llm-skills/skills/section-review/ ~/.copilot/skills/section-review/
```

Then start a new Copilot session.
