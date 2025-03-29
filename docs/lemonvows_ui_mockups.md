# LemonVows UI Mockups

## Overview

This document contains user interface mockups for the LemonVows wedding planning application. These mockups visualize the key screens and components of the application across different user roles.

## Login & Authentication Screens

### 1. Main Login Screen

```
+-------------------------------------------------------+
|                                                       |
|                    LemonVows                          |
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |               [Logo Image]                ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  | Email                                     ||    |
|  |  | +---------------------------------------+ ||    |
|  |  | |                                       | ||    |
|  |  | +---------------------------------------+ ||    |
|  |  |                                           ||    |
|  |  | Password                                  ||    |
|  |  | +---------------------------------------+ ||    |
|  |  | |                                       | ||    |
|  |  | +---------------------------------------+ ||    |
|  |  |                                           ||    |
|  |  | [Remember me] Forgot password?            ||    |
|  |  |                                           ||    |
|  |  | +---------------------------------------+ ||    |
|  |  | |               Log In                  | ||    |
|  |  | +---------------------------------------+ ||    |
|  |  |                                           ||    |
|  |  | Don't have an account? Sign up            ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

### 2. RSVP Code Entry Screen

```
+-------------------------------------------------------+
|                                                       |
|                    LemonVows                          |
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |               [Logo Image]                ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |  Enter your RSVP code to respond to the   ||    |
|  |  |  wedding invitation                       ||    |
|  |  |                                           ||    |
|  |  |  RSVP Code                                ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  |                                   |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  |           Continue                |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

## Couple Dashboard Screens

### 1. Main Dashboard

```
+-------------------------------------------------------+
| LemonVows                                [User ▼]     |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Dashboard                                       |
|-----+                                                 |
| ◆ Dashboard    +-----------------------------------+  |
| ○ Guests       | Wedding Overview                  |  |
| ○ Tables       +-----------------------------------+  |
| ○ Menu         |                                   |  |
| ○ Statistics   | Wedding Date: June 15, 2025       |  |
| ○ Settings     | Location: Grand Hotel             |  |
|                | Style: Elegant                     |  |
|                | RSVP Deadline: May 1, 2025        |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-------------------+  +---------------------+    |
|     | RSVP Status       |  | Tasks               |    |
|     +-------------------+  +---------------------+    |
|     |                   |  |                     |    |
|     | Accepted: 45      |  | ☑ Send invitations  |    |
|     | Declined: 12      |  | ☐ Finalize menu     |    |
|     | Pending: 23       |  | ☐ Complete seating  |    |
|     |                   |  | ☐ Confirm vendors   |    |
|     | [View Details]    |  |                     |    |
|     |                   |  | [View All Tasks]    |    |
|     +-------------------+  +---------------------+    |
|                                                       |
|     +-------------------+  +---------------------+    |
|     | Recent Activity   |  | Quick Actions       |    |
|     +-------------------+  +---------------------+    |
|     |                   |  |                     |    |
|     | • John Smith      |  | [+ Add Guest]       |    |
|     |   accepted        |  |                     |    |
|     | • Mary Johnson    |  | [✉ Send Reminder]   |    |
|     |   declined        |  |                     |    |
|     | • Table #3 added  |  | [↓ Export Data]     |    |
|     |                   |  |                     |    |
|     +-------------------+  +---------------------+    |
|                                                       |
+-------------------------------------------------------+
```

### 2. Guest Management Screen

