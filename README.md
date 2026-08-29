# AquaSense Pro

Smart Water Purification & Quality Monitoring System — UI Implementation Plan

1. UI Project Objective

Build a responsive React.js web application that allows a user to:

 View overall water-quality statistics

 Enter water-quality parameters

 Upload water images

 Analyze numerical water data

 Analyze water images

 View combined analysis

 View Safe/Unsafe status

 View risk level and confidence

 Understand why water was classified as unsafe

 View purification recommendations

 View previous analysis records

 Filter and search water samples

 Visualize pH, TDS, turbidity and temperature

 View location-wise water-quality information

 Generate/view water-quality reports

 Later connect all prediction screens to the ML backend

For now, do not implement actual ML or backend logic.

Use:

React.js
Vite
JavaScript / JSX
Tailwind CSS
React Router
Axios
Recharts
Lucide React

2. Overall UI Architecture

Your application should have this structure:

                    SMART WATER SYSTEM
                           │
                           ▼
                    React Web Application
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
   Dashboard          Water Analysis       Image Analysis
       │                   │                    │
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                           ▼
                  Combined Analysis
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Quality Result             Recommendations
              │                         │
              └────────────┬────────────┘
                           ▼
                        History
                           │
                           ▼
                         Reports

3. Main Pages

Create these pages:

1. Login
2. Dashboard
3. Water Analysis
4. Image Analysis
5. Combined Analysis
6. Analysis Result
7. Water History
8. Water Sample Details
9. Purification Recommendations
10. Reports
11. Profile / Settings
12. About System

For a student project, you can make Login optional. If you want the application to look like a complete real-world product, include it.

4. Recommended Navigation

Use a left sidebar.

┌──────────────────────────┐
│ 💧 AquaGuard AI          │
├──────────────────────────┤
│                          │
│ 🏠 Dashboard             │
│ 💧 Water Analysis        │
│ 🖼 Image Analysis        │
│ 🔬 Combined Analysis     │
│ 📊 Analytics             │
│ 📋 History               │
│ 🧪 Recommendations       │
│ 📄 Reports               │
│                          │
│ ───────────────────────  │
│ ⚙ Settings               │
│ ℹ About                  │
│                          │
└──────────────────────────┘

You can choose a project name such as:

AquaGuard AI

or

JalRakshak AI

or simply:

SmartWater AI

I recommend AquaGuard AI for the UI because it sounds like a complete product.

5. Global UI Design

Use a professional environmental/healthcare-style interface.

Suggested visual style

Primary:
Blue / Deep Blue

Secondary:
Teal / Cyan

Success:
Green

Warning:
Amber

Danger:
Red

Background:
Very light gray / white

Cards:
White with subtle shadow

Don't make the UI look like a generic admin dashboard.

Use:

 Rounded cards

 Clean typography

 Water-related illustrations

 Simple charts

 Clear status indicators

 Large numerical values

 Minimal animations

6. Dashboard

This should be the main page.

Header

┌─────────────────────────────────────────────────────────┐
│ Good Morning, Admin                     🔔  👤 Kanoj   │
│ Monitor and analyze water quality intelligently         │
└─────────────────────────────────────────────────────────┘

7. Dashboard KPI Cards

Create four main cards.

┌────────────────┐ ┌────────────────┐
│ Total Samples  │ │ Safe Samples   │
│                │ │                │
│    1,250       │ │     820        │
│    +12.5%      │ │     65.6%      │
└────────────────┘ └────────────────┘

┌────────────────┐ ┌────────────────┐
│ Unsafe Samples │ │ High Risk      │
│                │ │                │
│     430        │ │      182       │
│     34.4%      │ │      14.5%     │
└────────────────┘ └────────────────┘

For now, use mock data.

Later:

GET /api/dashboard/stats

will replace the mock data.

8. Dashboard — Water Quality Overview

Create a large chart.

Chart: Safe vs Unsafe

Use:

Recharts PieChart / DonutChart

Example:

              Water Quality

                 ╭──────╮
              ╭──│ 66%  │──╮
              │  ╰──────╯  │
              │             │
           Safe          Unsafe
            66%             34%

9. Dashboard — Parameter Trends

Create a line chart.

Water Quality Trends

pH
8 ┤       ╭──╮
7 ┤ ──────╯  ╰──────
6 ┤
  └────────────────────
    Jan Feb Mar Apr May

You can create tabs:

[pH] [TDS] [Turbidity] [Temperature]

10. Dashboard — Recent Samples

Show the latest analyses.

