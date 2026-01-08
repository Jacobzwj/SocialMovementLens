import requests
import os

url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
output_path = "webpage_example/src/data/world-110m.json"

# Ensure directory exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

try:
    print(f"Downloading {url}...")
    response = requests.get(url)
    response.raise_for_status()
    
    with open(output_path, 'wb') as f:
        f.write(response.content)
    print(f"Successfully saved to {output_path}")
    
except Exception as e:
    print(f"Error: {e}")
