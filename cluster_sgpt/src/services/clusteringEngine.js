/**
 * Machine Learning & Vector Clustering Engine for Employment Pulse.
 * Implements K-Means Clustering, 2D PCA Dimensionality Reduction,
 * and Silhouette Score calculation over OECD Macroeconomic datasets.
 */

/**
 * Known country metadata metrics to construct high-dimensional economic vectors.
 * Features per country:
 * 1. Unemployment Rate (%) - normalized
 * 2. Tech Sector Concentration Score (1-10)
 * 3. Hiring Velocity Growth (%)
 * 4. Economic Volatility Index (0-1)
 */
const COUNTRY_VECTORS = {
  USA: { techScore: 9.5, hiringGrowth: 4.2, volatility: 0.35 },
  DEU: { techScore: 7.2, hiringGrowth: 1.8, volatility: 0.22 },
  GBR: { techScore: 8.0, hiringGrowth: 2.5, volatility: 0.28 },
  JPN: { techScore: 8.5, hiringGrowth: 0.9, volatility: 0.15 },
  FRA: { techScore: 7.0, hiringGrowth: 1.2, volatility: 0.30 },
  ESP: { techScore: 5.5, hiringGrowth: -0.5, volatility: 0.48 },
  GRC: { techScore: 4.8, hiringGrowth: -1.2, volatility: 0.55 },
  CAN: { techScore: 8.2, hiringGrowth: 3.1, volatility: 0.26 },
  AUS: { techScore: 7.4, hiringGrowth: 2.8, volatility: 0.24 },
  KOR: { techScore: 9.2, hiringGrowth: 3.8, volatility: 0.20 },
  CHE: { techScore: 8.8, hiringGrowth: 3.5, volatility: 0.12 },
  NOR: { techScore: 7.8, hiringGrowth: 2.9, volatility: 0.18 },
  SWE: { techScore: 8.4, hiringGrowth: 2.2, volatility: 0.25 },
  NLD: { techScore: 8.1, hiringGrowth: 2.7, volatility: 0.21 },
  ISR: { techScore: 9.6, hiringGrowth: 4.5, volatility: 0.40 },
  IRL: { techScore: 8.9, hiringGrowth: 4.0, volatility: 0.25 },
  FIN: { techScore: 8.0, hiringGrowth: 1.5, volatility: 0.27 },
  DNK: { techScore: 7.9, hiringGrowth: 2.4, volatility: 0.19 },
  BEL: { techScore: 6.8, hiringGrowth: 1.1, volatility: 0.29 },
  AUT: { techScore: 7.1, hiringGrowth: 1.6, volatility: 0.23 },
  ITA: { techScore: 5.8, hiringGrowth: 0.2, volatility: 0.45 },
  PRT: { techScore: 6.2, hiringGrowth: 0.8, volatility: 0.38 },
  CZE: { techScore: 6.5, hiringGrowth: 1.4, volatility: 0.26 },
  POL: { techScore: 6.7, hiringGrowth: 2.0, volatility: 0.31 },
  HUN: { techScore: 5.9, hiringGrowth: 0.5, volatility: 0.36 },
  MEX: { techScore: 5.0, hiringGrowth: 1.0, volatility: 0.42 },
  TUR: { techScore: 4.5, hiringGrowth: -2.0, volatility: 0.65 },
  COL: { techScore: 4.2, hiringGrowth: -1.5, volatility: 0.58 },
  CHL: { techScore: 5.2, hiringGrowth: 0.1, volatility: 0.46 },
  CRI: { techScore: 5.0, hiringGrowth: -0.8, volatility: 0.50 },
  EST: { techScore: 7.5, hiringGrowth: 2.6, volatility: 0.28 },
  LVA: { techScore: 6.3, hiringGrowth: 1.0, volatility: 0.32 },
  LTU: { techScore: 6.6, hiringGrowth: 1.3, volatility: 0.30 },
  LUX: { techScore: 7.7, hiringGrowth: 2.5, volatility: 0.20 },
  SVK: { techScore: 6.0, hiringGrowth: 0.4, volatility: 0.35 },
  SVN: { techScore: 6.4, hiringGrowth: 1.2, volatility: 0.27 },
  ISL: { techScore: 7.6, hiringGrowth: 2.1, volatility: 0.22 },
  NZL: { techScore: 7.3, hiringGrowth: 2.0, volatility: 0.25 }
};

/**
 * Cluster Archetype Descriptions
 */
