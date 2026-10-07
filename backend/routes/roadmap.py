from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Problem, Submission, User
from ..auth import get_current_user_optional

router = APIRouter(prefix="/api/roadmap", tags=["Personalized Roadmap"])

ROADMAP_TOPICS = [
    {
        "id": "arrays",
        "name": "Arrays",
        "description": "Contiguous memory layout, two-pointer techniques, sliding windows, and prefix sums.",
        "mastery": 82,
        "problems_solved": 24,
        "total_problems": 30,
        "accuracy": 88,
        "confidence": "High",
        "weak_areas": ["Subarray Sum Equals K", "Kadane Variations"],
        "recommended_next": ["Two Sum", "Container With Most Water", "Subarray Sum Equals K"],
        "order": 1,
        "status": "completed"
    },
    {
        "id": "strings",
        "name": "Strings",
        "description": "Character manipulation, palindromes, sliding window string matching, and anagrams.",
        "mastery": 76,
        "problems_solved": 19,
        "total_problems": 25,
        "accuracy": 79,
        "confidence": "High",
        "weak_areas": ["Rabin-Karp Rolling Hash", "Longest Substring Without Repeating"],
        "recommended_next": ["Longest Palindromic Substring", "Minimum Window Substring"],
        "order": 2,
        "status": "completed"
    },
    {
        "id": "linked-lists",
        "name": "Linked Lists",
        "description": "Pointer manipulation, fast & slow pointers, reversal, and doubly linked caching.",
        "mastery": 65,
        "problems_solved": 14,
        "total_problems": 20,
        "accuracy": 71,
        "confidence": "Medium",
        "weak_areas": ["Merge k Sorted Lists", "LRU Cache DLL Invariants"],
        "recommended_next": ["LRU Cache", "Reverse Nodes in k-Group"],
        "order": 3,
        "status": "completed"
    },
    {
        "id": "stack",
        "name": "Stack",
        "description": "LIFO order, monotonic stacks, expression parsing, and parenthesis balance.",
        "mastery": 70,
        "problems_solved": 15,
        "total_problems": 20,
        "accuracy": 75,
        "confidence": "Medium",
        "weak_areas": ["Monotonic Stack Bounds", "Largest Rectangle in Histogram"],
        "recommended_next": ["Valid Parentheses", "Daily Temperatures", "Trapping Rain Water"],
        "order": 4,
        "status": "completed"
    },
    {
        "id": "queue",
        "name": "Queue",
        "description": "FIFO buffer, double-ended queues (deque), monotonic queue sliding maximums.",
        "mastery": 60,
        "problems_solved": 9,
        "total_problems": 15,
        "accuracy": 68,
        "confidence": "Medium",
        "weak_areas": ["Sliding Window Maximum"],
        "recommended_next": ["Implement Queue using Stacks", "Sliding Window Maximum"],
        "order": 5,
        "status": "in_progress"
    },
    {
        "id": "recursion",
        "name": "Recursion",
        "description": "Recursive state decomposition, base case invariants, and call stack visualization.",
        "mastery": 55,
        "problems_solved": 11,
        "total_problems": 18,
        "accuracy": 62,
        "confidence": "Medium",
        "weak_areas": ["Mutual Recursion", "Call Stack Overflows"],
        "recommended_next": ["Subsets", "Generate Parentheses"],
        "order": 6,
        "status": "in_progress"
    },
    {
        "id": "binary-search",
        "name": "Binary Search",
        "description": "Logarithmic search, search on answer spaces, rotated arrays, and lower/upper bounds.",
        "mastery": 68,
        "problems_solved": 16,
        "total_problems": 22,
        "accuracy": 74,
        "confidence": "High",
        "weak_areas": ["Median of Two Sorted Arrays", "Search in Rotated Array"],
        "recommended_next": ["Search in Rotated Sorted Array", "Koko Eating Bananas"],
        "order": 7,
        "status": "in_progress"
    },
    {
        "id": "trees",
        "name": "Trees",
        "description": "Binary tree traversals (pre/in/post/level), lowest common ancestor, path sums.",
        "mastery": 44,
        "problems_solved": 12,
        "total_problems": 28,
        "accuracy": 52,
        "confidence": "Low",
        "weak_areas": ["Diameter / Path Sum Invariants", "Tree Serialization"],
        "recommended_next": ["Binary Tree Maximum Path Sum", "Lowest Common Ancestor"],
        "order": 8,
        "status": "in_progress"
    },
    {
        "id": "bst",
        "name": "BST",
        "description": "Binary Search Tree properties, in-order monotonicity, validation, and balanced AVL/Red-Black ideas.",
        "mastery": 50,
        "problems_solved": 8,
        "total_problems": 16,
        "accuracy": 58,
        "confidence": "Medium",
        "weak_areas": ["Kth Smallest Element in BST", "Validate Binary Search Tree"],
        "recommended_next": ["Validate Binary Search Tree", "Convert Sorted Array to BST"],
        "order": 9,
        "status": "in_progress"
    },
    {
        "id": "heap",
        "name": "Heap",
        "description": "Priority queues, top-k elements, two-heap median tracking, and heapify mechanics.",
        "mastery": 42,
        "problems_solved": 7,
        "total_problems": 18,
        "accuracy": 49,
        "confidence": "Low",
        "weak_areas": ["Find Median from Data Stream", "Merge K Sorted Lists"],
        "recommended_next": ["Kth Largest Element in an Array", "Top K Frequent Elements"],
        "order": 10,
        "status": "in_progress"
    },
    {
        "id": "graphs",
        "name": "Graphs",
        "description": "Adjacency representations, BFS, DFS, Dijkstra, topological sort, and union find.",
        "mastery": 31,
        "problems_solved": 8,
        "total_problems": 30,
        "accuracy": 40,
        "confidence": "Low",
        "weak_areas": ["BFS", "DFS", "Cycle Detection", "Visited State Tracking"],
        "recommended_next": [
            "BFS Traversal",
            "DFS Traversal",
            "Cycle Detection",
            "Number of Islands"
        ],
        "order": 11,
        "status": "current"
    },
    {
        "id": "greedy",
        "name": "Greedy",
        "description": "Optimal sub-structures, interval scheduling, jump game reachability, and coin choices.",
        "mastery": 38,
        "problems_solved": 6,
        "total_problems": 18,
        "accuracy": 45,
        "confidence": "Low",
        "weak_areas": ["Interval Scheduling", "Gas Station"],
        "recommended_next": ["Jump Game", "Non-overlapping Intervals"],
        "order": 12,
        "status": "upcoming"
    },
    {
        "id": "backtracking",
        "name": "Backtracking",
        "description": "Combinatorial state space search, pruning, permutation generation, and constraint satisfaction.",
        "mastery": 25,
        "problems_solved": 4,
        "total_problems": 20,
        "accuracy": 34,
        "confidence": "Low",
        "weak_areas": ["N-Queens Pruning", "Word Search II"],
        "recommended_next": ["N-Queens", "Word Search", "Permutations"],
        "order": 13,
        "status": "upcoming"
    },
    {
        "id": "dp",
        "name": "Dynamic Programming",
        "description": "Overlapping subproblems, state transitions, memoization, 0/1 Knapsack, LCS, and interval DP.",
        "mastery": 18,
        "problems_solved": 5,
        "total_problems": 35,
        "accuracy": 28,
        "confidence": "Low",
        "weak_areas": ["Longest Common Subsequence", "0/1 Knapsack", "State Compression"],
        "recommended_next": ["Coin Change", "Climbing Stairs", "Longest Increasing Subsequence"],
        "order": 14,
        "status": "upcoming"
    }
]

@router.get("")
def get_roadmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    return {
        "current_topic": "Graphs",
        "topics": ROADMAP_TOPICS
    }
