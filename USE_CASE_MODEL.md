# Restaurant Admin Use Case Model

This file captures the main actors and use cases for the Restaurant Admin project.

## Actors

* Administrator
* Anonymous User
* Public Guest
* System

## Use Cases

### Administrator

* Login
* Logout
* View Dashboard
* Export Dashboard Data
* Manage Reservations
* View Reservation Details
* Create Reservation
* Update Reservation Status
* Assign Table to Reservation
* Delete Reservation
* Bulk Delete Reservations
* Export Reservations
* Manage Tables
* Add Table
* Edit Table
* Delete Table
* Activate / Deactivate Table
* Manage Table Locations
* Add Table Location
* Edit Table Location
* Delete Table Location
* Manage Services
* View Services
* Add Service
* Edit Service
* Delete Service
* Export Services
* Manage Blocked Dates
* View Blocked Dates
* Block Date
* Bulk Block Dates
* Unblock Date
* Bulk Unblock Dates
* Export Blocked Dates
* Manage Calendar Planning
* View Calendar
* Navigate Calendar
* View Reservation Timeline
* Export Calendar Schedule
* Manage Reports
* View Reports
* Filter Reports
* Export Reports
* Manage Restaurant Settings
* View Restaurant Info
* Update Restaurant Info
* View Notification Settings
* Update Notification Settings
* View Working Hours
* Update Working Hours
* Save Settings
* Retrieve Current Profile
* Maintain Reservation Status

### Anonymous User

* Register
* Request Password Reset
* Reset Password
* Verify Email
* Resend Verification Email

### Public Guest

* Check Blocked Dates
* Check Available Time Slots
* Check Booking Availability

## Mermaid Use Case Diagram

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'primaryColor': '#f8f0e3', 'edgeLabelBackground':'#ffffff', 'actorBorder':'#9c6644', 'actorTextColor':'#423428', 'textColor':'#423428' }}}%%
usecaseDiagram

actor Administrator as Admin
actor "Anonymous User" as Anonymous
actor "Public Guest" as Guest
actor System

Admin --> (Login)
Admin --> (Logout)
Admin --> (View Dashboard)
Admin --> (Export Dashboard Data)
Admin --> (Manage Reservations)
Admin --> (Manage Tables)
Admin --> (Manage Services)
Admin --> (Manage Blocked Dates)
Admin --> (Manage Calendar Planning)
Admin --> (Manage Reports)
Admin --> (Manage Restaurant Settings)
Admin --> (Retrieve Current Profile)
Admin --> (Maintain Reservation Status)

Anonymous --> (Register)
Anonymous --> (Request Password Reset)
Anonymous --> (Reset Password)
Anonymous --> (Verify Email)
Anonymous --> (Resend Verification Email)

Guest --> (Check Blocked Dates)
Guest --> (Check Available Time Slots)
Guest --> (Check Booking Availability)

(View Dashboard) ..> (View Reservation Details) : includes
(Manage Reservations) ..> (View Reservation Details) : includes
(Manage Reservations) ..> (Create Reservation) : includes
(Manage Reservations) ..> (Update Reservation Status) : includes
(Manage Reservations) ..> (Assign Table to Reservation) : includes
(Manage Reservations) ..> (Delete Reservation) : includes
(Manage Reservations) ..> (Bulk Delete Reservations) : includes
(Manage Reservations) ..> (Export Reservations) : includes
(Manage Tables) ..> (Add Table) : includes
(Manage Tables) ..> (Edit Table) : includes
(Manage Tables) ..> (Delete Table) : includes
(Manage Tables) ..> (Activate / Deactivate Table) : includes
(Manage Tables) ..> (Manage Table Locations) : includes
(Manage Table Locations) ..> (Add Table Location) : includes
(Manage Table Locations) ..> (Edit Table Location) : includes
(Manage Table Locations) ..> (Delete Table Location) : includes
(Manage Services) ..> (View Services) : includes
(Manage Services) ..> (Add Service) : includes
(Manage Services) ..> (Edit Service) : includes
(Manage Services) ..> (Delete Service) : includes
(Manage Services) ..> (Export Services) : includes
(Manage Blocked Dates) ..> (View Blocked Dates) : includes
(Manage Blocked Dates) ..> (Block Date) : includes
(Manage Blocked Dates) ..> (Bulk Block Dates) : includes
(Manage Blocked Dates) ..> (Unblock Date) : includes
(Manage Blocked Dates) ..> (Bulk Unblock Dates) : includes
(Manage Blocked Dates) ..> (Export Blocked Dates) : includes
(Manage Calendar Planning) ..> (View Calendar) : includes
(Manage Calendar Planning) ..> (Navigate Calendar) : includes
(Manage Calendar Planning) ..> (View Reservation Timeline) : includes
(Manage Calendar Planning) ..> (Export Calendar Schedule) : includes
(Manage Reports) ..> (View Reports) : includes
(Manage Reports) ..> (Filter Reports) : includes
(Manage Reports) ..> (Export Reports) : includes
(Manage Restaurant Settings) ..> (View Restaurant Info) : includes
(Manage Restaurant Settings) ..> (Update Restaurant Info) : includes
(Manage Restaurant Settings) ..> (View Notification Settings) : includes
(Manage Restaurant Settings) ..> (Update Notification Settings) : includes
(Manage Restaurant Settings) ..> (View Working Hours) : includes
(Manage Restaurant Settings) ..> (Update Working Hours) : includes
```

## Notes

- This diagram is designed to be easy to render in Mermaid-compatible editors.
- Use a Mermaid live editor or markdown preview to visualize it.