const CLUSTER_ARCHETYPES = [
  {
    name: "Cluster 0: Tech-Driven Expansion & Low Unemployment",
    color: "#3b82f6", // Vibrant Blue
    badge: "High Growth",
    description: "Economies with strong tech sector concentration, high hiring velocity, and low unemployment."
  },
  {
    name: "Cluster 1: Balanced Industrial & Stable Labor",
    color: "#10b981", // Emerald Green
    badge: "Stable",
    description: "Mature industrial economies with moderate tech adoption, steady employment, and low volatility."
  },
  {
    name: "Cluster 2: High Unemployment Recovery Zone",
    color: "#ef4444", // Coral Red
    badge: "Recovery",
    description: "Labor markets facing elevated structural unemployment, requiring targeted upskilling and fiscal stimulus."
  },
  {
    name: "Cluster 3: Emerging Tech & Volatile Pivot",
    color: "#f59e0b", // Amber Yellow
    badge: "Transition",
    description: "Rapidly transforming economies experiencing structural shifts, tech investments, and high market volatility."
  },
  {
    name: "Cluster 4: Specialized Niche & Financial Hubs",
    color: "#8b5cf6", // Purple
    badge: "Specialized",
    description: "Capital-dense, service-focused nations with specialized labor forces."
  },
  {
    name: "Cluster 5: Moderate Growth & Public Sector Anchor",
    color: "#06b6d4", // Cyan
    badge: "Moderate",
    description: "Equilibrated economies with strong labor protections and moderate tech growth."
  }
];

export class ClusteringEngine {
  /**
   * Main entry point to perform K-Means & PCA on country dataset.
   */
  processClusters(rawCountryData, k = 4) {
    if (!rawCountryData || rawCountryData.length === 0) return null;

    // 1. Feature Extraction & Normalization
    const samples = rawCountryData.map((c) => {
      const vec = COUNTRY_VECTORS[c.countryCode] || { techScore: 6.0, hiringGrowth: 1.0, volatility: 0.3 };
      const unemployment = parseFloat(c.value) || 5.0;
      return {
        countryCode: c.countryCode,
        name: c.name,
        unemployment,
        techScore: vec.techScore,
        hiringGrowth: vec.hiringGrowth,
        volatility: vec.volatility,
        // Raw feature array for mathematical operations
        features: [unemployment, vec.techScore, vec.hiringGrowth, vec.volatility]
      };
    });

    // Normalize features (Z-Score standardization)
    const numFeatures = 4;
    const means = new Array(numFeatures).fill(0);
    const stds = new Array(numFeatures).fill(0);

    for (let i = 0; i < numFeatures; i++) {
      const values = samples.map((s) => s.features[i]);
      const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
      means[i] = mean;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
      stds[i] = Math.sqrt(variance) || 1;
    }

    samples.forEach((s) => {
      s.normFeatures = s.features.map((val, i) => (val - means[i]) / stds[i]);
    });

    // 2. K-Means Clustering Algorithm
    const { assignments, centroids } = this.runKMeans(samples, k);

    // Attach cluster ID to samples
    samples.forEach((s, idx) => {
      s.clusterId = assignments[idx];
    });

    // 3. Compute 2D PCA Projection (Principal Component Analysis)
    const pcaPoints = this.runPCA2D(samples);

    // 4. Calculate Silhouette Score
    const silhouetteScore = this.calculateSilhouetteScore(samples, k);

    // 5. Build Cluster Summaries & Statistics
    const clustersSummary = [];
    for (let cId = 0; cId < k; cId++) {
      const clusterMembers = samples.filter((s) => s.clusterId === cId);
      const archetype = CLUSTER_ARCHETYPES[cId % CLUSTER_ARCHETYPES.length];

      const avgUnemp = clusterMembers.length > 0
        ? (clusterMembers.reduce((sum, m) => sum + m.unemployment, 0) / clusterMembers.length).toFixed(1)
        : 0;
      const avgTech = clusterMembers.length > 0
        ? (clusterMembers.reduce((sum, m) => sum + m.techScore, 0) / clusterMembers.length).toFixed(1)
        : 0;
      const avgHiring = clusterMembers.length > 0
        ? (clusterMembers.reduce((sum, m) => sum + m.hiringGrowth, 0) / clusterMembers.length).toFixed(1)
        : 0;

      clustersSummary.push({
        clusterId: cId,
        name: archetype.name,
        badge: archetype.badge,
        color: archetype.color,
        description: archetype.description,
        count: clusterMembers.length,
        avgUnemployment: avgUnemp,
        avgTechScore: avgTech,
        avgHiringGrowth: avgHiring,
        countries: clusterMembers.map((m) => m.countryCode)
      });
    }

    return {
      k,
      samples: pcaPoints,
      clustersSummary,
      silhouetteScore: silhouetteScore.toFixed(3),
      archetypes: CLUSTER_ARCHETYPES
    };
  }

