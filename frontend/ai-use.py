import requests
import json

url = "http://localhost:11434/api/generate"
headers = {'Content-Type': 'application/json'}

data = {
    "model": "qwen2.5:latest",
    "prompt": "哇袄",
    "stream": False
}

response = requests.post(url, json=data)
result = response.json()

print(result["response"])
