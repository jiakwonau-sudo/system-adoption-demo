# Dynamics 365 Field Service — Delivery Feature Benchmark 2026

Status: Current Microsoft Learn benchmark for a **commercial training-twin prototype**.
Date: 2026-09-28
Scope: Delivery-relevant feature surface, roles, lifecycle, workflows and training scenarios. This is **not** a pixel/design clone of Dynamics 365 Field Service.

## Product capabilities to model

### 1. Customer and service context
- Customer accounts / service accounts
- Billing account
- Service address / location
- Service territory
- Price list
- Tax handling
- Travel charge type
- Work order instructions
- Contacts
- Functional locations / site hierarchy

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/accounts
- https://learn.microsoft.com/en-us/dynamics365/field-service/functional-locations

### 2. Customer assets
- Primary customer asset
- Asset hierarchy / subassets
- Asset location
- Asset service history
- Asset linkage to incidents, products, services and service tasks
- Barcode-supported field identification on mobile
- Asset conversion from used work-order products where configured

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/service-history
- https://learn.microsoft.com/en-us/dynamics365/field-service/mobile/get-work-done-mobile-app
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status

### 3. Work orders
- Work order type
- System status lifecycle
- Substatus
- Service account / optional account context depending on work order type
- Primary incident
- Primary asset
- Territory
- Price list
- Taxable
- Instructions
- Service tasks
- Products
- Services
- Knowledge/reference material
- Timeline / notes / attachments
- Multiple incidents
- Multiple bookings
- Follow-up activity
- Posting / billing

Typical system statuses:
- Unscheduled
- Scheduled
- In Progress
- Completed
- Posted
- Canceled

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/create-work-order
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-experience
- https://learn.microsoft.com/en-us/dynamics365/field-service/post-work-order-invoice

### 4. Work order types
- General category such as installation / preventative maintenance / inspection / repair
- Incident-type requirement setting
- Service-account requirement setting
- Default price-list behavior

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/create-work-order-types

### 5. Incident types
- Reusable work-order templates
- Products
- Services
- Service tasks
- Characteristics / required skills
- Resolutions
- Knowledge articles
- Duration auto-calculation
- Resource-requirement characteristics
- Multiple incidents on one work order
- Asset-specific incident/service history

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/incident-type-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/configure-incident-types

### 6. Scheduling and dispatch
- Resource Requirement generated from work
- Schedule Board
- Requirement pane
- Resource list
- Manual drag/drop booking
- Schedule Assistant
- Availability
- Work hours
- Location
- Travel-time estimate
- Characteristics / skills
- Territories
- Resource types
- Time windows
- Booking create / reassign / reschedule
- Quick scheduling
- Resource Scheduling Optimization add-in
- Scheduling Operations Agent (preview)

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-with-schedule-board
- https://learn.microsoft.com/en-us/dynamics365/field-service/schedule-assistant
- https://learn.microsoft.com/en-us/dynamics365/field-service/scheduling-resource-types
- https://learn.microsoft.com/en-us/dynamics365/field-service/universal-resource-scheduling-for-field-service
- https://learn.microsoft.com/en-us/dynamics365/field-service/rso-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/soa-overview

### 7. Resource model
Resource types:
- User
- Account / Contact
- Equipment
- Facility
- Crew
- Pool

Scheduling attributes:
- Work hours
- Characteristics
- Categories
- Territories
- Location

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/scheduling-resource-types

### 8. Booking lifecycle
Out-of-box booking statuses include:
- Scheduled
- Traveling
- In Progress
- On Break
- Completed
- Canceled

Status changes can:
- create timestamps
- influence related work-order status
- update Actual Arrival Time / Started On / Completed On
- create travel charge behavior
- drive time entries / booking journals
- complete or return a work order for follow-up depending on booking-status configuration

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status
- https://learn.microsoft.com/en-us/dynamics365/field-service/booking-timestamps
- https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-time-entry

### 9. Frontline mobile execution
Technician experience includes:
- Assigned bookings
- Customer/location context
- Directions / map context
- Work order details
- Service tasks
- Products
- Services
- Inspections
- Notes
- Photos / audio / video attachments
- Timeline/history
- Customer assets / asset hierarchy
- Barcode scanning where configured
- Booking-status updates
- Offline capability through mobile offline profile
- Sync status / refresh

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/mobile/get-work-done-mobile-app
- https://learn.microsoft.com/en-us/dynamics365/field-service/mobile/set-up-offline-profile
- https://learn.microsoft.com/en-us/dynamics365/field-service/mobile/work-offline