```
+-------------------------------------------------------+
| LemonVows                                [User ▼]     |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Guests                                          |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ◆ Guests       | Guest List                [+ Add] |  |
| ○ Tables       +-----------------------------------+  |
| ○ Menu         |                                   |  |
| ○ Statistics   | [Search...]    [Filter ▼] [Sort ▼]|  |
| ○ Settings     |                                   |  |
|                | +-------------------------------+ |  |
|                | | Name         | RSVP | Group   | |  |
|                | +-------------------------------+ |  |
|                | | John Smith   | ✓    | Family  | |  |
|                | | Mary Johnson | ✗    | Friends | |  |
|                | | David Lee    | ?    | Work    | |  |
|                | | Sarah Wilson | ✓    | Family  | |  |
|                | | ...          | ...  | ...     | |  |
|                | +-------------------------------+ |  |
|                |                                   |  |
|                | [◀ Previous]  1 2 3 ...  [Next ▶] |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | Actions                           |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | [✉ Send Invitations]              |             |
|     |                                   |             |
|     | [↓ Export Guest List]             |             |
|     |                                   |             |
|     | [✓ Mark Selected as Sent]         |             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

### 3. Table Planning Screen

```
+-------------------------------------------------------+
| LemonVows                                [User ▼]     |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Tables                                          |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ○ Guests       | Table Layout               [+ Add]|  |
| ◆ Tables       +-----------------------------------+  |
| ○ Menu         |                                   |  |
| ○ Statistics   |  +--+     +--+     +--+     +--+  |  |
| ○ Settings     |  |1 |     |2 |     |3 |     |4 |  |  |
|                |  +--+     +--+     +--+     +--+  |  |
|                |                                   |  |
|                |  +--+              +--+     +--+  |  |
|                |  |5 |              |6 |     |7 |  |  |
|                |  +--+              +--+     +--+  |  |
|                |                                   |  |
|                |        +--------+                 |  |
|                |        |  Head  |                 |  |
|                |        | Table  |                 |  |
|                |        +--------+                 |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | Unassigned Guests (15)           |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | • John Smith                      |             |
|     | • Mary Johnson                    |             |
|     | • David Lee                       |             |
|     | • Sarah Wilson                    |             |
|     | • ...                             |             |
|     |                                   |             |
|     | [Drag guests to assign tables]    |             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

### 4. Menu Management Screen

```
+-------------------------------------------------------+
| LemonVows                                [User ▼]     |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Menu                                            |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ○ Guests       | Menu Options              [+ Add] |  |
| ○ Tables       +-----------------------------------+  |
| ◆ Menu         |                                   |  |
| ○ Statistics   | [Starters] [Main Course] [Dessert]|  |
| ○ Settings     |                                   |  |
|                | +-------------------------------+ |  |
|                | | Option        | Dietary      | |  |
|                | +-------------------------------+ |  |
|                | | Tomato Soup   | Vegetarian   | |  |
|                | | Prawn Cocktail|              | |  |
|                | | Caesar Salad  | Gluten-free  | |  |
|                | | ...           | ...          | |  |
|                | +-------------------------------+ |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | Dietary Requirements Summary      |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | Vegetarian: 12                    |             |
|     | Vegan: 5                          |             |
|     | Gluten-free: 8                    |             |
|     | Dairy-free: 6                     |             |
|     | Allergies: 10                     |             |
|     |                                   |             |
|     | [View Detailed Breakdown]         |             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

### 5. Statistics Dashboard Screen

```
+-------------------------------------------------------+
| LemonVows                                [User ▼]     |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Statistics                                      |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ○ Guests       | RSVP Summary                      |  |
| ○ Tables       +-----------------------------------+  |
| ○ Menu         |                                   |  |
| ◆ Statistics   | +-------+  +-------+  +-------+   |  |
| ○ Settings     | |       |  |       |  |       |   |  |
|                | |  45   |  |  12   |  |  23   |   |  |
|                | |Accept |  |Decline|  |Pending|   |  |
|                | +-------+  +-------+  +-------+   |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | Response Timeline                 |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | [Line chart showing responses     |             |
|     |  over time]                       |             |
|     |                                   |             |
|     |                                   |             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
|     +-------------------+  +-------------------+      |
|     | Guest Groups      |  | Table Statistics  |      |
|     +-------------------+  +-------------------+      |
|     |                   |  |                   |      |
|     | [Bar chart of     |  | [Table showing    |      |
|     |  responses by     |  |  utilization by   |      |
|     |  guest group]     |  |  table]           |      |
|     |                   |  |                   |      |
|     +-------------------+  +-------------------+      |
|                                                       |
+-------------------------------------------------------+
```

## Guest RSVP Screens

### 1. Wedding Information Screen

```
+-------------------------------------------------------+
|                                                       |
|                    LemonVows                          |
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |          [Wedding Cover Photo]            ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |  You're invited to the wedding of         ||    |
|  |  |                                           ||    |
|  |  |  Sarah & Michael                          ||    |
|  |  |                                           ||    |
|  |  |  June 15, 2025 at 3:00 PM                 ||    |
|  |  |  Grand Hotel, 123 Main St                 ||    |
|  |  |                                           ||    |
|  |  |  We would be delighted if you could join  ||    |
|  |  |  us on our special day.                   ||    |
|  |  |                                           ||    |
|  |  |  Please RSVP by May 1, 2025               ||    |
|  |  |                                           ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  |           RSVP Now                |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

