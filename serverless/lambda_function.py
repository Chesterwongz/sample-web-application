import json
import datetime
import requests

def lambda_handler(event, context):
    t = datetime.datetime.now()
    params = {'date_time': t.strftime("%Y-%m-%dT%I:%M:%S")}
    temp_response = requests.get("https://api.data.gov.sg/v1/environment/air-temperature", params=params).json()
    rain_response = requests.get("https://api.data.gov.sg/v1/environment/rainfall", params=params).json()
    humidity_response = requests.get("https://api.data.gov.sg/v1/environment/relative-humidity", params=params).json()
    
    temp_avg = None 
    if (temp_response.get("api_info").get("status") == "healthy"):
        temp_sum = 0
        count = 0
        for temp_reading in temp_response.get("items")[0].get("readings"):
            temp_sum += temp_reading.get("value")
            count += 1
        if count != 0:
            temp_avg = round(temp_sum / count, 1)
        
    humidity_avg = None
    if (humidity_response.get("api_info").get("status") == "healthy"):
        humidity_sum = 0
        count = 0
        for humidity_reading in humidity_response.get("items")[0].get("readings"):
            humidity_sum += humidity_reading.get("value")
            count += 1
        if count != 0:
            humidity_avg = round(humidity_sum / count, 1)
    
    rainfall_arr = None
    if (rain_response.get("api_info").get("status") == "healthy"):
        rainfall_arr = []
        station_dict = {}
        for stations in rain_response.get("metadata").get("stations"):
            station_dict[stations.get("id")] = stations.get("name")
        for rain_reading in rain_response.get("items")[0].get("readings"):
            is_raining = rain_reading.get("value") != 0
            station_id = rain_reading.get("station_id")
            if (is_raining):
                rainfall_arr.append(station_dict.get(station_id))
        if len(rainfall_arr) > 1:
            rainfall_arr[-1] = "and " + rainfall_arr[-1]
            
    res = {
        "message": "Fetched Weather data.",
        "data": {
            "temperature": temp_avg,
            "rainfall": rainfall_arr,
            "humidity": humidity_avg
        }
    }
    
    return res
