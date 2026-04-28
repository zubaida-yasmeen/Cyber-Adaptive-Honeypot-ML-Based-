# **App Name**: Cyber-Adaptive Honeypot (ML-Based)

## Core Features:

- Synthetic Data Generation: Generate a small, synthetic dataset of network requests with specified features (frequency, payload_size, special_chars, path_type) and labels (Normal, Suspicious, Attack) for training the ML models.
- Automated Feature Engineering: Normalize network request features using StandardScaler and reduce dimensionality with PCA (2 components) to optimize subsequent machine learning processing.
- Machine Learning Model Training: Train and evaluate Logistic Regression, K-Nearest Neighbors, Naive Bayes, and MLPClassifier models for accurate network traffic classification within the Flask backend.
- Traffic Pattern Clustering: Apply KMeans to group network traffic patterns into 3 distinct clusters, aiding in anomaly detection and behavior analysis.
- Adaptive Action Recommendation: Implement a simple Q-learning tool to recommend dynamic security actions (allow, tarpit, block) based on real-time threat level states, providing proactive responses.
- Real-time Threat Prediction API: A Flask API endpoint ('/api/predict') that receives simulated network request features and outputs a JSON response including threat score, predicted class, cluster, and the recommended action.
- Predictive Analytics Dashboard: A Next.js frontend to visualize real-time threat predictions fetched from the backend API, updating the display with threat percentage, attack type, traffic cluster, and the system's adaptive decision.

## Style Guidelines:

- Primary color: A rich, digital blue (#2663D9) to represent a core security focus and sophisticated digital environment.
- Background color: A very dark, subtle blue-grey (#16181D) for a professional, modern, and high-tech feel, suitable for a security monitoring dashboard.
- Accent color: A vibrant, clear cyan (#67D0E4) to highlight critical alerts, actionable insights, and interactive elements, providing necessary visual contrast.
- Body and headline font: 'Inter' (sans-serif) for its modern, objective, and highly readable characteristics, ideal for displaying data and technical information efficiently.
- Code font: 'Source Code Pro' (monospace) for clear and legible display of any code snippets, parameters, or technical configurations within the interface.
- Utilize crisp, minimalist icons with a sleek digital aesthetic, highly relevant to network security, data visualization, and machine learning concepts (e.g., shield, gear, analytics charts).
- Implement a clean, modular dashboard layout focused on real-time data display, clear segregation of ML prediction outputs (threat score, class, cluster, action), and intuitive data interpretation.
- Incorporate subtle, smooth transition animations for data updates and component changes on the dashboard, emphasizing dynamic insights without causing distraction or interface clutter.