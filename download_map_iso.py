import requests
import os

# This source uses ISO Alpha-3 codes as IDs (e.g. "USA")
url = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"
output_path = "webpage_example/src/data/world-iso.json"

try:
    print(f"Downloading {url}...")
    response = requests.get(url, timeout=10) # 10s timeout
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)
    print(f"Successfully saved to {output_path}")
    
except Exception as e:
    print(f"Error: {e}")
