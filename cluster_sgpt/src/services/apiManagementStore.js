/**
 * API Management & Developer Gateway Store for Employment Pulse.
 * Handles API key provisioning, rate limits, telemetry metrics (RPS, Latency, Status),
 * interactive sandbox executions, and webhook configurations.
 */

const STORAGE_KEYS = {
  KEYS: "emp_api_keys_v1",
  WEBHOOKS: "emp_api_webhooks_v1"
};

const INITIAL_KEYS = [
  {
    id: "key_prod_01",
    name: "Production Gateway Key",
    key: "emp_live_9a8f7c6e5d4c3b2a1",
    created: "2026-06-15",
    rateLimit: "1,000 req/min",
    environment: "Production",
    status: "Active",
    lastUsed: "2 mins ago"
  },
  {
    id: "key_dev_02",
    name: "Staging Pipeline Key",
    key: "emp_test_3b2a19a8f7c6e5d4c",
    created: "2026-07-01",
    rateLimit: "100 req/min",
    environment: "Staging",
    status: "Active",
    lastUsed: "1 hour ago"
  }
];

const API_ENDPOINTS = [
  {
    id: "get-employment",
    method: "GET",
    path: "/v1/employment/live",
    summary: "Fetch OECD real-time employment rates & dominant signals",
    responseExample: {
      status: "success",
      count: 38,
      data: [
        { countryCode: "USA", name: "United States", unemploymentRate: "4.1%", signal: "HIRING" },
        { countryCode: "DEU", name: "Germany", unemploymentRate: "3.4%", signal: "STABLE" }
      ]
    }
  },
  {
    id: "post-clusters",
    method: "POST",
    path: "/v1/clusters/vector-space",
    summary: "Execute K-Means vector clustering & 2D PCA projection",
    responseExample: {
      k_clusters: 4,
      silhouette_score: 0.542,
      clusters: [
        { id: 0, archetype: "Tech-Driven Expansion", countries: ["USA", "JPN", "CHE"] }
      ]
    }
  },
  {
    id: "post-gpt-analyze",
    method: "POST",
    path: "/v1/gpt/analyze",
    summary: "Run Small GPT labor market inference on custom prompt",
    responseExample: {
      category: "Predictive Intelligence",
      confidence: 0.94,
      result: "High demand (+18% YoY) for ML Infrastructure & Data Engineering.",
      tokensUsed: 142
    }
  },
  {
    id: "get-layoffs",
    method: "GET",
    path: "/v1/signals/layoffs",
    summary: "Fetch tech layoff news feed & vulnerability triggers",
    responseExample: {
      total_records: 5,
      items: [
        { company: "TechCorp", impact: "Strategic Pivot", timestamp: "Recent" }
      ]
    }
  }
];

export class ApiManagementStore {
  constructor() {
    this.keys = this.loadKeys();
    this.webhooks = this.loadWebhooks();
  }

  loadKeys() {
    const stored = localStorage.getItem(STORAGE_KEYS.KEYS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(INITIAL_KEYS));
      return INITIAL_KEYS;
    }
    return JSON.parse(stored);
  }

  saveKeys() {
    localStorage.setItem(STORAGE_KEYS.KEYS, JSON.stringify(this.keys));
  }

  generateKey(name, environment = "Production", rateLimit = "500 req/min") {
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newKey = {
      id: `key_${Date.now()}`,
      name: name || "New API Key",
      key: `emp_${environment === "Production" ? "live" : "test"}_${randomHex}`,
      created: new Date().toISOString().split("T")[0],
      rateLimit,
      environment,
      status: "Active",
      lastUsed: "Just now"
    };

    this.keys.unshift(newKey);
    this.saveKeys();
    return newKey;
  }

  revokeKey(keyId) {
    this.keys = this.keys.map((k) => (k.id === keyId ? { ...k, status: "Revoked" } : k));
    this.saveKeys();
  }

  deleteKey(keyId) {
    this.keys = this.keys.filter((k) => k.id !== keyId);
    this.saveKeys();
  }

  loadWebhooks() {
    const stored = localStorage.getItem(STORAGE_KEYS.WEBHOOKS);
    if (!stored) return [
      { id: "wh_1", url: "https://api.yourcompany.com/hooks/layoffs", event: "layoff.spike_detected", status: "Enabled" }
    ];
    return JSON.parse(stored);
  }

  addWebhook(url, event) {
    const newWh = {
      id: `wh_${Date.now()}`,
      url,
      event,
      status: "Enabled"
    };
    this.webhooks.push(newWh);
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(this.webhooks));
    return newWh;
  }

  getEndpoints() {
    return API_ENDPOINTS;
  }

  /**
   * Generates realistic telemetry time-series metrics for API monitoring.
   */
  getTelemetryMetrics() {
    const times = ["09:00", "09:05", "09:10", "09:15", "09:20", "09:25", "09:30", "09:35"];
    
    const rpsData = times.map((t) => ({
      time: t,
      requests: Math.floor(Math.random() * 400) + 800,
      errors: Math.floor(Math.random() * 12) + 2
    }));

    const latencyData = times.map((t) => ({
      time: t,
      p50: Math.floor(Math.random() * 8) + 12,
      p95: Math.floor(Math.random() * 25) + 42,
      p99: Math.floor(Math.random() * 50) + 95
    }));

    const statusDistribution = [
      { name: "200 OK", value: 8420, color: "#10b981" },
      { name: "304 Not Modified", value: 1210, color: "#3b82f6" },
      { name: "401 Unauthorized", value: 85, color: "#f59e0b" },
      { name: "429 Rate Limited", value: 42, color: "#8b5cf6" },
      { name: "500 Server Error", value: 18, color: "#ef4444" }
    ];

    return { rpsData, latencyData, statusDistribution };
  }

  /**
   * Code snippet generator for API requests across 5 languages
   */
  generateCodeSnippet(endpointPath, method, key = "emp_live_9a8f7c6e5d4c3b2a1", language = "python") {
    const baseUrl = "https://api.employmentpulse.io";

    switch (language) {
      case "python":
        return `import requests

url = "${baseUrl}${endpointPath}"
headers = {
    "Authorization": "Bearer ${key}",
    "Content-Type": "application/json"
}

response = requests.${method.toLowerCase()}(url, headers=headers)
print(response.json())`;

      case "javascript":
        return `const response = await fetch('${baseUrl}${endpointPath}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer ${key}',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);`;

      case "curl":
        return `curl -X ${method} "${baseUrl}${endpointPath}" \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json"`;

      case "rust":
        return `use reqwest::header::{HEADER, AUTHORIZATION};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let res = client.${method.toLowerCase()}("${baseUrl}${endpointPath}")
        .header(AUTHORIZATION, "Bearer ${key}")
        .send()
        .await?
        .text()
        .await?;
    println!("{}", res);
    Ok(())
}`;

      case "go":
        return `package main

import (
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    url := "${baseUrl}${endpointPath}"
    req, _ := http.NewRequest("${method}", url, nil)
    req.Header.Add("Authorization", "Bearer ${key}")

    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    body, _ := ioutil.ReadAll(res.Body)
    fmt.Println(string(body))
}`;

      default:
        return "";
    }
  }
}

export const apiManagementStore = new ApiManagementStore();
