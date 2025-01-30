import { Request, Response, Router } from "express";
import natural from "natural"; // Import the entire module

// Destructure the required exports
const { WordTokenizer, PorterStemmer } = natural;

const tfidf = new natural.TfIdf();
const tokenizer = new WordTokenizer();
const stemmer = PorterStemmer;

// Custom stopwords list
const stopwords = [
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "if",
  "in",
  "on",
  "with",
  "as",
  "by",
  "for",
  "of",
  "at",
  "to",
  "from",
  "up",
  "down",
  "out",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
];

const professors = [
  {
    name: "Manar Qamhieh",
    position:
      "Director of the Department of Electrical and Computer Engineering",
    email: "m.qamhieh@najah.edu",
    research: `
      Edge Computing Systems: Modeling and Resource Optimization for Augmented Reality and Soft Real-time Applications.
      Developing and Applying Online Basic Programming Tools to School Students in a Developing Country.
      PCRS: Personalized Career-path Recommender System for Engineering Students.
      Applying Blended Learning in Programming Courses.
      A Leader-Follower Communication Protocol for Multi-Agent Robotic Systems.
      Stretching Algorithm for Global Scheduling of Real-Time DAG Tasks.
      Simulation-Based Evaluations of DAG Scheduling in Hard Real-Time Multiprocessor Systems.
      Schedulability Analysis for Directed Acyclic Graphs on Multiprocessor Systems at a Subtask Level.
      Experimental Analysis of the Tardiness of Parallel Tasks in Soft Real-Time Systems.
      Global EDF Scheduling of Directed Acyclic Graphs on Multiprocessor Systems.
      Graph-to-Segment Transformation Technique Minimizing the Number of Processors for Real-time Multiprocessor Systems.
      A Parallelizing Algorithm for Real-Time Tasks of Directed Acyclic Graphs Model.
    `,
  },
  {
    name: "Imad Natsheh",
    position: "Associate Professor",
    email: "e.natsheh@najah.edu",
    research: `
      Triangulation-Enhanced WiFi-Based Autonomous Localization and Navigation System: A Low-Cost Approach.
      Localization Process for WSNs with Various Grid-Based Topology Using Artificial Neural Network.
      Indoor WiFi-Beacon Dataset Construction Using Autonomous Low-Cost Robot for 3D Location Estimation.
      Radio Map Generation Approaches for an RSSI-Based Indoor Positioning System.
      Assessment of Existing Pavement Distresses Utilizing ArcMap-GIS: The Case of Nablus City.
      A Multi-Level World Comprehensive Neural Network Model for Maximum Annual Solar Irradiation on a Flat Surface.
      Tree Search Fuzzy NARX Neural Network Fault Detection Technique for PV Systems with IoT Support.
      Intelligent Controller for Tracking the MPP of a PV System under Partial Shaded Conditions.
      Intelligent PV Panels Fault Diagnosis Method Based on NARX Network and Linguistic Fuzzy Rule-Based Systems.
      Toward Better PV Panel’s Output Power Prediction: A Module Based on Nonlinear Autoregressive Neural Network with Exogenous Inputs.
      Intelligent Real-Time Photovoltaic Panel Monitoring System Using Artificial Neural Networks.
      Modeling the Output Power of Heterogeneous Photovoltaic Panels Based on Artificial Neural Networks Using Low-Cost Microcontrollers.
      Power Generation of Solar PV Systems in Palestine.
      Sizing of a Standalone Photovoltaic Water Pumping System Using a Multi-Objective Evolutionary Algorithm.
      An Automated Tool for Solar Power Systems.
      Intelligent Controller for Managing Power Flow within Stand-Alone Hybrid Power Systems.
      Hybrid Power Systems Energy Controller Based on Neural Network and Fuzzy Logic.
      Solar Power Plant Performance Evaluation: Simulation and Experimental Validation.
      Modeling and Control for Smart Grid Integration of Solar/Wind Energy Conversion System.
      PV System Monitoring and Performance of a Grid-Connected PV Power Station Located in Manchester, UK.
      Photovoltaic Model with MPP Tracker for Standalone/Grid-Connected Applications.
    `,
  },
  {
    name: "Ashraf Armoush",
    position: "Assistant Professor",
    email: "armoush@najah.edu",
    research: `
      Towards the Integration of Security and Safety Patterns in the Design of Safety-Critical Embedded Systems.
      An Approach for Using Mobile Devices in Industrial Safety-Critical Embedded Systems.
      Safety Recommendations for Safety-Critical Design Patterns.
      Safety Assessment of Design Patterns for Safety-Critical Embedded Systems.
      Design Pattern Representation for Safety-Critical Embedded Systems.
      A Hybrid Fault Tolerance Method for Recovery Block with a Weak Acceptance Test.
      Recovery Block with Backup Voting: A New Pattern with Extended Representation for Safety-Critical Embedded Systems.
      Effective Pattern Representation for Safety Critical Embedded Systems.
      Compound Global and Local Two-Level Adaptive Branch Predictor.
    `,
  },
  {
    name: "Sufyan Samara",
    position: "Associate Professor",
    email: "sufyan_sa@najah.edu",
    research: `
      Edge Computing Systems: Modeling and Resource Optimization for Augmented Reality and Soft Real-Time Applications.
      A Multi-Level World Comprehensive Neural Network Model for Maximum Annual Solar Irradiation on a Flat Surface.
      Tree Search Fuzzy NARX Neural Network Fault Detection Technique for PV Systems with IoT Support.
      Intelligent PV Panels Fault Diagnosis Method Based on NARX Network and Linguistic Fuzzy Rule-Based Systems.
      Toward Better PV Panel’s Output Power Prediction: A Module Based on Nonlinear Autoregressive Neural Network with Exogenous Inputs.
      Intelligent Real-Time Photovoltaic Panel Monitoring System Using Artificial Neural Networks.
      Modeling the Output Power of Heterogeneous Photovoltaic Panels Based on Artificial Neural Networks Using Low-Cost Microcontrollers.
      Accelerating Online Model Checking.
      Integrate Online Model Checking into Distributed Reconfigurable System on Chip with Adaptable OS Services.
      Partitioning Granularity, Communication Overhead, and Adaptation in OS Services for Distributed Reconfigurable Systems on Chip.
      Real-time Adaptation and Load Balancing-Aware OS Services for Distributed Reconfigurable System on Chip.
      On-line Model Checking as Operating System Service.
      Self-Adaptive OS Service Model in Relaxed Resource Distributed Reconfigurable System on Chip (RSoC).
    `,
  },
  {
    name: "Samer Arandi",
    position: "Assistant Professor",
    email: "arandi@najah.edu",
    research: `
      Data-Driven Thread Execution on Heterogeneous Processors.
      Combining Compile and Run-Time Dependency Resolution in Data-Driven Multithreading.
      Automatic Code Generation for DDM-VM in GCC Using GRAPHITE: A Field Report.
      Programming Multi-Core Architectures Using Data-Flow Techniques.
      TFlux: A Portable Platform for Data-Driven Multithreading on Commodity Multicore Systems.
      DDM-VMs: The Data-Driven Multithreading Virtual Machine for Symmetric Multicores.
      DDM-Cell: Data-Driven Multithreading on the Cell Processor.
      DDM-Vmc: The Data-Drive Multithreading Virtual Machine for the Cell Processor.
    `,
  },
  {
    name: "Hanal Abu Zant",
    position: "Assistant Professor",
    email: "hhanal@najah.edu",
    research: `
      Comparative Analysis to Evaluate FQ-EDCA in Wireless Ad-Hoc Networks.
      Comparative Analysis to Evaluate FQ-EDCA in Wireless Networks.
      FQ-EDCA: An Extension of EDCA to Improve Fairness in Ad-Hoc Wireless Network.
      Fair Queuing Model for EDCA to Optimize QoS in Ad-Hoc Wireless Network.
      Optimizing the Quality of Service in Wireless Networks.
      Routing and Fairness to Improve the Quality of Service in Ad-Hoc Wireless Networks.
    `,
  },
  {
    name: "Anas Toma",
    position:
      "Assistant Professor, Coordinator of the Master's program in Artificial Intelligence",
    email: "anas.toma@najah.edu",
    research: `
      Edge Computing Systems: Modeling and Resource Optimization for Augmented Reality and Soft Real-Time Applications.
      A Cloud-Based Deep Learning Framework for Early Detection of Pushing at Crowded Event Entrances.
      Covid-19 Severity and Urban Factors: Investigation and Recommendations Based on Machine Learning Techniques.
      An Efficient System for Automatic Blood Type Determination Based on Image Matching Techniques.
      Nanoparticle Classification Using Frequency Domain Analysis on Resource-Limited Platforms.
      Adaptive Quality Optimization of Computer Vision Tasks in Resource-Constrained Devices Using Edge Computing.
      Resource-Efficient Nanoparticle Classification Using Frequency Domain Analysis.
      (Best Paper Award) Real-Time Low SNR Signal Processing for Nanoparticle Analysis with Deep Neural Networks.
    `,
  },
  {
    name: "Luai Malhis",
    position: "Professor",
    email: "malhis@najah.edu",
    research: `
      A Systematic Approach for Building Processors in a Computer Design Lab Course at Universities in Developing Countries.
      An Educational Processor: A Design Approach.
      An Efficient Two-Stage Iterative Method for the Steady-State Analysis of Markov Regenerative Stochastic Petri Net Models.
      Numerical Performability Evaluation of A Group Multicast Protocol.
      Numerical Evaluation of A Group-Oriented Multicast Protocol Using Stochastic Activity Networks.
      Modeling Recycle: A Case Study in the Industrial Use of Measurement and Modeling.
      Numerical Evaluation of a Group-Oriented Multicast Protocol Using Stochastic Activity Networks.
      Modeling Recycle: A Case Study in the Industrial Use of Modeling.
      Dependability Evaluation Using Composed SAN-Based Reward Models.
    `,
  },
];

