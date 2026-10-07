import json
from .database import SessionLocal, engine, Base
from .models import User, Problem, Submission, Note, MockInterview
from .auth import get_password_hash

PROBLEMS_DATA = [
    {
        "slug": "number-of-islands",
        "title": "Number of Islands",
        "difficulty": "Medium",
        "topics": json.dumps(["Graphs", "BFS", "DFS", "Matrix"]),
        "description": "Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
        "constraints": json.dumps([
            "m == grid.length",
            "n == grid[i].length",
            "1 <= m, n <= 300",
            "grid[i][j] is '0' or '1'."
        ]),
        "examples": json.dumps([
            {
                "input": 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
                "output": "1",
                "explanation": "All land cells are connected horizontally or vertically into a single island."
            },
            {
                "input": 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
                "output": "3",
                "explanation": "There are 3 disconnected clusters of land."
            }
        ]),
        "starter_code": json.dumps({
            "python": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Write your code here\n        pass\n",
            "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};",
            "java": "class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}",
            "javascript": "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    // Write your code here\n    return 0;\n};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps([[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]]),
                "expected_output": "1",
                "is_hidden": False
            },
            {
                "input": json.dumps([[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]]),
                "expected_output": "3",
                "is_hidden": False
            },
            {
                "input": json.dumps([[["0","0","0"],["0","0","0"]]]),
                "expected_output": "0",
                "is_hidden": True
            },
            {
                "input": json.dumps([[["1"]]]),
                "expected_output": "1",
                "is_hidden": True
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "Think of the 2D grid as an unweighted undirected graph where each cell is a vertex and edges connect adjacent land cells ('1'). What graph property corresponds to an island?"
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Use BFS or DFS. Iterate through every cell (r, c). When you encounter a '1', increment your island counter and immediately trigger a traversal to 'sink' or mark all connected land cells as visited."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "def numIslands(grid):\n  count = 0\n  for r in range(rows):\n    for c in range(cols):\n      if grid[r][c] == '1':\n        count += 1\n        dfs(r, c) # marks visited/converts '1' -> '0'\n  return count"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "In your DFS/BFS helper, always check four bounds: 0 <= r < rows, 0 <= c < cols, and grid[r][c] == '1'. Mutate grid[r][c] = '0' to prevent revisiting without needing O(m*n) extra visited space."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        \n        def dfs(r, c):\n            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':\n                return\n            grid[r][c] = '0'\n            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:\n                dfs(r + dr, c + dc)\n                \n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == '1':\n                    count += 1\n                    dfs(r, c)\n        return count"
            }
        ]),
        "solution_explanation": "Iterate through each cell in the grid. Upon encountering '1', initiate a Depth-First Search (DFS) or Breadth-First Search (BFS) to flood-fill and mark all connected land cells to '0' (visited). Each flood-fill corresponds to exactly one connected component (island). Time Complexity: O(M x N). Space Complexity: O(M x N) for recursion stack.",
        "optimal_time_complexity": "O(m * n)",
        "optimal_space_complexity": "O(m * n)",
        "estimated_time": "20 min",
        "acceptance_rate": 58.4
    },
    {
        "slug": "two-sum",
        "title": "Two Sum",
        "difficulty": "Easy",
        "topics": json.dumps(["Arrays", "Hash Table"]),
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        "constraints": json.dumps([
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ]),
        "examples": json.dumps([
            {
                "input": "nums = [2,7,11,15], target = 9",
                "output": "[0,1]",
                "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                "input": "nums = [3,2,4], target = 6",
                "output": "[1,2]",
                "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
            }
        ]),
        "starter_code": json.dumps({
            "python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your code here\n        pass\n",
            "cpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write code here\n        return {};\n    }\n};",
            "java": "import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write code here\n        return new int[]{};\n    }\n}",
            "javascript": "var twoSum = function(nums, target) {\n    // Write code here\n    return [];\n};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps([[2, 7, 11, 15], 9]),
                "expected_output": "[0, 1]",
                "is_hidden": False
            },
            {
                "input": json.dumps([[3, 2, 4], 6]),
                "expected_output": "[1, 2]",
                "is_hidden": False
            },
            {
                "input": json.dumps([[3, 3], 6]),
                "expected_output": "[0, 1]",
                "is_hidden": False
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "A brute force approach checks all pairs in O(n²). How can we check if the complement `target - current_num` was seen before in O(1) time?"
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Use a Hash Map where keys are numbers seen so far, and values are their corresponding array indices."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "seen = {}\nfor i, num in enumerate(nums):\n  diff = target - num\n  if diff in seen:\n    return [seen[diff], i]\n  seen[num] = i"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "In a single pass, compute diff = target - x. If diff is in hash map, return its index and current index. Otherwise insert x with index i. Single pass ensures O(n) runtime."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            diff = target - num\n            if diff in seen:\n                return [seen[diff], i]\n            seen[num] = i\n        return []"
            }
        ]),
        "solution_explanation": "Maintain a hash table mapping seen elements to their array index. For each number x, verify if (target - x) exists in the map in O(1) average time. Total time: O(n), Space: O(n).",
        "optimal_time_complexity": "O(n)",
        "optimal_space_complexity": "O(n)",
        "estimated_time": "15 min",
        "acceptance_rate": 52.8
    },
    {
        "slug": "lru-cache",
        "title": "LRU Cache",
        "difficulty": "Medium",
        "topics": json.dumps(["Linked Lists", "Hash Table", "Design"]),
        "description": "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size capacity.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions `get` and `put` must each run in **O(1)** average time complexity.",
        "constraints": json.dumps([
            "1 <= capacity <= 3000",
            "0 <= key <= 10^4",
            "0 <= value <= 10^5",
            "At most 2 * 10^5 calls will be made to get and put."
        ]),
        "examples": json.dumps([
            {
                "input": '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
                "output": "[null, null, null, 1, null, -1, null, -1, 3, 4]",
                "explanation": "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // evicts key 2\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // evicts key 1\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4"
            }
        ]),
        "starter_code": json.dumps({
            "python": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        pass\n",
            "cpp": "class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};",
            "java": "class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}",
            "javascript": "var LRUCache = function(capacity) {};\nLRUCache.prototype.get = function(key) { return -1; };\nLRUCache.prototype.put = function(key, value) {};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps([["put", 1, 1], ["put", 2, 2], ["get", 1]]),
                "expected_output": "1",
                "is_hidden": False
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "To achieve O(1) lookups, you need a Hash Map. To achieve O(1) insertion/deletion and maintain LRU ordering, what structure allows instant splicing of nodes?"
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Combine a Doubly Linked List with a Hash Map. The Hash Map stores `key -> Node`, allowing O(1) access. The Doubly Linked List maintains access order with dummy Head and Tail pointers."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "class Node: key, val, prev, next\nget(key):\n  if key in map:\n    node = map[key]\n    remove(node)\n    insert_at_head(node)\n    return node.val\n  return -1"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "When putting a new key, if size > capacity, evict the node immediately before the dummy tail `tail.prev`. Remove it from both the DLL and the hash map."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n        self.head, self.tail = Node(), Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n        \n    def _remove(self, node):\n        prev, nxt = node.prev, node.next\n        prev.next, nxt.prev = nxt, prev\n        \n    def _insert(self, node):\n        nxt = self.head.next\n        self.head.next = node\n        node.prev = self.head\n        node.next = nxt\n        nxt.prev = node\n        \n    def get(self, key: int) -> int:\n        if key in self.cache:\n            node = self.cache[key]\n            self._remove(node)\n            self._insert(node)\n            return node.val\n        return -1\n        \n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self._remove(self.cache[key])\n        node = Node(key, value)\n        self.cache[key] = node\n        self._insert(node)\n        if len(self.cache) > self.cap:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.cache[lru.key]"
            }
        ]),
        "solution_explanation": "A Doubly Linked List paired with a Hash Map allows O(1) removal, insertion, and lookup. Pseudo head/tail boundary nodes prevent messy null pointer corner cases.",
        "optimal_time_complexity": "O(1) per op",
        "optimal_space_complexity": "O(capacity)",
        "estimated_time": "30 min",
        "acceptance_rate": 42.1
    },
    {
        "slug": "coin-change",
        "title": "Coin Change",
        "difficulty": "Medium",
        "topics": json.dumps(["Dynamic Programming", "BFS"]),
        "description": "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
        "constraints": json.dumps([
            "1 <= coins.length <= 12",
            "1 <= coins[i] <= 2^31 - 1",
            "0 <= amount <= 10^4"
        ]),
        "examples": json.dumps([
            {
                "input": "coins = [1,2,5], amount = 11",
                "output": "3",
                "explanation": "11 = 5 + 5 + 1 (3 coins)"
            },
            {
                "input": "coins = [2], amount = 3",
                "output": "-1",
                "explanation": "Cannot form 3 using only coins of denomination 2."
            },
            {
                "input": "coins = [1], amount = 0",
                "output": "0",
                "explanation": "Amount 0 requires 0 coins."
            }
        ]),
        "starter_code": json.dumps({
            "python": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        # Write your code here\n        pass\n",
            "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write code here\n        return -1;\n    }\n};",
            "java": "import java.util.Arrays;\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write code here\n        return -1;\n    }\n}",
            "javascript": "var coinChange = function(coins, amount) {\n    // Write code here\n    return -1;\n};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps([[1, 2, 5], 11]),
                "expected_output": "3",
                "is_hidden": False
            },
            {
                "input": json.dumps([[2], 3]),
                "expected_output": "-1",
                "is_hidden": False
            },
            {
                "input": json.dumps([[1], 0]),
                "expected_output": "0",
                "is_hidden": False
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "Why does a greedy choice (always picking the largest coin) fail? Consider coins = [1, 3, 4] and amount = 6. Greedy chooses 4+1+1 = 3 coins, but 3+3 = 2 coins is optimal."
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Define subproblems: Let `dp[i]` be the minimum coins needed for amount `i`. To find `dp[i]`, try every coin `c` where `c <= i` and take `1 + dp[i - c]`."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "dp = [inf] * (amount + 1)\ndp[0] = 0\nfor i from 1 to amount:\n  for c in coins:\n    if i - c >= 0:\n      dp[i] = min(dp[i], 1 + dp[i - c])\nreturn dp[amount] if dp[amount] != inf else -1"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "Initialize DP table of size amount+1 with infinity. Base case dp[0]=0. Loop through every amount from 1 to amount, updating with min coins. Return dp[amount] if reachable."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Solution:\n    def coinChange(self, coins: list[int], amount: int) -> int:\n        dp = [float('inf')] * (amount + 1)\n        dp[0] = 0\n        for i in range(1, amount + 1):\n            for c in coins:\n                if i - c >= 0:\n                    dp[i] = min(dp[i], 1 + dp[i - c])\n        return dp[amount] if dp[amount] != float('inf') else -1"
            }
        ]),
        "solution_explanation": "Bottom-up 1D Dynamic Programming. Recurrence: dp[i] = min(dp[i - c] + 1) for all c in coins where i >= c. Time: O(amount * len(coins)), Space: O(amount).",
        "optimal_time_complexity": "O(amount * coins.length)",
        "optimal_space_complexity": "O(amount)",
        "estimated_time": "25 min",
        "acceptance_rate": 44.2
    },
    {
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "Easy",
        "topics": json.dumps(["Stack", "Strings"]),
        "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        "constraints": json.dumps([
            "1 <= s.length <= 10^4",
            "s consists of parentheses only '()[]{}'."
        ]),
        "examples": json.dumps([
            {
                "input": 's = "()"',
                "output": "true",
                "explanation": "Matching pair of standard parentheses."
            },
            {
                "input": 's = "()[]{}"',
                "output": "true",
                "explanation": "All bracket pairs close in sequential order."
            },
            {
                "input": 's = "(]"',
                "output": "false",
                "explanation": "Mismatched bracket types."
            }
        ]),
        "starter_code": json.dumps({
            "python": "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write code here\n        pass\n",
            "cpp": "#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write code here\n        return false;\n    }\n};",
            "java": "import java.util.Stack;\nclass Solution {\n    public boolean isValid(String s) {\n        // Write code here\n        return false;\n    }\n}",
            "javascript": "var isValid = function(s) {\n    // Write code here\n    return false;\n};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps(["()"]),
                "expected_output": "True",
                "is_hidden": False
            },
            {
                "input": json.dumps(["()[]{}"]),
                "expected_output": "True",
                "is_hidden": False
            },
            {
                "input": json.dumps(["(]"]),
                "expected_output": "False",
                "is_hidden": False
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "Notice that the last opened bracket must be the first one to be closed (LIFO - Last In First Out)."
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Use a Stack. Push opening brackets `(`, `[`, `{`. When encountering a closing bracket, pop the top of the stack and check if it matches."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "pairs = {')': '(', '}': '{', ']': '['}\nstack = []\nfor char in s:\n  if char in pairs:\n    if not stack or stack.pop() != pairs[char]:\n      return False\n  else:\n    stack.append(char)\nreturn len(stack) == 0"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "A hash map mapping closing brackets to opening brackets makes matching clean. String is valid if and only if stack is completely empty at the end."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Solution:\n    def isValid(self, s: str) -> bool:\n        mapping = {')': '(', '}': '{', ']': '['}\n        stack = []\n        for char in s:\n            if char in mapping:\n                top = stack.pop() if stack else '#'\n                if mapping[char] != top:\n                    return False\n            else:\n                stack.append(char)\n        return len(stack) == 0"
            }
        ]),
        "solution_explanation": "Use a LIFO Stack to track unclosed brackets. Closing bracket must match the immediate top element. Time: O(n), Space: O(n).",
        "optimal_time_complexity": "O(n)",
        "optimal_space_complexity": "O(n)",
        "estimated_time": "10 min",
        "acceptance_rate": 40.5
    },
    {
        "slug": "binary-tree-maximum-path-sum",
        "title": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "topics": json.dumps(["Trees", "DFS", "Recursion", "Dynamic Programming"]),
        "description": "A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.\n\nThe **path sum** of a path is the sum of the node's values in the path.\n\nGiven the `root` of a binary tree, return the maximum **path sum** of any non-empty path.",
        "constraints": json.dumps([
            "The number of nodes in the tree is in the range [1, 3 * 10^4].",
            "-1000 <= Node.val <= 1000"
        ]),
        "examples": json.dumps([
            {
                "input": "root = [1,2,3]",
                "output": "6",
                "explanation": "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6."
            },
            {
                "input": "root = [-10,9,20,null,null,15,7]",
                "output": "42",
                "explanation": "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42."
            }
        ]),
        "starter_code": json.dumps({
            "python": "# Definition for a binary tree node.\n# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\nclass Solution:\n    def maxPathSum(self, root) -> int:\n        # Write code here\n        pass\n",
            "cpp": "class Solution {\npublic:\n    int maxPathSum(TreeNode* root) {\n        // Write code here\n        return 0;\n    }\n};",
            "java": "class Solution {\n    public int maxPathSum(TreeNode root) {\n        // Write code here\n        return 0;\n    }\n}",
            "javascript": "var maxPathSum = function(root) {\n    // Write code here\n    return 0;\n};"
        }),
        "test_cases": json.dumps([
            {
                "input": json.dumps([[1, 2, 3]]),
                "expected_output": "6",
                "is_hidden": False
            }
        ]),
        "hints": json.dumps([
            {
                "level": 1,
                "title": "Conceptual Direction",
                "content": "For every node, what is the maximum path sum that has this node as the 'highest' point (turning point)?"
            },
            {
                "level": 2,
                "title": "Algorithm Direction",
                "content": "Use post-order DFS. At each node, compute max gain from left child and right child (clamping negative gains to 0). Update a global max with `node.val + left_gain + right_gain`."
            },
            {
                "level": 3,
                "title": "Pseudo-code",
                "content": "max_sum = -inf\ndef max_gain(node):\n  if not node: return 0\n  left = max(max_gain(node.left), 0)\n  right = max(max_gain(node.right), 0)\n  max_sum = max(max_sum, node.val + left + right)\n  return node.val + max(left, right)"
            },
            {
                "level": 4,
                "title": "Detailed Explanation",
                "content": "A path cannot branch in both directions when extending up to its parent. Therefore, the recursive function returns `node.val + max(left_gain, right_gain)`."
            },
            {
                "level": 5,
                "title": "Complete Solution",
                "content": "class Solution:\n    def maxPathSum(self, root) -> int:\n        self.max_sum = float('-inf')\n        def dfs(node):\n            if not node: return 0\n            left = max(dfs(node.left), 0)\n            right = max(dfs(node.right), 0)\n            self.max_sum = max(self.max_sum, node.val + left + right)\n            return node.val + max(left, right)\n        dfs(root)\n        return self.max_sum"
            }
        ]),
        "solution_explanation": "Post-order tree traversal. Compute single-branch max gain while updating global diameter sum at each turning node. Time: O(N), Space: O(H).",
        "optimal_time_complexity": "O(n)",
        "optimal_space_complexity": "O(h)",
        "estimated_time": "35 min",
        "acceptance_rate": 39.8
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create default user 'tanmay' if not exists
        user = db.query(User).filter(User.username == "tanmay").first()
        if not user:
            user = User(
                email="tanmay@example.com",
                username="tanmay",
                full_name="Tanmay",
                hashed_password=get_password_hash("password123"),
                streak=14
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Seed problems catalog with fresh starter templates
        for p_data in PROBLEMS_DATA:
            existing = db.query(Problem).filter(Problem.slug == p_data["slug"]).first()
            if not existing:
                problem = Problem(**p_data)
                db.add(problem)
        db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