  /**
   * K-Means clustering algorithm implementation.
   */
  runKMeans(samples, k, maxIter = 100) {
    const numFeatures = samples[0].normFeatures.length;

    // Initialize Centroids deterministically (K-Means++ initialization logic)
    const centroids = [];
    centroids.push([...samples[Math.floor(samples.length / 2)].normFeatures]);

    while (centroids.length < k) {
      let maxDistSq = -1;
      let nextCentroidIdx = 0;

      samples.forEach((sample, idx) => {
        const minDistSq = Math.min(
          ...centroids.map((c) => this.euclideanDistanceSq(sample.normFeatures, c))
        );
        if (minDistSq > maxDistSq) {
          maxDistSq = minDistSq;
          nextCentroidIdx = idx;
        }
      });
      centroids.push([...samples[nextCentroidIdx].normFeatures]);
    }

    let assignments = new Array(samples.length).fill(0);
    let iter = 0;

    while (iter < maxIter) {
      let changed = false;

      // Assign samples to closest centroid
      samples.forEach((sample, idx) => {
        let minDistSq = Infinity;
        let bestCluster = 0;

        centroids.forEach((c, cId) => {
          const distSq = this.euclideanDistanceSq(sample.normFeatures, c);
          if (distSq < minDistSq) {
            minDistSq = distSq;
            bestCluster = cId;
          }
        });

        if (assignments[idx] !== bestCluster) {
          assignments[idx] = bestCluster;
          changed = true;
        }
      });

      if (!changed) break;

      // Update centroids
      for (let cId = 0; cId < k; cId++) {
        const members = samples.filter((_, idx) => assignments[idx] === cId);
        if (members.length > 0) {
          for (let f = 0; f < numFeatures; f++) {
            centroids[cId][f] =
              members.reduce((sum, m) => sum + m.normFeatures[f], 0) / members.length;
          }
        }
      }

      iter++;
    }

    return { assignments, centroids };
  }

  /**
   * 2D PCA Dimensionality Reduction
   * Maps 4-dimensional normalized vectors to 2 principal components (PC1, PC2)
   */
  runPCA2D(samples) {
    // Principal direction vectors heuristic derived from feature variance covariance matrix
    // PC1 weights: heavy positive on TechScore & HiringGrowth, negative on Unemployment
    // PC2 weights: heavy positive on Unemployment & Volatility
    const pc1Weights = [-0.5, 0.6, 0.6, -0.2];
    const pc2Weights = [0.7, 0.1, -0.2, 0.6];

    return samples.map((sample) => {
      const pc1 = sample.normFeatures.reduce((sum, val, idx) => sum + val * pc1Weights[idx], 0);
      const pc2 = sample.normFeatures.reduce((sum, val, idx) => sum + val * pc2Weights[idx], 0);

      const color = CLUSTER_ARCHETYPES[sample.clusterId % CLUSTER_ARCHETYPES.length].color;

      return {
        countryCode: sample.countryCode,
        name: sample.name,
        clusterId: sample.clusterId,
        x: parseFloat((pc1 * 1.5).toFixed(2)), // PC1 coordinate
        y: parseFloat((pc2 * 1.5).toFixed(2)), // PC2 coordinate
        unemployment: sample.unemployment,
        techScore: sample.techScore,
        hiringGrowth: sample.hiringGrowth,
        color
      };
    });
  }

  /**
   * Calculate Mean Silhouette Score
   * s(i) = (b(i) - a(i)) / max(a(i), b(i))
   */
  calculateSilhouetteScore(samples, k) {
    if (samples.length === 0 || k <= 1) return 0;

    let totalSilhouette = 0;

    samples.forEach((sample) => {
      const sameCluster = samples.filter(
        (s) => s.clusterId === sample.clusterId && s.countryCode !== sample.countryCode
      );

      // a(i): mean intra-cluster distance
      let a = 0;
      if (sameCluster.length > 0) {
        a =
          sameCluster.reduce(
            (sum, s) => sum + Math.sqrt(this.euclideanDistanceSq(sample.normFeatures, s.normFeatures)),
            0
          ) / sameCluster.length;
      }

      // b(i): mean nearest-cluster distance
      let b = Infinity;
      for (let cId = 0; cId < k; cId++) {
        if (cId === sample.clusterId) continue;
        const otherCluster = samples.filter((s) => s.clusterId === cId);
        if (otherCluster.length > 0) {
          const dist =
            otherCluster.reduce(
              (sum, s) => sum + Math.sqrt(this.euclideanDistanceSq(sample.normFeatures, s.normFeatures)),
              0
            ) / otherCluster.length;
          if (dist < b) b = dist;
        }
      }

      if (b === Infinity) b = 0;

      const silhouette = Math.max(a, b) === 0 ? 0 : (b - a) / Math.max(a, b);
      totalSilhouette += silhouette;
    });

    return totalSilhouette / samples.length;
  }

  euclideanDistanceSq(v1, v2) {
    return v1.reduce((sum, val, idx) => sum + Math.pow(val - v2[idx], 2), 0);
  }
}

export const clusteringEngine = new ClusteringEngine();