interface Professor {
  name: string;
  position: string;
  email: string;
  research: string;
}

interface Recommendation {
  name: string;
  position: string;
  email: string;
  researchSummary: string;
  similarityScore: string;
  rating: number;
}

// Preprocess text: normalize, tokenize, remove stopwords, and stem
function preprocessText(text: string): string {
  if (!text) return ""; // Handle empty text

  return text
    .toLowerCase() // Normalize to lowercase
    .replace(/[^\w\s.]/g, "") // Remove punctuation
    .split(/\s+/) // Tokenize
    .filter((word) => !stopwords.includes(word)) // Remove stopwords
    .map((word) => stemmer.stem(word)) // Stem words
    .join(" "); // Rejoin into a single string
}

// Create a research summary (first 2-3 sentences)
function createResearchSummary(researchText: string): string {
  if (!researchText) return ""; // Handle empty text

  const sentences = researchText.split(".");
  return sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "." : "");
}

// Precompute TF-IDF scores for all professors' research texts
function precomputeTfIdf(professors: Professor[]) {
  professors.forEach((prof) => {
    const processedResearch = preprocessText(prof.research);
    tfidf.addDocument(processedResearch);
  });
}

// Recommend professors based on a query
function recommendProfessors(
  query: string,
  professors: Professor[]
): Recommendation[] {
  const processedQuery = preprocessText(query);

  // Calculate similarity scores
  const similarityScores = professors.map((prof, index) => {
    const score = tfidf.tfidf(processedQuery, index);
    return { index, score };
  });

  // Filter out low-confidence recommendations
  const maxScore = Math.max(...similarityScores.map((item) => item.score));
  const threshold = 0.1 * maxScore; // 10% of the max score as threshold
  const filteredScores = similarityScores.filter(
    (item) => item.score >= threshold
  );

  if (filteredScores.length === 0) {
    return []; // No recommendations if all scores are below the threshold
  }

  // Sort by score in descending order
  filteredScores.sort((a, b) => b.score - a.score);

  // Generate recommendations
  const recommendations = filteredScores.slice(0, 3).map((item) => {
    const prof = professors[item.index];
    const normalizedRating = Math.round((item.score / maxScore) * 9 + 1); // Scale to 1-10
    const researchSummary = createResearchSummary(prof.research);

    return {
      name: prof.name,
      position: prof.position,
      email: prof.email,
      researchSummary,
      similarityScore: item.score.toFixed(2),
      rating: normalizedRating,
    };
  });

  return recommendations;
}

// Precompute TF-IDF scores on startup
precomputeTfIdf(professors);

// Routes
const routes = Router();
routes.post("/", async (req: Request, res: Response): Promise<void> => {
  const { projectDescription } = req.body;

  if (!projectDescription) {
    res.status(400).json({ error: "projectDescription is required" });
    return;
  }

  try {
    const recommendations = recommendProfessors(projectDescription, professors);
    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error during recommendation:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

export default routes;
