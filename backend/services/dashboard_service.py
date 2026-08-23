def get_dashboard_data():
    return {
        "statistics": {
            "active_incidents": 12,
            "critical_hotspots": 3,
            "reports_today": 48,
            "resolved": 31
        },
        "priority_incidents": [
            {
                "id": 1,
                "location": "Coimbatore Industrial Area",
                "pollution_type": "Industrial Smoke",
                "risk": "Critical",
                "reports": 12,
                "status": "Active"
            },
            {
                "id": 2,
                "location": "Ukkadam",
                "pollution_type": "Vehicle Pollution",
                "risk": "High",
                "reports": 8,
                "status": "Under Review"
            }
        ]
    }