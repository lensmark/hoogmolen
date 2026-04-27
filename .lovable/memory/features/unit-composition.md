---
name: Unit composition rules
description: Hoe vakantiewoningen samengesteld zijn uit modules (Watermolen, Peerdermolen, duplexen A1-A6) — bepaalt foto-bindingen en gallery-aggregatie
type: feature
---

# Unit-compositie Landgoed De Hoogmolen

De 7 verhuurformules zijn opgebouwd uit **modules** die gecombineerd worden.
Foto's van de modules verschijnen automatisch ook op de samengestelde formules.

## Atomaire modules (basis)
- **Watermolen** — losse vakantiewoning
- **Peerdermolen** — losse vakantiewoning
- **Duplexsuites A1-A6** — 6 individuele suites in de A-vleugel
  - A1 De Fries, A2 De Fjord, A3 De Brabander, A4 De Draver, A5 De Shetlander, A6 De Jutlander
- **Molenhuys** — gemeenschappelijke ontspanningsruimte (geen slaapplaats)

## Samengestelde formules

| Formule | = | Modules |
|---|---|---|
| **Watermolen** | = | Watermolen |
| **Peerdermolen** | = | Peerdermolen |
| **Watermolen Plus** | = | Watermolen + A5 + A6 |
| **Peerdermolen Plus** | = | Peerdermolen + A5 + A6 |
| **Volmolen** | = | Watermolen + Peerdermolen |
| **Volmolen Plus** | = | Watermolen + Peerdermolen + A5 + A6 |
| **Landgoed De Hoogmolen** | = | Watermolen + Peerdermolen + A1 + A2 + A3 + A4 + A5 + A6 |

## Implicaties voor foto-binding

Een gallery voor een samengestelde formule moet automatisch foto's tonen van
**alle** onderliggende modules. Voorbeeld: `volmolen-plus` toont foto's met
locationId's:
- `hoogmolen-verblijf-watermolen*`
- `hoogmolen-verblijf-peerdermolen*`
- `hoogmolen-verblijf-duplexsuite-a5*`
- `hoogmolen-verblijf-duplexsuite-a6*`

Plus-formules krijgen daarnaast altijd toegang tot het **Molenhuys** —
foto's daarvan kunnen optioneel ook getoond worden in plus/landgoed-galleries.

## Bron
Bevestigd door eigenaar (chat 2026-04-24).