### 2. RSVP Response Form

```
+-------------------------------------------------------+
|                                                       |
|                    LemonVows                          |
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |  Hello, John Smith!                       ||    |
|  |  |                                           ||    |
|  |  |  Will you attend the wedding?             ||    |
|  |  |                                           ||    |
|  |  |  [◉] Yes, I will attend                   ||    |
|  |  |  [○] No, I cannot attend                  ||    |
|  |  |                                           ||    |
|  |  |  Number of accompanying persons:          ||    |
|  |  |  [_1_] ▲▼                                 ||    |
|  |  |                                           ||    |
|  |  |  [✓] I need accommodation                 ||    |
|  |  |                                           ||    |
|  |  |  Menu Selection:                          ||    |
|  |  |                                           ||    |
|  |  |  Starter:                                 ||    |
|  |  |  [○] Tomato Soup (Vegetarian)            ||    |
|  |  |  [◉] Prawn Cocktail                      ||    |
|  |  |  [○] Caesar Salad (Gluten-free)          ||    |
|  |  |                                           ||    |
|  |  |  Main Course:                             ||    |
|  |  |  [○] Beef Wellington                      ||    |
|  |  |  [◉] Salmon Fillet (Gluten-free)         ||    |
|  |  |  [○] Mushroom Risotto (Vegetarian)       ||    |
|  |  |                                           ||    |
|  |  |  Dessert:                                 ||    |
|  |  |  [◉] Chocolate Cake                       ||    |
|  |  |  [○] Fruit Salad (Vegan)                 ||    |
|  |  |  [○] Cheesecake                          ||    |
|  |  |                                           ||    |
|  |  |  Allergies:                               ||    |
|  |  |  [✓] Nuts                                ||    |
|  |  |  [  ] Shellfish                          ||    |
|  |  |  [  ] Dairy                              ||    |
|  |  |  [  ] Eggs                               ||    |
|  |  |  [  ] Other: ___________________         ||    |
|  |  |                                           ||    |
|  |  |  Special Requests:                        ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  | I prefer to be seated near the    |    ||    |
|  |  |  | dance floor if possible.          |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  |           Submit RSVP             |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

### 3. RSVP Confirmation Screen

```
+-------------------------------------------------------+
|                                                       |
|                    LemonVows                          |
|                                                       |
|  +-----------------------------------------------+    |
|  |                                               |    |
|  |  +-------------------------------------------+|    |
|  |  |                                           ||    |
|  |  |  ✓ Thank You!                             ||    |
|  |  |                                           ||    |
|  |  |  Your RSVP has been submitted             ||    |
|  |  |  successfully.                            ||    |
|  |  |                                           ||    |
|  |  |  RSVP Summary:                            ||    |
|  |  |                                           ||    |
|  |  |  Status: Attending                        ||    |
|  |  |  Accompanying Persons: 1                  ||    |
|  |  |  Accommodation: Yes                       ||    |
|  |  |                                           ||    |
|  |  |  Menu Selections:                         ||    |
|  |  |  - Starter: Prawn Cocktail                ||    |
|  |  |  - Main: Salmon Fillet                    ||    |
|  |  |  - Dessert: Chocolate Cake                ||    |
|  |  |                                           ||    |
|  |  |  Allergies: Nuts                          ||    |
|  |  |                                           ||    |
|  |  |  Special Requests: I prefer to be seated  ||    |
|  |  |  near the dance floor if possible.        ||    |
|  |  |                                           ||    |
|  |  |  You can update your response until       ||    |
|  |  |  May 1, 2025 using your RSVP code.        ||    |
|  |  |                                           ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |  |           Update RSVP             |    ||    |
|  |  |  +-----------------------------------+    ||    |
|  |  |                                           ||    |
|  |  +-------------------------------------------+|    |
|  |                                               |    |
|  +-----------------------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

## Admin Screens

### 1. Admin Dashboard

