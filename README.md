# AI-Driven Energy Management Solution

This repository hosts an AI-driven solution designed to tackle modern energy management challenges by leveraging advanced technologies. The project integrates multiple cutting-edge components to provide a comprehensive platform for sustainable energy optimization and green building practices.

## Key Features

### 1. Multi-Agent Retrieval-Augmented Generation (RAG) System
- Powered by local Large Language Models (LLMs) to retrieve, process, and recommend:
  - Green building standards
  - Sustainable materials
  - Energy optimization strategies
- Utilizes **ChromaDB** as a vector database to store:
  - Regulatory documents
  - Leeds certificates
  - Sustainability resources
- Employs **Mistral OCR** to extract information from PDF files.

### 2. Fast and Context-Aware Recommendations
- Provides real-time, local, and context-aware recommendations through a **Flask API**.
- Ensures seamless access for users with minimal latency.

### 3. Advanced Visualization and Analysis Tools
- **3D Visualization** capabilities for IDF building designs.
- Integration with **EnergyPlus** for detailed energy analysis.
- Floor plan generation using diffusion models like **Stable Diffusion**.

### 4. User-Friendly Interface
- Designed for both technical and non-technical users.
- Intuitive and user friendly interface for a seamless experience.

## Target Audience
This solution empowers stakeholders such as:
- Urban planners
- Engineers

By providing actionable insights, the platform helps reduce energy consumption, enhance sustainability, and promote healthier living environments.

## Development Environment

### Google Colab for Backend Services
The **Floor Plan Generator Service** currently is designed to run in a Google Colab environment to leverage its GPU capabilities. Ensure you have access to Google Colab and configure the notebook accordingly.

## Additional Resources
- For more information on Angular CLI, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
- For details on the diffusion models used in the floor plan generator, refer to the [Diffusion Models Repository](https://github.com/mariaaoprea/Diffusion-Models-for-floor-plan-drafting).
- **3D Visualization** originally forked from this repository: [Spider 2020](https://github.com/ladybug-tools/spider-2020). A specific project was used and its UI was modified for this project. The edited version can be found here: [Spider-Idf-Viewer](https://github.com/MohamedAbdelfattah022/Spider-Idf-Viewer).
- **Energy Analysis and EnergyPlus Service** is implemented in this repository: [EnergyPlus-API](https://github.com/MohamedAbdelfattah022/EnergyPlus-API).

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.