Sample IDLocationpHTDSTurbidityStatusWS001Tap-Water-27.42250.63.19SafeWS002Pond-Sample4.741349.224.43UnsafeWS003Lake-Sample6.9553.23.25Safe

Status should use badges:

🟢 Safe
🔴 Unsafe
🟡 Moderate

11. Dashboard — Quick Actions

Add prominent buttons:

┌────────────────────────────────────────────┐
│ Quick Analysis                             │
│                                            │
│ [ + Analyze Water ]  [ 🖼 Upload Image ]  │
│                                            │
│ [ 🔬 Combined Analysis ]                  │
└────────────────────────────────────────────┘

This makes the dashboard functional rather than only informational.

12. Water Analysis Page

This page handles numerical values.

Page header

Water Quality Analysis

Enter the water-quality parameters
to assess the sample.

13. Water Input Form

Create:

Sample ID
Location
pH
Turbidity (NTU)
TDS (ppm)
Temperature (°C)

Example:

┌─────────────────────────────────────────┐
│ Sample ID                                │
│ [ WS001_______________________________ ] │
│                                         │
│ Location                                │
│ [ Tap-Water-2 ▼ ]                       │
│                                         │
│ pH                                      │
│ [ 7.42_______________________________ ] │
│                                         │
│ Turbidity (NTU)                         │
│ [ 3.19_______________________________ ] │
│                                         │
│ TDS (ppm)                               │
│ [ 250.6______________________________ ] │
│                                         │
│ Temperature (°C)                        │
│ [ 19.2_______________________________ ] │
│                                         │
│ [ Reset ]       [ Analyze Water ]       │
└─────────────────────────────────────────┘

14. Form Validation

Implement frontend validation.

pH

Minimum: 0
Maximum: 14

Turbidity

Must be >= 0

TDS

Must be >= 0

Temperature

Must be a valid numeric value

Don't let the user submit:

pH = abc
TDS = -500

Display:

⚠ Please enter a valid pH value.

15. Parameter Status Preview

Even before backend integration, you can display a basic UI preview based on placeholder/mock logic.

For example:

Parameter Summary

pH             7.42       ✓
Turbidity      3.19       ✓
TDS            250.6      ✓
Temperature    19.2       ✓

Later, backend response should control these indicators.

16. Image Analysis Page

Create a professional drag-and-drop uploader.

┌──────────────────────────────────────────┐
│                                          │
│             🖼                           │
│                                          │
│       Upload Water Sample Image          │
│                                          │
│  Drag & drop your image here             │
│  or click to browse                      │
│                                          │
│      [ Choose Image ]                    │
│                                          │
│ JPG / PNG / WEBP                          │
│ Maximum 5 MB                              │
│                                          │
└──────────────────────────────────────────┘

17. Image Preview

After selecting:

┌────────────────────────────────────┐
│                                    │
│         [ WATER IMAGE ]             │
│                                    │
│                                    │
└────────────────────────────────────┘

water_sample.jpg
2.4 MB

[ Remove ]     [ Analyze Image ]

18. Image Prediction Result UI

Mock result:

┌─────────────────────────────────────────┐
│ Visual Water Analysis                   │
├─────────────────────────────────────────┤
│                                         │
│ Visual Classification                   │
│                                         │
│ Turbid                                  │
│ Confidence: 91%                         │
│                                         │
│ ────────────────────────────────        │
│                                         │
│ Clear          7%                       │
│ Turbid        91%                       │
│ Muddy          2%                       │
│                                         │
│ Visual Risk: HIGH                       │
└─────────────────────────────────────────┘

Later, these values come from your CNN.

19. Combined Analysis Page

This should be your most important UI page.

The user enters:

Numerical parameters
+
Water image

Create a two-column interface.

┌───────────────────────┬───────────────────────┐
│ NUMERICAL DATA        │ WATER IMAGE           │
│                       │                       │
│ pH          [7.42]    │                       │
│ TDS         [250.6]   │       [IMAGE]         │
│ Turbidity   [3.19]    │                       │
│ Temperature [19.2]    │                       │
│                       │                       │
│ [Edit Data]           │ [Change Image]       │
└───────────────────────┴───────────────────────┘

             [ RUN COMBINED ANALYSIS ]

20. Combined Result

After analysis:

