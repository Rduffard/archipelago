> Historical design material: Core Checks and ranked Specialties are retired. See [current Training rules](../training.md) for implemented behavior. Path progression proposals here are not implemented.

# Training Page Flow Diagram

```mermaid
flowchart LR
  A["System Blueprint"] --> B["Core Check Registry"]
  A --> C["Specialty Registry"]
  B --> D["Core Training Rows"]
  C --> E["Specialty Rows"]
  F["Character Progression"] --> D
  F --> E
  D --> G["Saved checks + coreCheckInvestments"]
  E --> H["Saved specialty id/rank state"]
```

Core Training shows formulas and values. Specialty Training shows mastery state and lazy detail.