### 10. Inspections
- Inspection templates
- Publish/revise
- Service-task association
- Mobile completion
- Offline support
- Asset association / inspection history
- Branching / conditional logic
- Make page/question visible
- Make required
- Skip to question
- Copilot-assisted inspection creation from image/PDF (preview)

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/inspections-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/inspections-advanced
- https://learn.microsoft.com/en-us/dynamics365/field-service/inspections-copilot

### 11. Products, services, tasks and financial execution
Products:
- Inventory / noninventory
- Estimated quantity
- Used quantity
- Line status
- Warehouse
- Price

Services:
- Estimated duration
- Actual / billable duration
- Line status
- Price

Tasks:
- Ordered checklist
- Estimated / actual duration
- Result
- Inspection / guide link

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-experience

### 12. Time and journals
- Booking timestamps
- Travel duration
- Working hours
- Break
- Overtime
- Business closure
- Automatic time entries from booking timestamps
- Manual time entries
- Time-off requests
- Actuals on posting

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/booking-timestamps
- https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-time-entry

### 13. Pricing and billing
- Price lists
- Price-list items
- Field Service price-list items
- Duration rounding
- Flat fees
- Minimum-charge duration
- Minimum-charge amount
- Territory relationships
- Billing-account price-list inheritance
- Work-order posting
- Invoice generation
- Actuals
- Quantity/Duration to Bill
- Travel charges

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/create-price-list
- https://learn.microsoft.com/en-us/dynamics365/field-service/post-work-order-invoice
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-status-booking-status

### 14. Inventory
- Warehouses
- Technician-truck warehouses
- Product Inventory
- Quantity Available
- Quantity Allocated
- Quantity on Hand
- Quantity on Order
- Inventory adjustment
- Transfer
- Purchase
- Used work-order products
- RMA / receipt
- RTV
- Return to warehouse
- Return to vendor
- Change asset ownership

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/create-warehouse
- https://learn.microsoft.com/en-us/dynamics365/field-service/inventory-purchasing-returns-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/process-return

### 15. Agreements / preventative maintenance
- Recurring work orders
- Recurring invoices
- Agreement booking setup
- Incident types in agreements
- Asset-specific recurring maintenance
- Preferred resource
- Auto-generate work orders
- Auto-generate/book
- Integration with Resource Scheduling Optimization
- Service-history continuity

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/agreements-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/service-history

### 16. Connected Field Service / IoT
- IoT devices / assets
- IoT alerts
- Alert → case/work order
- Device commands / properties
- Proactive / predictive service
- Dispatcher/technician workflow from IoT-triggered demand

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/connected-field-service-architecture
- https://learn.microsoft.com/en-us/dynamics365/field-service/cfs-iot-alerts

### 17. Security / personas
Roles:
- Field Service - Resource
- Field Service - Dispatcher
- Field Service - Administrator
- Field Service - Inventory Purchase
- IoT - Administrator
- IoT - Endpoint User

Schedule-board minimum table privileges include read/access to resources/requirements/settings and read/create/write for bookings.

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/security-permissions

## Commercial training-twin role catalogue

### Dispatcher / Service Coordinator
1. Create reactive work order
2. Apply incident type and verify generated tasks/products/services/skills
3. Add/verify customer asset and functional location
4. Review resource requirement
5. Schedule via Schedule Assistant
6. Schedule manually on Schedule Board
7. Reassign/reschedule booking
8. Handle cancellation / overrun / urgent job
9. Monitor booking statuses
10. Review completed work
11. Return work order to follow-up if more work is needed
12. Post completed work order where role/process allows

### Frontline Technician / Resource
1. Review assigned booking
2. Navigate to customer
3. Set Traveling
4. Set In Progress
5. Review customer / asset history
6. Complete ordered service tasks
7. Complete inspection with branching
8. Record parts used
9. Record service/labor duration
10. Add note / image / evidence
11. Update asset / barcode where configured
12. Put booking On Break / resume
13. Complete booking
14. Complete work order or flag follow-up
15. Work offline / sync

### Service Manager / Back Office
1. Review completed booking/work order
2. Validate products/services/time
3. Validate customer acceptance / evidence
4. Post work order
5. Review generated invoice
6. Review actuals / time / booking journals
7. Analyse service history / first-time fix / repeat issues