┌─────────────────────────────────────────────┐
│             FINAL WATER ASSESSMENT          │
├─────────────────────────────────────────────┤
│                                             │
│                 🔴                          │
│                                             │
│                 UNSAFE                      │
│                                             │
│             Risk Level: HIGH                │
│             Confidence: 89.4%               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ Numerical Model       Image Model           │
│                                             │
│ Unsafe: 82%           Turbid: 91%           │
│                                             │
└─────────────────────────────────────────────┘

21. Prediction Explanation

Create an important section:

Why was this water classified as unsafe?

┌───────────────────────────────────────────┐
│ Prediction Explanation                    │
├───────────────────────────────────────────┤
│                                           │
│ Turbidity       █████████████  High       │
│ pH              ██████████     High       │
│ TDS             ███████        Medium     │
│ Temperature     ██             Low        │
│                                           │
└───────────────────────────────────────────┘

Later this can be populated by SHAP/feature-importance results from the backend.

22. Purification Recommendation UI

Create a dedicated recommendation card.

┌────────────────────────────────────────────┐
│ 🧪 Recommended Treatment                   │
├────────────────────────────────────────────┤
│                                            │
│ Based on the detected water-quality       │
│ conditions, the recommended treatment     │
│ stages are:                               │
│                                            │
│ ① Sedimentation                            │
│    Remove suspended particles              │
│                                            │
│ ↓                                          │
│                                            │
│ ② Sand Filtration                          │
│    Reduce turbidity                        │
│                                            │
│ ↓                                          │
│                                            │
│ ③ Activated Carbon                         │
│    Improve color/odor and adsorb some      │
│    organic compounds                       │
│                                            │
│ ↓                                          │
│                                            │
│ ④ RO / Appropriate Treatment               │
│    For excessive dissolved solids          │
│                                            │
│ ↓                                          │
│                                            │
│ ⑤ Disinfection                             │
│    Final microbial-control step            │
│                                            │
└────────────────────────────────────────────┘

Important: label these as system recommendations, not proof that the treatment makes the water safe.

23. Purification Process Visualization

This can make your UI visually impressive.

Raw Water
   │
   ▼
┌──────────────┐
│ Sedimentation │
└──────┬───────┘
       ▼
┌──────────────┐
│ Sand Filter  │
└──────┬───────┘
       ▼
┌──────────────┐
│ Carbon Filter│
└──────┬───────┘
       ▼
┌──────────────┐
│ RO / Treatment│
└──────┬───────┘
       ▼
┌──────────────┐
│ Disinfection │
└──────┬───────┘
       ▼
 Treated Water

You can animate the arrows later.

24. Analytics Page

Create an analytics dashboard.

Charts:

1. Water Quality Distribution

Pie chart.

2. pH Distribution

Bar chart.

3. TDS Distribution

Line/bar chart.

4. Turbidity Distribution

Line chart.

5. Location-wise Quality

Bar chart.

Example:

Location-wise Water Quality

Tap Water        █████████████
River            ██████████
Lake             ████████
Borewell         ███████
Pond             █████
Industrial Zone  ███

25. History Page

Create a table containing all analyses.

┌──────────────────────────────────────────────────────────┐
│ Water Analysis History                                   │
├──────────────────────────────────────────────────────────┤
│ Search [____________]   Filter [All ▼]   Date [____]    │
├──────────────────────────────────────────────────────────┤
│ ID     Location       pH    TDS   Turbidity   Status    │
│ WS001  Tap-Water-2   7.42   250     3.19      Safe      │
│ WS002  Pond-Sample   4.74  1349    24.43      Unsafe    │
│ WS003  Lake-Sample   6.95    53     3.25      Safe      │
└──────────────────────────────────────────────────────────┘

Add:

View
Edit
Delete

or preferably just:

View Details

for analysis records.

26. Sample Details Page

When the user clicks WS002:

Sample WS002

Location:
Pond-Sample

Analysis Date:
26 Aug 2026

Parameters
────────────────────
pH              4.74
TDS             1349.2 ppm
Turbidity       24.43 NTU
Temperature     19.2 °C

Result
────────────────────

🔴 UNSAFE

Risk:
HIGH

Confidence:
94.2%

Then:

Image
[ Water Sample Image ]

Prediction Explanation

Purification Recommendation

27. Reports Page

Create a page where the user can generate a report.

Water Quality Report

Sample:
WS002

[ Preview Report ]

[ Download PDF ]

For the UI stage, the button can simply show:

Report generation will be connected to backend.

Later you can connect PDF generation.

28. Settings Page

Create:

Profile
Application Settings
Notification Settings
Theme
Language

For example:

Theme

○ Light
○ Dark

and:

Notifications

Unsafe Water Alerts
[ ON ]