```
+-------------------------------------------------------+
| LemonVows Admin                           [User ▼]    |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Admin Dashboard                                 |
|-----+                                                 |
| ◆ Dashboard    +-----------------------------------+  |
| ○ Weddings     | System Overview                   |  |
| ○ Users        +-----------------------------------+  |
| ○ Settings     |                                   |  |
| ○ Statistics   | Active Weddings: 15               |  |
|                | Registered Users: 42               |  |
|                | Total Guests: 1,250               |  |
|                | RSVP Response Rate: 68%           |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-------------------+  +---------------------+    |
|     | Recent Weddings   |  | Subscription Tiers  |    |
|     +-------------------+  +---------------------+    |
|     |                   |  |                     |    |
|     | • Sarah & Michael |  | Free: 5 weddings    |    |
|     |   Jun 15, 2025    |  | Basic: 8 weddings   |    |
|     | • Emma & James    |  | Premium: 2 weddings |    |
|     |   Jul 22, 2025    |  |                     |    |
|     | • Lisa & Robert   |  | [View Details]      |    |
|     |   Aug 10, 2025    |  |                     |    |
|     |                   |  |                     |    |
|     +-------------------+  +---------------------+    |
|                                                       |
|     +-----------------------------------+             |
|     | System Status                     |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | Database: ● Online                |             |
|     | Storage: 45% used                 |             |
|     | API Status: ● All systems normal  |             |
|     | Last Backup: Today, 03:00 AM      |             |
|     |                                   |             |
|     | [View System Logs]                |             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

### 2. Wedding Management Screen

```
+-------------------------------------------------------+
| LemonVows Admin                           [User ▼]    |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Weddings                                        |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ◆ Weddings     | Wedding List              [+ Add] |  |
| ○ Users        +-----------------------------------+  |
| ○ Settings     |                                   |  |
| ○ Statistics   | [Search...]    [Filter ▼] [Sort ▼]|  |
|                |                                   |  |
|                | +-------------------------------+ |  |
|                | | Couple      | Date    | Tier  | |  |
|                | +-------------------------------+ |  |
|                | | Sarah & M.  | Jun 15  | Prem. | |  |
|                | | Emma & J.   | Jul 22  | Basic | |  |
|                | | Lisa & R.   | Aug 10  | Free  | |  |
|                | | ...         | ...     | ...   | |  |
|                | +-------------------------------+ |  |
|                |                                   |  |
|                | [◀ Previous]  1 2 3 ...  [Next ▶] |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | Wedding Details                   |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | Couple: Sarah & Michael           |             |
|     | Date: June 15, 2025               |             |
|     | Location: Grand Hotel             |             |
|     | Guests: 80 (45 accepted)          |             |
|     | Subscription: Premium             |             |
|     | Created: March 10, 2025           |             |
|     |                                   |             |
|     | [Edit]  [Login as Couple]  [Delete]|             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

### 3. User Management Screen

```
+-------------------------------------------------------+
| LemonVows Admin                           [User ▼]    |
+-------------------------------------------------------+
| [≡] |                                                 |
|     | Users                                           |
|-----+                                                 |
| ○ Dashboard    +-----------------------------------+  |
| ○ Weddings     | User List                 [+ Add] |  |
| ◆ Users        +-----------------------------------+  |
| ○ Settings     |                                   |  |
| ○ Statistics   | [Search...]    [Filter ▼] [Sort ▼]|  |
|                |                                   |  |
|                | +-------------------------------+ |  |
|                | | Name        | Email   | Role  | |  |
|                | +-------------------------------+ |  |
|                | | Sarah Smith | s@ex.com| Couple| |  |
|                | | Michael Lee | m@ex.com| Couple| |  |
|                | | Admin User  | a@ex.com| Admin | |  |
|                | | ...         | ...     | ...   | |  |
|                | +-------------------------------+ |  |
|                |                                   |  |
|                | [◀ Previous]  1 2 3 ...  [Next ▶] |  |
|                |                                   |  |
|                +-----------------------------------+  |
|                                                       |
|     +-----------------------------------+             |
|     | User Details                      |             |
|     +-----------------------------------+             |
|     |                                   |             |
|     | Name: Sarah Smith                 |             |
|     | Email: sarah@example.com          |             |
|     | Role: Couple                      |             |
|     | Wedding: Sarah & Michael          |             |
|     | Registered: March 10, 2025        |             |
|     | Last Login: Today, 10:23 AM       |             |
|     |                                   |             |
|     | [Edit]  [Reset Password]  [Delete]|             |
|     |                                   |             |
|     +-----------------------------------+             |
|                                                       |
+-------------------------------------------------------+
```

## Mobile Responsive Designs

### 1. Mobile Dashboard

