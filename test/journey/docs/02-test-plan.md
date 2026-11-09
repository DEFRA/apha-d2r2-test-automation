# Test plan

status: approved
approved: yes
scope: home-and-navigation
priorities:
- P0: home page navigation and key landing links
- P1: direct page entry from the home page
- P2: search page disease title filtering
- P3: disease ranking report selectors and option selection
- P4: compare profile versions page controls and selection status
- P5: direct-route maintenance page controls
- P6: report-generation page controls and navigation
- P7: help documentation route and manual listing
- P8: disease-ranking filter creation route and controls
- P9: profile-management actions from search results and manage page
- P10: contributor, property and title edit flows for live profile management
traceability:
- home page: based on app/Profiles.Web/Home.aspx
- search page: based on app/Profiles.Web/Search.aspx
- disease ranking page: based on app/Profiles.Web/DiseaseRanking.aspx
- compare profile versions page: based on app/Profiles.Web/CompareProfileVersions.aspx
- maintain species data page: based on app/Profiles.Web/MaintainSpeciesData.aspx
- questions and guidance reports page: based on app/Profiles.Web/EditUserGuidance.aspx
- help using D2R2 page: based on app/Profiles.Web/StaticReports.aspx?UserManual=1
- create disease ranking filter page: based on app/Profiles.Web/EditDiseaseRankingFilters.aspx
- app pages: app/Profiles.Web/*.aspx and *.aspx.vb
- TC-001: home page landing links
- TC-002: home page to Search disease profiles
- TC-003: home page to Disease ranking report
- TC-004: home page to General reports
- TC-005: home page to View species data
- TC-006: search page filter controls visible
- TC-007: search page disease title lookup
- TC-011: disease ranking page selectors visible
- TC-012: disease ranking report option selection
- TC-013: compare profile versions page controls visible
- TC-015: maintain species data page controls visible
- TC-016: questions and guidance reports page controls visible
- TC-017: help using D2R2 page manual list visible
- TC-018: create disease ranking filter page controls visible
- TC-038: search result opens the manage page for a live profile
- TC-039: manage page opens maintain contributors and reviewers
- TC-040: manage page opens profile properties
- TC-041: manage page opens contributions report
- TC-042: search result opens the edit profile title page
notes:
- Default app entry is Home.aspx and the app uses Windows auth per app/Profiles.Web/Web.config
- The verified live pages are Search.aspx, DiseaseRanking.aspx, StaticReports.aspx, ViewSpeciesData.aspx, CompareProfileVersions.aspx, MaintainSpeciesData.aspx, EditUserGuidance.aspx, StaticReports.aspx?UserManual=1, EditDiseaseRankingFilters.aspx and the profile-management routes reached from Search.aspx results
- The write-first gate is now: expand scenario inventory for the live profile-management branch before any broad execution sweep