### Inventory Manager
1. Review warehouse/truck stock
2. Product inventory availability
3. Inventory adjustment
4. Transfer inventory
5. Purchase / receive
6. Process RMA receipt
7. Return to warehouse / vendor
8. Review used parts and inventory movements

### Agreement / Preventative Maintenance Manager
1. Create service agreement
2. Configure booking recurrence
3. Associate incident type / asset
4. Generate recurring work orders
5. Auto-book / manually schedule
6. Recurring billing
7. Review generated demand and service history

### Field Service Administrator
1. Work order types
2. Incident types
3. Service-task types
4. Inspection templates / versions / logic
5. Characteristics / skills
6. Territories
7. Bookable resources / work hours
8. Booking statuses
9. Price lists
10. Mobile offline profile
11. Security roles
12. Field Service settings

## V4 training scenarios

### Scenario A — Reactive break/fix: hydraulic power unit
Dispatcher creates work order for pressure-loss issue on a serialized HPU. Incident type populates tasks, product, service and required characteristic. Dispatcher books a hydraulics-qualified resource. Technician travels, starts work, completes tasks/inspection, uses a filter part, records labor, note and customer sign-off, then completes. Back office reviews and posts, triggering invoice/actuals.

### Scenario B — Preventative maintenance agreement
Monthly agreement generates a maintenance work order for a customer asset. It is scheduled to a preferred qualified resource and completed against an inspection checklist.

### Scenario C — IoT predictive maintenance
IoT alert on temperature/pressure anomaly is triaged and converted to a work order. Dispatcher schedules a resource with correct characteristic and territory.

### Scenario D — Inventory / return
Technician uses truck stock on a work order. Inventory drops. A defective component is returned via RMA and routed back to warehouse or vendor.

### Scenario E — Schedule disruption
Technician overruns current job; dispatcher reviews Schedule Board, moves lower-priority work, fills cancellation gap, and protects promised time windows.

## Design principle

The V4 Training Twin should use **original visual design** while preserving the real operating model, terminology, roles, status transitions and workflow semantics from the current Field Service documentation.



## Extended 2026 feature surface

### 18. Entitlements
- Dynamically apply price lists / discounts to work-order products and services
- Applicability can include service account, billing account, product/service, customer asset, asset category, incident type
- Affects price, not product/service cost

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-entitlements-overview

### 19. Warranties
- Warranty records for accounts, locations and customer assets
- Tracks coverage context for repair/replacement/service guarantees
- Provides service context; does not automatically change work-order pricing

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/warranties

### 20. Work order resolutions
- Standard resolution records
- Can be associated with incident types
- Support reporting and consistent issue-resolution capture

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-resolutions

### 21. Teams collaboration
- Connected Microsoft Teams chats linked to work orders
- Helps stakeholders collaborate without leaving Field Service
- Related chats can remain associated with the work-order context

Source:
- https://learn.microsoft.com/en-us/dynamics365/field-service/field-service-teams-collaboration

### 22. Copilot and AI features
Current Field Service AI surface includes:
- Work-order summaries
- Natural-language questions
- Mobile work-order update suggestions (preview)
- Inspection-template creation from images/PDFs (preview)
- Agent feed / supervision
- Form-fill assistance
- View filtering / charts / row summaries / timeline highlights

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/copilot-overview
- https://learn.microsoft.com/en-us/dynamics365/field-service/work-order-update
- https://learn.microsoft.com/en-us/dynamics365/field-service/use-work-order-recap

### 23. Financial controls / NTE context
- Work orders carry pricing/billing context
- Dynamics Field Service work-order data model includes price not-to-exceed proximity/overage fields
- Products/services can carry billable quantities/durations and entitlement references

Sources:
- https://learn.microsoft.com/en-us/dynamics365/field-service/developer/reference/entities/msdyn_workorder
- https://learn.microsoft.com/en-us/dynamics365/field-service/developer/reference/entities/msdyn_workorderservice

### Additional training workflows

#### Dispatcher / Manager
- Review warranty context before pricing/repair decision
- Review entitlement / discount applicability
- Record approved resolution
- Use work-order summary as context, not a substitute for full review
- Start/connect Teams collaboration around a work order

#### Frontline Technician
- Use Copilot mobile update preview to suggest booking/task/product/service updates, then review before confirming
- Select resolution / capture final issue resolution where configured

#### Administrator
- Configure entitlement applications
- Configure warranty coverage
- Configure summary fields / Copilot features
- Configure Teams collaboration
- Configure resolution records and incident-type mappings

