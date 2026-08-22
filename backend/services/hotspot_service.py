from backend.models.hotspot_model import Hotspot


def get_hotspots() -> list[Hotspot]:

    # Temporary mock data.
    # This will later be replaced with real hotspot information.

    return [
        Hotspot(
            id=1,
            location="Coimbatore Industrial Area",
            latitude=11.0168,
            longitude=76.9558,
            risk="CRITICAL",
            report_count=12
        ),
        Hotspot(
            id=2,
            location="Neelambur",
            latitude=11.0183,
            longitude=77.0020,
            risk="HIGH",
            report_count=8
        ),
        Hotspot(
            id=3,
            location="Gandhipuram",
            latitude=11.0300,
            longitude=76.9500,
            risk="MODERATE",
            report_count=4
        )
    ]