```
+----------------------+
| LemonVows      [≡]   |
+----------------------+
| Dashboard            |
+----------------------+
| Wedding Overview     |
|                      |
| Wedding: Jun 15, 2025|
| Location: Grand Hotel|
| Style: Elegant       |
| RSVP Due: May 1, 2025|
+----------------------+
| RSVP Status          |
|                      |
| Accepted: 45         |
| Declined: 12         |
| Pending: 23          |
|                      |
| [View Details]       |
+----------------------+
| Recent Activity      |
|                      |
| • John Smith accepted|
| • Mary Johnson       |
|   declined           |
| • Table #3 added     |
+----------------------+
| Quick Actions        |
|                      |
| [+ Add Guest]        |
| [✉ Send Reminder]    |
| [↓ Export Data]      |
+----------------------+
```

### 2. Mobile RSVP Form

```
+----------------------+
| LemonVows            |
+----------------------+
| Hello, John Smith!   |
|                      |
| Will you attend?     |
|                      |
| [◉] Yes, I will      |
| [○] No, I cannot     |
+----------------------+
| Accompanying persons:|
| [_1_] ▲▼             |
|                      |
| [✓] Need accommodation|
+----------------------+
| Menu Selection:      |
|                      |
| Starter:             |
| [○] Tomato Soup      |
| [◉] Prawn Cocktail   |
| [○] Caesar Salad     |
+----------------------+
| Main Course:         |
| [○] Beef Wellington  |
| [◉] Salmon Fillet    |
| [○] Mushroom Risotto |
+----------------------+
| Dessert:             |
| [◉] Chocolate Cake   |
| [○] Fruit Salad      |
| [○] Cheesecake       |
+----------------------+
| Allergies:           |
| [✓] Nuts             |
| [  ] Shellfish       |
| [  ] Dairy           |
| [  ] Eggs            |
+----------------------+
| Special Requests:    |
| [                    |
|                      |
| ]                    |
+----------------------+
| [    Submit RSVP    ]|
+----------------------+
```

## Language Selection Component

```
+-------------------------------------------------------+
| Language Selection:                                   |
|                                                       |
| [DE] [EN] [FR] [ES]                                  |
|  ▼                                                    |
+-------------------------------------------------------+
| Dropdown Menu:                                        |
|                                                       |
| ○ Deutsch (German)                                    |
| ○ English                                             |
| ○ Français (French)                                   |
| ○ Español (Spanish)                                   |
+-------------------------------------------------------+
```

## Color Scheme and Design Elements

### Color Palette

```
Primary Colors:
- Primary Blue: #3498db
- Secondary Green: #2ecc71
- Accent Pink: #e91e63

Status Colors:
- Success Green: #4CAF50
- Warning Orange: #FF9800
- Error Red: #F44336
- Info Blue: #2196F3

Neutral Colors:
- Dark Gray: #333333
- Medium Gray: #777777
- Light Gray: #f5f5f5
- White: #ffffff
```

### Typography

```
Headings: 'Playfair Display', serif
- H1: 24px
- H2: 20px
- H3: 18px
- H4: 16px

Body Text: 'Roboto', sans-serif
- Regular: 14px
- Small: 12px

Button Text: 'Roboto', sans-serif
- Bold, 14px
```

### UI Components

```
Buttons:
- Primary: Filled, rounded corners, #3498db
- Secondary: Outlined, rounded corners, #777777
- Success: Filled, rounded corners, #2ecc71
- Danger: Filled, rounded corners, #F44336

Cards:
- White background
- Light shadow
- Rounded corners
- Padding: 20px

Form Elements:
- Input fields: White background, light border, rounded corners
- Checkboxes: Custom styled with brand colors
- Radio buttons: Custom styled with brand colors
- Dropdowns: Custom styled with brand colors

Icons:
- Material Design icons
- Size: 18px for navigation, 24px for feature icons
```

## Notes on Implementation

1. **Responsive Design**
   - All screens should be fully responsive
   - Mobile-first approach for implementation
   - Breakpoints at 576px, 768px, 992px, and 1200px

2. **Accessibility**
   - All interactive elements must have appropriate ARIA labels
   - Color contrast should meet WCAG 2.1 AA standards
   - Keyboard navigation should be fully supported

3. **Multilingual Support**
   - All UI elements should support text expansion for different languages
   - Right-to-left (RTL) support should be considered for future language additions
   - Font selection should support extended character sets

4. **Performance Considerations**
   - Lazy loading for images and heavy components
   - Pagination for large data sets
   - Optimized rendering for statistics charts

5. **Animation and Transitions**
   - Subtle animations for state changes
   - Smooth transitions between screens
   - Loading indicators for asynchronous operations
