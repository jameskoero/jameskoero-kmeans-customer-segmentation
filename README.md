# K-Means Customer Segmentation
### Unsupervised Machine Learning for Retail Strategy

Author: James Koero - ML Engineer - Kisumu, Kenya
Built on: Android Google Colab - June 2026
Dataset: Mall Customers - Kaggle - 200 rows

---

## Problem Statement

Retail businesses routinely treat all customers the same.
Same promotions, same messaging, same pricing strategy.
This ignores the reality that customers differ dramatically
in income levels, age profiles, and willingness to spend.

The question this project answers:
Can an unsupervised ML algorithm reveal distinct customer
groups from raw behaviour alone with no prior labels?

---

## Why K-Means

Algorithm comparison:
- DBSCAN: struggles with varying density, needs epsilon tuning
- Hierarchical: computationally expensive, poor scalability
- Gaussian Mixture: harder to explain to business stakeholders
- Spectral Clustering: requires kernel selection, not interpretable

K-Means was chosen because:
- Low-dimensional dataset 3 features, ideal for K-Means
- Clusters are roughly spherical in the feature space
- Business stakeholders need interpretable named segments
- Elbow Method gives a reproducible defensible K selection

---

## Why This Dataset

1. Relevance: income and spending behaviour are universal
   retail variables applicable across African and global markets
2. Cleanliness: zero null values, no data cleaning debt
3. Interpretability: three features a business owner acts on
4. Reproducibility: publicly available free on Kaggle

---

## Project Structure

    jameskoero-kmeans-customer-segmentation/
    +-- README.md
    +-- mall_customers_segmented.csv
    +-- visuals/
        +-- elbow_curve.png
        +-- customer_clusters.png
        +-- radar_profiles.png
        +-- business_insights.png

---

## Methodology

### 1. Data Loading and Exploration
- 200 rows, 5 columns, zero null values
- Spending Score: 1-100 mall-assigned behavioural metric
- Annual Income: 15-137 k dollars
- Age: 18-70 years

### 2. Preprocessing
K-Means uses Euclidean distance. Without scaling, Annual
Income range of 122000 units completely dominates Spending
Score range of 99 units. StandardScaler was applied.
Mean=0, std=1, so every feature contributes equally.

### 3. Optimal K - Elbow Method
K-Means ran for K=1 through K=10. Inertia was recorded
at each K. The elbow occurs at K=5. Beyond this point
additional clusters produce diminishing inertia reduction.

### 4. Model Training
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    df[Cluster] = kmeans.fit_predict(X_scaled)

random_state=42 ensures full reproducibility.
n_init=10 runs 10 times selecting the best result.

---

## Results - Cluster Profiles

| Cluster | Name                 | Avg Age | Avg Income | Avg Spend | Count |
|---------|----------------------|---------|------------|-----------|-------|
| 0       | Careful Spenders     | 41      | 88k$       | 17        | 35    |
| 1       | High Value Champions | 33      | 86k$       | 82        | 39    |
| 2       | Average Segment      | 43      | 55k$       | 49        | 81    |
| 3       | Enthusiastic Spenders| 25      | 26k$       | 79        | 22    |
| 4       | Budget Conscious     | 45      | 26k$       | 20        | 23    |

---

## Business Insights and Strategy

### Cluster 0 - Careful Spenders
Profile: High income 88k, very low spending score 17
Insight: Highest revenue opportunity in the dataset.
These customers have purchasing power but are not converting.
Strategy: Premium loyalty cards, exclusive early access,
personalised high-value product recommendations.

### Cluster 1 - High Value Champions
Profile: High income 86k, high spending score 82
Insight: VIP segment. Already spending at capacity.
Losing one VIP costs more than losing five average customers.
Strategy: VIP-only events, dedicated relationship managers,
proactive retention before any sign of disengagement.

### Cluster 2 - Average Segment
Profile: Mid income 55k, mid spending score 49
Insight: Largest group, 81 customers, 40.5 percent of base.
A 10 percent spending increase here moves revenue more than
any other segment.
Strategy: Bundle offers, time-limited promotions,
loyalty points to nudge behaviour upward.

### Cluster 3 - Enthusiastic Spenders
Profile: Low income 26k, high spending score 79
Insight: Young customers average age 25, spending beyond income.
High engagement but financial sustainability risk exists.
Strategy: BNPL options, affordable product lines,
budget-friendly bundles that sustain enthusiasm.

### Cluster 4 - Budget Conscious
Profile: Low income 26k, low spending score 20
Insight: Price-sensitive but present. They visit but
do not convert at current pricing.
Strategy: Discount days, value packs, loss-leader
products to drive footfall and build purchase habit.

---

## Visuals

### Elbow Curve - Optimal K Selection


![Elbow Curve](visuals/elbow_curve.png)



### Customer Segmentation Scatter Plot


![Customer Clusters](visuals/customer_clusters.png)



### Cluster Radar Profiles


![Radar Profiles](visuals/radar_profiles.png)



### Business Insights Bar Chart


![Business Insights](visuals/business_insights.png)



---

## Key Finding

Cluster 0 customers earn as much as Cluster 1 VIPs
but spend at the level of Budget Conscious customers.
This gap is not a data anomaly. It is an untapped
revenue stream waiting for the right targeting strategy.

---

## Reproducibility

    git clone https://github.com/jameskoero/jameskoero-kmeans-customer-segmentation.git
    pip install pandas numpy scikit-learn matplotlib seaborn

Dataset: https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python

---

## Tools and Environment

| Tool          | Purpose                        |
|---------------|--------------------------------|
| Python 3.12   | Core language                  |
| pandas        | Data loading and manipulation  |
| scikit-learn  | StandardScaler and KMeans      |
| matplotlib    | All visualisations             |
| Google Colab  | Execution environment          |
| Android phone | Entire project built on mobile |

---

## About the Author

James Koero is a self-taught ML engineer based in Kisumu,
Kenya, building applied ML systems targeting remote roles
and European MSc AI admissions. Background: B.Sc. Physics
and Mathematics, Moi University. Prior experience in
geophysics and reservoir engineering at KenGen Olkaria
geothermal fields. This project was built entirely on an
Android phone using Google Colab and mobile data.

Portfolio: nyando-flood-api.onrender.com/docs
LinkedIn: linkedin.com/in/jameskoero
GitHub: github.com/jameskoero
