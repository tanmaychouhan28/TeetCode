import { 
  ProblemListItem, 
  ProblemDetail, 
  CodeRunResponse, 
  AIReviewResponse, 
  AICoachResponse, 
  RoadmapTopic, 
  NoteItem, 
  AnalyticsData, 
  MockInterviewState, 
  User 
} from '../types';

const API_BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('teetcode_token') || localStorage.getItem('dsa_coach_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Fallback initial dataset in case backend is offline
const FALLBACK_PROBLEMS: ProblemListItem[] = [
  {
    id: 1,
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    topics: ['Graphs', 'BFS', 'DFS'],
    estimated_time: '20 min',
    acceptance_rate: 58.4,
    is_solved: false,
    is_attempted: true
  },
  {
    id: 2,
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['Arrays', 'Hash Table'],
    estimated_time: '15 min',
    acceptance_rate: 52.8,
    is_solved: true,
    is_attempted: false
  },
  {
    id: 3,
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Medium',
    topics: ['Linked Lists', 'Hash Table', 'Design'],
    estimated_time: '30 min',
    acceptance_rate: 42.1,
    is_solved: false,
    is_attempted: false
  },
  {
    id: 4,
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topics: ['Dynamic Programming', 'BFS'],
    estimated_time: '25 min',
    acceptance_rate: 44.2,
    is_solved: false,
    is_attempted: false
  },
  {
    id: 5,
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topics: ['Stack', 'Strings'],
    estimated_time: '10 min',
    acceptance_rate: 40.5,
    is_solved: true,
    is_attempted: false
  },
  {
    id: 6,
    slug: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    topics: ['Trees', 'DFS', 'Dynamic Programming'],
    estimated_time: '35 min',
    acceptance_rate: 39.8,
    is_solved: false,
    is_attempted: false
  }
];

export const api = {
  // Auth
  async login(username_or_email: string, password: string): Promise<{ access_token: string; user: User }> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return await res.json();
    } catch {
      return {
        access_token: 'mock-jwt-token-tanmay',
        user: {
          id: 1,
          email: 'tanmay@example.com',
          username: 'tanmay',
          full_name: 'Tanmay',
          streak: 14,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch {
      return {
        id: 1,
        email: 'tanmay@example.com',
        username: 'tanmay',
        full_name: 'Tanmay',
        streak: 14,
        created_at: new Date().toISOString()
      };
    }
  },

  // Problems
  async getProblems(filters?: { topic?: string; difficulty?: string; status?: string; search?: string; sort?: string }): Promise<ProblemListItem[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.topic) params.append('topic', filters.topic);
      if (filters?.difficulty) params.append('difficulty', filters.difficulty);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_BASE_URL}/problems?${params.toString()}`, {
        headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error('Failed to fetch problems');
      return await res.json();
    } catch {
      let list = [...FALLBACK_PROBLEMS];
      if (filters?.difficulty && filters.difficulty !== 'All') {
        list = list.filter(p => p.difficulty.toLowerCase() === filters.difficulty?.toLowerCase());
      }
      if (filters?.topic && filters.topic !== 'All') {
        list = list.filter(p => p.topics.some(t => t.toLowerCase().includes(filters.topic?.toLowerCase() || '')));
      }
      if (filters?.search) {
        list = list.filter(p => p.title.toLowerCase().includes(filters.search?.toLowerCase() || ''));
      }
      return list;
    }
  },

  async getProblem(slug_or_id: string): Promise<ProblemDetail> {
    try {
      const res = await fetch(`${API_BASE_URL}/problems/${slug_or_id}`);
      if (!res.ok) throw new Error('Failed to fetch problem detail');
      return await res.json();
    } catch {
      // Default fallback problem: Number of Islands
      return {
        id: 1,
        slug: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        topics: ['Graphs', 'BFS', 'DFS', 'Matrix'],
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
        constraints: [
          'm == grid.length',
          'n == grid[i].length',
          '1 <= m, n <= 300',
          "grid[i][j] is '0' or '1'."
        ],
        examples: [
          {
            input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
            output: '1',
            explanation: 'All land cells are connected horizontally or vertically into a single island.'
          },
          {
            input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
            output: '3',
            explanation: 'There are 3 disconnected clusters of land.'
          }
        ],
        starter_code: {
          python: 'class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Write your code here\n        pass\n',
          cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};',
          java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}',
          javascript: '/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your code here\n    return 0;\n};'
        },
        test_cases: [
          {
            input: '[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]',
            expected_output: '1'
          },
          {
            input: '[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]',
            expected_output: '3'
          }
        ],
        hints: [
          {
            level: 1,
            title: 'Conceptual Direction',
            content: "Think of the 2D grid as an unweighted undirected graph where each cell is a vertex and edges connect adjacent land cells ('1'). What graph property corresponds to an island?"
          },
          {
            level: 2,
            title: 'Algorithm Direction',
            content: "Use BFS or DFS. Iterate through every cell (r, c). When you encounter a '1', increment your island counter and immediately trigger a traversal to 'sink' or mark all connected land cells as visited."
          },
          {
            level: 3,
            title: 'Pseudo-code',
            content: "def numIslands(grid):\n  count = 0\n  for r in range(rows):\n    for c in range(cols):\n      if grid[r][c] == '1':\n        count += 1\n        dfs(r, c) # marks visited\n  return count"
          },
          {
            level: 4,
            title: 'Detailed Explanation',
            content: "In your DFS/BFS helper, always check four bounds: 0 <= r < rows, 0 <= c < cols, and grid[r][c] == '1'. Mutate grid[r][c] = '0' to prevent revisiting without needing O(m*n) extra visited space."
          },
          {
            level: 5,
            title: 'Complete Solution',
            content: "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        \n        def dfs(r, c):\n            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n                return\n            grid[r][c] = '0'\n            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:\n                dfs(r + dr, c + dc)\n                \n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n        return count"
          }
        ],
        optimal_time_complexity: 'O(m * n)',
        optimal_space_complexity: 'O(m * n)',
        estimated_time: '20 min'
      };
    }
  },

  // Code Execution & Submit
  async runCode(problemId: number, language: string, code: string, customTestcase?: string): Promise<CodeRunResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem_id: problemId, language, code, custom_testcase: customTestcase }),
      });
      if (!res.ok) throw new Error('Execution failed');
      return await res.json();
    } catch {
      return {
        status: 'Runtime Error',
        passed_count: 0,
        total_count: 0,
        execution_time_ms: 0,
        memory_kb: 0,
        results: [],
        stderr: 'Could not connect to execution backend. Please ensure the server is running on port 8000.'
      };
    }
  },

  async submitCode(problemId: number, language: string, code: string): Promise<{ execution: CodeRunResponse; ai_review: AIReviewResponse }> {
    try {
      const res = await fetch(`${API_BASE_URL}/code/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ problem_id: problemId, language, code }),
      });
      if (!res.ok) throw new Error('Submission failed');
      return await res.json();
    } catch {
      return {
        execution: {
          status: 'Runtime Error',
          passed_count: 0,
          total_count: 0,
          execution_time_ms: 0,
          memory_kb: 0,
          results: [],
          stderr: 'Could not connect to execution backend. Please ensure the server is running on port 8000.'
        },
        ai_review: {
          correctness: 'Unable to evaluate — backend offline.',
          mistake_detection: 'Backend server is not reachable. Start the FastAPI server and try again.',
          time_complexity: 'N/A',
          space_complexity: 'N/A',
          time_complexity_optimal: 'N/A',
          space_complexity_optimal: 'N/A',
          code_quality: {
            readability: 'N/A',
            variable_naming: 'N/A',
            unnecessary_operations: 'N/A',
            edge_cases: 'N/A',
            code_structure: 'N/A'
          },
          overall_summary: 'Backend offline — no review available.',
          recommendations: []
        }
      };
    }
  },

  // AI Coach
  async chatWithCoach(
    problemId: number, 
    messages: { role: 'user' | 'assistant'; content: string }[], 
    code?: string, 
    actionType: string = 'chat',
    hintLevel: number = 1,
    socraticMode: boolean = true
  ): Promise<AICoachResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/coach/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problemId,
          messages,
          code,
          action_type: actionType,
          hint_level: hintLevel,
          socratic_mode: socraticMode
        }),
      });
      if (!res.ok) throw new Error('Coach chat error');
      return await res.json();
    } catch {
      return {
        reply: "Before writing code, what data structure do you think could help solve this problem?",
        suggested_questions: [
          "I think a Queue with BFS",
          "I think a DFS recursion",
          "Give me a small hint"
        ]
      };
    }
  },

  // Roadmap
  async getRoadmap(): Promise<{ current_topic: string; topics: RoadmapTopic[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/roadmap`, {
        headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error('Failed to fetch roadmap');
      return await res.json();
    } catch {
      return {
        current_topic: 'Graphs',
        topics: [
          {
            id: 'arrays',
            name: 'Arrays',
            description: 'Contiguous memory layout, two-pointer techniques, sliding windows.',
            mastery: 82,
            problems_solved: 24,
            total_problems: 30,
            accuracy: 88,
            confidence: 'High',
            weak_areas: ['Subarray Sum Equals K'],
            recommended_next: ['Two Sum', 'Subarray Sum Equals K'],
            order: 1,
            status: 'completed'
          },
          {
            id: 'graphs',
            name: 'Graphs',
            description: 'Adjacency representations, BFS, DFS, Dijkstra, topological sort.',
            mastery: 31,
            problems_solved: 8,
            total_problems: 30,
            accuracy: 40,
            confidence: 'Low',
            weak_areas: ['BFS', 'DFS', 'Cycle Detection'],
            recommended_next: ['BFS Traversal', 'DFS Traversal', 'Cycle Detection', 'Number of Islands'],
            order: 11,
            status: 'current'
          }
        ]
      };
    }
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`, {
        headers: { ...getAuthHeader() }
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return await res.json();
    } catch {
      return {
        summary: {
          problems_solved: 127,
          current_streak: 14,
          accuracy: 78,
          weakest_topic: 'Graphs',
          total_attempts: 163,
          active_days_this_month: 24
        },
        velocity_history: [
          { week: 'W1', solved: 8, accuracy: 70 },
          { week: 'W2', solved: 14, accuracy: 72 },
          { week: 'W3', solved: 18, accuracy: 75 },
          { week: 'W4', solved: 15, accuracy: 74 },
          { week: 'W5', solved: 21, accuracy: 80 },
          { week: 'W6', solved: 19, accuracy: 79 },
          { week: 'W7', solved: 16, accuracy: 78 },
          { week: 'W8', solved: 16, accuracy: 81 }
        ],
        topic_breakdown: [
          { topic: 'Arrays', accuracy: 82, solved: 24, total: 30, status: 'Strong' },
          { topic: 'Strings', accuracy: 76, solved: 19, total: 25, status: 'Strong' },
          { topic: 'Linked List', accuracy: 65, solved: 14, total: 20, status: 'Proficient' },
          { topic: 'Trees', accuracy: 44, solved: 20, total: 44, status: 'Needs Practice' },
          { topic: 'Graphs', accuracy: 31, solved: 8, total: 30, status: 'Weakest' },
          { topic: 'DP', accuracy: 18, solved: 5, total: 35, status: 'Critical Focus' }
        ],
        difficulty_distribution: {
          easy: { solved: 62, total: 75, percentage: 82.6 },
          medium: { solved: 51, total: 85, percentage: 60.0 },
          hard: { solved: 14, total: 40, percentage: 35.0 }
        },
        common_mistakes: [
          { type: 'Off-by-one errors', frequency: 32, description: 'Loop bounds or slice indices exceeding valid boundaries.', remediation: 'Verify < vs <= conditions.' },
          { type: 'Missing edge cases', frequency: 28, description: 'Failing on empty/single item inputs.', remediation: 'Add 3 guard checks at function start.' },
          { type: 'Incorrect recursion base case', frequency: 18, description: 'Missing termination condition.', remediation: 'Draw the 2-level base recursion tree.' },
          { type: 'Wrong complexity', frequency: 14, description: 'Hidden O(n²) operations in loops.', remediation: 'Replace nested scans with Hash Sets.' },
          { type: 'Incorrect visited handling', frequency: 8, description: 'Forgetting to mark nodes upon queue enqueue.', remediation: 'Mark visited at push, not pop.' }
        ]
      };
    }
  },

  // Notes
  async getNotes(topic?: string): Promise<NoteItem[]> {
    try {
      const url = topic ? `${API_BASE_URL}/notes?topic=${topic}` : `${API_BASE_URL}/notes`;
      const res = await fetch(url, { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error('Failed to fetch notes');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          topic: 'Graphs',
          title: 'Graph Traversal Invariants',
          content: '## Graph Notes\n\n- **BFS** → Queue (FIFO)\n- **DFS** → Recursion / Stack\n- **Cycle detection** → Visited array + recursion stack',
          tags: ['graphs', 'bfs', 'dfs'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  async createNote(topic: string, title: string, content: string, tags?: string): Promise<NoteItem> {
    const res = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ topic, title, content, tags }),
    });
    return await res.json();
  },

  async updateNote(id: number, title: string, content: string, topic?: string): Promise<NoteItem> {
    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ title, content, topic }),
    });
    return await res.json();
  },

  async deleteNote(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
  },

  // Mock Interview
  async startMockInterview(companyType: string, difficulty: string, topic: string, durationMinutes: number): Promise<MockInterviewState> {
    const res = await fetch(`${API_BASE_URL}/mock-interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ company_type: companyType, difficulty, topic, duration_minutes: durationMinutes }),
    });
    return await res.json();
  },

  async sendMockInterviewStep(interviewId: number, step: number, userInput: string, code?: string): Promise<MockInterviewState> {
    const res = await fetch(`${API_BASE_URL}/mock-interview/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ interview_id: interviewId, step, user_input: userInput, code }),
    });
    return await res.json();
  }
};
