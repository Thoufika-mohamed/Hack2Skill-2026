from backend.models.pollution_model import PollutionData


def get_pollution_data(latitude: float, longitude: float) -> PollutionData:

    # Temporary mock data.
    # Person 4 will later replace this with real environmental data.

    return PollutionData(
        location="Selected Location",
        latitude=latitude,
        longitude=longitude,
        pm25=42.5,
        pm10=68.0,
        no2=18.2,
        risk="Moderate"
    )