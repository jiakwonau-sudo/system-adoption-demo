# System Adoption Demo

Client-facing showroom for a solo AI-enabled system-adoption service.

## V2 UX principle
The marketing/showroom **Shell** and the interactive **Live Training Lab** are deliberately separate layers.

- Warm editorial showroom = business problem, offer and deliverables
- Dark browser-framed training lab = learner product experience
- Enter full-screen lab / Exit lab makes the boundary explicit
- Mobile layout preserves the same separation

## Demo scope
- Role: Service Coordinator
- Context: fictional WA industrial field-service company
- Workflows: Create Service Job → Assign Technician → Close Service Job
- Modes: Guided / Practice / Assessment
- All names, systems and records are fictional demo data

## Deployment
Static HTML/CSS/JS for GitHub Pages.

## V3 Flagship Prototype

**System Adoption OS** prototype showing the intended magic moment:

1. Observe an approved browser workflow
2. Convert actions into a Work Graph / Preferred Path
3. Generate a separate Training Twin
4. Run Guided / Practice / Assessment
5. Measure role readiness
6. Simulate system change and identify stale learning assets

V3 uses a **fictional client sandbox and synthetic data**. It is a product-vision prototype, not proof of live customer-system capture yet.

Live prototype: https://jiakwonau-sudo.github.io/system-adoption-demo/v3/


## V4 Commercial Field Service Training Twin

V4 is the delivery-grade benchmark demo built from the current Microsoft Dynamics 365 Field Service operating model.

It uses **original UI design** while preserving documented workflow semantics such as:
- Work orders and incident types
- Customer accounts, functional locations and assets
- Schedule Board / Schedule Assistant / resource matching
- Booking lifecycle and timestamps
- Frontline mobile execution
- Service tasks, inspections, products, services and evidence
- Work-order completion, posting, invoices and actuals
- Agreements / preventative maintenance
- Warehouses, truck stock, transfers, RMA / RTV
- IoT-alert-to-work-order flow
- Role readiness and Guided / Practice / Assessment modes

Commercial V4:
https://jiakwonau-sudo.github.io/system-adoption-demo/v4/

Benchmark source:
benchmarks/d365-field-service-feature-map-2026.md

Scope note:
V4 is a high-fidelity **training twin benchmark with synthetic data**, not a pixel/design clone of Microsoft Dynamics 365 Field Service and not yet proof of live customer-tenant capture.
