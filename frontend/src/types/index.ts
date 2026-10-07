export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  streak: number;
  created_at: string;
}

export interface ProblemListItem {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  estimated_time: string;
  acceptance_rate: number;
  is_solved?: boolean;
  is_attempted?: boolean;
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface HintTier {
  level: number;
  title: string;
  content: string;
}

export interface ProblemDetail {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starter_code: Record<string, string>;
  test_cases: TestCase[];
  hints: HintTier[];
  solution_explanation?: string;
  optimal_time_complexity: string;
  optimal_space_complexity: string;
  estimated_time: string;
}

export interface TestCaseResult {
  input: string;
  expected_output: string;
  actual_output: string;
  passed: boolean;
  execution_time_ms: number;
  error?: string | null;
}

export interface CodeRunResponse {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Time Limit Exceeded' | 'Security Error' | 'Execution Error';
  passed_count: number;
  total_count: number;
  execution_time_ms: number;
  memory_kb: number;
  results: TestCaseResult[];
  stdout?: string;
  stderr?: string;
}

export interface CodeQualityScore {
  readability: string;
  variable_naming: string;
  unnecessary_operations: string;
  edge_cases: string;
  code_structure: string;
}

export interface AIReviewResponse {
  correctness: string;
  mistake_detection?: string | null;
  time_complexity: string;
  space_complexity: string;
  time_complexity_optimal: string;
  space_complexity_optimal: string;
  code_quality: CodeQualityScore;
  overall_summary: string;
  recommendations: string[];
}

export interface AICoachMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AICoachResponse {
  reply: string;
  hint_level_provided?: number;
  suggested_questions?: string[];
  concept_breakdown?: Record<string, string>;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  description: string;
  mastery: number;
  problems_solved: number;
  total_problems: number;
  accuracy: number;
  confidence: 'High' | 'Medium' | 'Low';
  weak_areas: string[];
  recommended_next: string[];
  order: number;
  status: 'completed' | 'in_progress' | 'current' | 'upcoming';
}

export interface NoteItem {
  id: number;
  topic: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface MockInterviewReport {
  problem_solving: string;
  communication: string;
  algorithm_choice: string;
  code_quality: string;
  complexity_analysis: string;
  edge_cases: string;
  strengths: string[];
  areas_for_improvement: string[];
  verdict: string;
}

export interface MockInterviewState {
  interview_id: number;
  step: number;
  status: 'in_progress' | 'completed';
  problem: {
    id: number;
    title: string;
    difficulty: string;
    description: string;
    optimal_time: string;
    starter_code: Record<string, string>;
  };
  transcript: {
    role: 'user' | 'assistant';
    content: string;
    step: number;
    code?: string;
  }[];
  final_report?: MockInterviewReport;
}

export interface AnalyticsData {
  summary: {
    problems_solved: number;
    current_streak: number;
    accuracy: number;
    weakest_topic: string;
    total_attempts: number;
    active_days_this_month: number;
  };
  velocity_history: { week: string; solved: number; accuracy: number }[];
  topic_breakdown: { topic: string; accuracy: number; solved: number; total: number; status: string }[];
  difficulty_distribution: {
    easy: { solved: number; total: number; percentage: number };
    medium: { solved: number; total: number; percentage: number };
    hard: { solved: number; total: number; percentage: number };
  };
  common_mistakes: { type: string; frequency: number; description: string; remediation: string }[];
}
