import math
import os
import requests

from backend.models.pollution_model import PollutionData


OPENAQ_BASE_URL = "https://api.openaq.org/v3"


def distance_km(lat1, lon1, lat2, lon2):
    radius = 6371

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    dlat = lat2 - lat1
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    return radius * 2 * math.asin(math.sqrt(a))


def get_nearby_locations(latitude, longitude):
    api_key = os.getenv("OPENAQ_API_KEY")

    if not api_key:
        raise RuntimeError("OPENAQ_API_KEY is not configured")

    response = requests.get(
        f"{OPENAQ_BASE_URL}/locations",
        headers={"X-API-Key": api_key},
        params={
            "coordinates": f"{latitude},{longitude}",
            "radius": 25000,
            "limit": 100,
        },
        timeout=15,
    )

    response.raise_for_status()

    return response.json().get("results", [])


def get_location_sensors(location_id, api_key):
    response = requests.get(
        f"{OPENAQ_BASE_URL}/locations/{location_id}/sensors",
        headers={"X-API-Key": api_key},
        params={"limit": 100},
        timeout=15,
    )

    response.raise_for_status()

    return response.json().get("results", [])


def get_latest_measurements(location_id, api_key):
    response = requests.get(
        f"{OPENAQ_BASE_URL}/locations/{location_id}/latest",
        headers={"X-API-Key": api_key},
        params={"limit": 100},
        timeout=15,
    )

    response.raise_for_status()

    return response.json().get("results", [])


def get_pollution_data(latitude: float, longitude: float) -> PollutionData:

    api_key = os.getenv("OPENAQ_API_KEY")

    if not api_key:
        raise RuntimeError("OPENAQ_API_KEY is not configured")

    locations = get_nearby_locations(latitude, longitude)

    if not locations:
        raise RuntimeError(
            "No OpenAQ monitoring station found within 25 km."
        )

    # Try nearby stations in order of distance.
    locations.sort(
        key=lambda location: distance_km(
            latitude,
            longitude,
            location["coordinates"]["latitude"],
            location["coordinates"]["longitude"],
        )
    )

    selected_location = None
    selected_values = None

    for location in locations:

        location_id = location["id"]

        sensors = get_location_sensors(
            location_id,
            api_key
        )

        measurements = get_latest_measurements(
            location_id,
            api_key
        )

        sensor_parameters = {}

        for sensor in sensors:

            sensor_id = sensor.get("id")
            parameter = sensor.get("parameter", {})

            parameter_name = (
                parameter.get("name", "")
                .lower()
                .replace(" ", "")
            )

            sensor_parameters[sensor_id] = parameter_name

        values = {
            "pm25": None,
            "pm10": None,
            "no2": None
        }

        for measurement in measurements:

            sensor_id = measurement.get("sensorsId")
            value = measurement.get("value")

            if value is None:
                continue

            parameter_name = sensor_parameters.get(
                sensor_id,
                ""
            )

            if parameter_name in [
                "pm25",
                "pm2.5",
                "particulatematter25",
                "particulatematter2.5"
            ]:
                values["pm25"] = float(value)

            elif parameter_name in [
                "pm10",
                "particulatematter10"
            ]:
                values["pm10"] = float(value)

            elif parameter_name in [
                "no2",
                "nitrogendioxide"
            ]:
                values["no2"] = float(value)

        # Prefer a station that actually has all three.
        if all(value is not None for value in values.values()):
            selected_location = location
            selected_values = values
            break

        # Otherwise remember the best station with at least PM2.5.
        if (
            selected_location is None
            and values["pm25"] is not None
        ):
            selected_location = location
            selected_values = values

    if selected_location is None:
        raise RuntimeError(
            "No nearby OpenAQ station has usable pollution measurements."
        )

    pm25 = selected_values["pm25"]
    pm10 = selected_values["pm10"]
    no2 = selected_values["no2"]

    # Keep the existing API contract numeric.
    # Missing measurements are represented as 0 for compatibility.
    pm25 = pm25 if pm25 is not None else 0.0
    pm10 = pm10 if pm10 is not None else 0.0
    no2 = no2 if no2 is not None else 0.0

    if pm25 >= 150:
        risk = "Critical"
    elif pm25 >= 55:
        risk = "High"
    elif pm25 >= 35:
        risk = "Moderate"
    else:
        risk = "Low"

    return PollutionData(
        location=selected_location.get(
            "name",
            "OpenAQ Station"
        ),
        latitude=selected_location["coordinates"]["latitude"],
        longitude=selected_location["coordinates"]["longitude"],
        pm25=pm25,
        pm10=pm10,
        no2=no2,
        risk=risk
    )