High Risk Alerts
[ ON ]

29. About Page

Explain the project.

Sections:

About AquaGuard AI

Problem

Solution

How It Works

Machine Learning

Computer Vision

Purification Recommendation

Technology Stack

Limitations

This is especially useful for a college/project demonstration.

30. Responsive Design

Your UI must work on:

Desktop

Sidebar + Main Content

Tablet

Collapsed Sidebar
Main Content

Mobile

Top Header
        ↓
Content
        ↓
Bottom/Drawer Navigation

Test:

1920 × 1080
1366 × 768
1024 × 768
768 × 1024
390 × 844

31. React Component Structure

Don't put everything inside App.jsx.

Use reusable components.

src/
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── Layout.jsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.jsx
│   │   ├── QualityChart.jsx
│   │   ├── TrendChart.jsx
│   │   └── RecentSamples.jsx
│   │
│   ├── water/
│   │   ├── WaterForm.jsx
│   │   ├── ParameterCard.jsx
│   │   └── QualityResult.jsx
│   │
│   ├── image/
│   │   ├── ImageUploader.jsx
│   │   ├── ImagePreview.jsx
│   │   └── ImageResult.jsx
│   │
│   ├── analysis/
│   │   ├── CombinedAnalysis.jsx
│   │   ├── PredictionCard.jsx
│   │   ├── RiskIndicator.jsx
│   │   └── ExplanationChart.jsx
│   │
│   └── recommendations/
│       ├── TreatmentCard.jsx
│       └── TreatmentPipeline.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── WaterAnalysis.jsx
│   ├── ImageAnalysis.jsx
│   ├── CombinedAnalysis.jsx
│   ├── Analytics.jsx
│   ├── History.jsx
│   ├── SampleDetails.jsx
│   ├── Recommendations.jsx
│   ├── Reports.jsx
│   ├── Settings.jsx
│   └── About.jsx
│
├── services/
│   └── api.js
│
├── data/
│   └── mockData.js
│
├── hooks/
│
├── utils/
│
├── App.jsx
└── main.jsx

32. Mock Data

Since the backend doesn't exist yet, create:

src/data/mockData.js

Use your existing dataset.

For example:

WS001 → Safe
WS002 → Unsafe
WS003 → Safe
WS004 → Unsafe
...

Then your UI works completely before the backend exists.

Later:

mockData.js

can be replaced by:

api.js

without changing your components significantly.

33. API-Ready Frontend

This is extremely important.

Don't do:

const prediction = "Unsafe";

inside your React components everywhere.

Instead create:

services/api.js

with functions such as:

analyzeWater()
analyzeImage()
analyzeCombined()
getHistory()
getDashboardStats()
getSampleDetails()
getRecommendations()

Initially these functions can return mock data.

Later:

React
   ↓
Axios
   ↓
FastAPI
   ↓
ML Model

So your UI architecture is already ready for the backend.

34. Loading States

Every ML operation should eventually have a loading state.

Example:

[ Analyze Water ]
       ↓
[ ⟳ Analyzing... ]
       ↓
[ Result ]

For image analysis:

Uploading image...
      ↓
Processing image...
      ↓
Running CNN...
      ↓
Generating result...

Even though backend doesn't exist now, implement the UI states.

35. Error States

Create UI for:

Invalid input

⚠ Invalid pH value

Image too large

⚠ Image size must be less than 5 MB

Unsupported file

⚠ Please upload JPG, PNG or WEBP

Backend unavailable

Later:

⚠ Unable to connect to analysis server.
Please try again.

36. Empty States

History page with no records:

          📋

No water analyses yet.

Start your first analysis to see
results here.

[ Analyze Water ]

This is often forgotten in UI projects.

37. Status System

Use consistent statuses throughout the application.

Water status

SAFE
MODERATE
UNSAFE

Risk

LOW
MEDIUM
HIGH

Processing

PENDING
ANALYZING
COMPLETED
FAILED

Create reusable badges.

38. UI Task Breakdown

I recommend implementing in this order.

Phase 1 — Project Setup

 Create React + Vite project

 Configure Tailwind CSS

 Install React Router

 Install Axios

 Install Recharts

 Install Lucide React

 Create global styles

 Create responsive layout

Phase 2 — Layout

 Create Sidebar

 Create Header

 Create Main Layout

 Create navigation

 Add active navigation state

 Add responsive sidebar

 Add user profile area

Phase 3 — Dashboard

 Create KPI cards

 Create Safe/Unsafe donut chart

 Create pH chart

 Create TDS chart

 Create turbidity chart

 Create temperature chart

 Create recent samples table

 Create quick-action buttons

Phase 4 — Numerical Analysis

 Create water input form

 Add validation

 Add location dropdown

 Add parameter cards

 Create analysis button

 Create loading state

 Create prediction result

 Create risk indicator

 Create explanation section

Phase 5 — Image Analysis

 Create drag-and-drop uploader

 Create file validation

 Create image preview

 Create remove image functionality

 Create analyze button

 Create loading animation

 Create visual prediction result

 Create confidence display

Phase 6 — Combined Analysis

 Create numerical input section

 Create image upload section

 Create combined analyze button

 Create numerical prediction card

 Create image prediction card

 Create fusion result card

 Create confidence visualization

 Create risk level

 Create prediction explanation

Phase 7 — Purification Recommendation

 Create recommendation card

 Create treatment stages

 Create treatment pipeline

 Create parameter-specific recommendations

 Add warning/disclaimer section

Phase 8 — Analytics

 Create analytics page

 Add parameter charts

 Add location analysis

 Add safe/unsafe distribution

 Add risk distribution

 Add date filtering

Phase 9 — History

 Create history table

 Search samples

 Filter by status

 Filter by location

 Filter by date

 View sample details

 Pagination

Phase 10 — Reports

 Create report preview

 Create sample report UI

 Add PDF button placeholder

 Add report filters

Phase 11 — Polish

 Loading skeletons

 Error messages

 Empty states

 Toast notifications

 Responsive design

 Dark mode if required

 Accessibility

 Animations

 Final UI consistency

39. Suggested Final UI Navigation

Your finished application should look approximately like:

┌─────────────────────────────────────────────────────────────┐
│ 💧 AquaGuard AI                         🔔   👤 Admin       │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Dashboard     │             Dashboard                       │
│               │                                             │
│ Water         │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐│
│ Analysis      │  │Samples │ │ Safe   │ │Unsafe  │ │ Risk ││
│               │  │ 1250   │ │  820   │ │  430   │ │ 182  ││
│ Image         │  └────────┘ └────────┘ └────────┘ └──────┘│
│ Analysis      │                                             │
│               │  ┌─────────────────────┐ ┌───────────────┐ │
│ Combined      │  │ Water Quality Chart │ │ Quick Actions │ │
│ Analysis      │  │                     │ │               │ │
│               │  │       📊            │ │ + Analyze     │ │
│ Analytics     │  │                     │ │ Upload Image  │ │
│               │  └─────────────────────┘ └───────────────┘ │
│ History       │                                             │
│               │  Recent Water Samples                      │
│ Recommendations│ ┌────────────────────────────────────────┐│
│               │ │ ID │ Location │ pH │ TDS │ Status       ││
│ Reports       │ └────────────────────────────────────────┘│
│               │                                             │
│ Settings      │                                             │
│ About         │                                             │
└───────────────┴─────────────────────────────────────────────┘

40. The UI's Future Backend Connection

The most important architectural principle is:

                 CURRENT
                   │
                   ▼
React UI → Mock Data → UI Result

Then later:

                 FINAL
                   │
                   ▼
React UI
    │
    ▼
Axios API
    │
    ▼
FastAPI
    │
    ├──────────────┐
    ▼              ▼
Numerical ML     CNN
    │              │
    └──────┬───────┘
           ▼
      Fusion Model
           │
           ▼
 Recommendation
           │
           ▼
       JSON Response
           │
           ▼
      React Dashboard

This means you don't need to rewrite the frontend when you start the ML/backend phase.

41. Final UI Deliverables

When your UI phase is complete, you should have:

✅ React.js web application

✅ Responsive dashboard

✅ Water-quality input form

✅ Water image upload

✅ Numerical analysis interface

✅ Image analysis interface

✅ Combined analysis interface

✅ Safe/Unsafe result UI

✅ Risk-level UI

✅ Confidence visualization

✅ Explainable prediction UI

✅ Purification recommendation UI

✅ Historical analysis table

✅ Sample details page

✅ Analytics dashboard

✅ Charts

✅ Search/filter

✅ Report interface

✅ Loading states

✅ Error states

✅ Empty states

✅ Mock dataset integration

✅ API service layer

✅ Backend-ready architecture

Recommended implementation order

Start with:

Project Setup → Layout → Dashboard → Water Analysis → Image Analysis → Combined Analysis → Recommendations → History → Analytics → Reports → API-ready services



- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.


```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000


