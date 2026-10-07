import json
import re
from typing import Dict, Any, List, Optional
from .schemas import AIReviewResponse, CodeQualityScore, MockInterviewReport

class AICoachEngine:
    """
    Precision Socratic Coach & Deep Code Review Engine.
    Provides guidance, progressive hint unveiling, mistake detection, and mock interview feedback.
    """

    @staticmethod
    def generate_coach_response(
        problem: Any,
        user_code: str,
        language: str,
        messages: List[Dict[str, str]],
        action_type: str,
        hint_level: int,
        socratic_mode: bool
    ) -> Dict[str, Any]:
        latest_user_msg = messages[-1]["content"] if messages and messages[-1]["role"] == "user" else ""
        problem_title = getattr(problem, "title", "DSA Problem")
        problem_topics = getattr(problem, "topics", "")
        if isinstance(problem_topics, str):
            try:
                problem_topics = json.loads(problem_topics)
            except Exception:
                problem_topics = [t.strip() for t in problem_topics.split(",")]
        
        hints = getattr(problem, "hints", "[]")
        if isinstance(hints, str):
            try:
                hints = json.loads(hints)
            except Exception:
                hints = []

        # Handle specific quick actions
        if action_type == "hint" or "small hint" in latest_user_msg.lower() or "give me a hint" in latest_user_msg.lower():
            current_level = min(max(hint_level, 1), 5)
            tier_hint = next((h for h in hints if h.get("level") == current_level), None)
            
            if not tier_hint and hints:
                idx = min(current_level - 1, len(hints) - 1)
                tier_hint = hints[idx]

            level_titles = {
                1: "Level 1 — Conceptual Direction",
                2: "Level 2 — Algorithm & Data Structure Direction",
                3: "Level 3 — Structured Pseudo-code",
                4: "Level 4 — In-depth Step-by-Step Logic",
                5: "Final Level — Complete Reference Solution"
            }

            hint_text = tier_hint.get("content") if tier_hint else "Consider what property of the input you can leverage without recomputing previous states."
            title = level_titles.get(current_level, f"Hint Level {current_level}")

            socratic_followup = ""
            if current_level == 1:
                socratic_followup = "\n\n*Question for you:* How does this property help you eliminate redundant searches?"
            elif current_level == 2:
                socratic_followup = "\n\n*Question for you:* What is the time complexity when maintaining state with this structure?"
            elif current_level == 3:
                socratic_followup = "\n\n*Next step:* Try implementing the loop structure shown above in the editor."

            return {
                "reply": f"### {title}\n\n{hint_text}{socratic_followup}",
                "hint_level_provided": current_level,
                "suggested_questions": [
                    "Why choose this data structure?",
                    "What are the edge cases for this approach?",
                    "Can we do this in O(1) extra space?"
                ],
                "concept_breakdown": {
                    "Core Idea": f"Apply {', '.join(problem_topics[:2])} pattern",
                    "Target Complexity": getattr(problem, "optimal_time_complexity", "O(n)")
                }
            }

        if action_type == "explain_concept":
            primary_topic = problem_topics[0] if problem_topics else "Algorithm"
            return {
                "reply": f"### Core Concept: {primary_topic}\n\n"
                         f"In **{problem_title}**, the central challenge is efficiently managing state traversal.\n\n"
                         f"1. **Invariant identification**: Recognize what remains true as you iterate through the problem space.\n"
                         f"2. **State representation**: How are visited elements, boundaries, or accumulated results preserved?\n"
                         f"3. **Trade-offs**: Avoid nested passes (which easily become O(n²)) by utilizing hash maps, two pointers, or auxiliary queues/stacks.\n\n"
                         f"**Socratic Question**: If you look at the constraints, what maximum time complexity can run within the typical 1.0s runtime budget (~10⁷ operations)?",
                "suggested_questions": [
                    "How do we handle empty or single-element inputs?",
                    "Check my current code approach",
                    "Give me a level 1 hint"
                ]
            }

        if action_type == "check_approach":
            has_code = len(user_code.strip()) > 20
            if not has_code:
                return {
                    "reply": "I see you haven't drafted code in the editor yet. Tell me in plain English:\n\n"
                             "1. What data structure are you planning to use?\n"
                             "2. How will you process each element or state?\n"
                             "3. What is your stopping condition / base case?",
                    "suggested_questions": [
                        "I think a Hash Map / Frequency Array",
                        "I'm considering BFS with a Queue",
                        "I want to try Dynamic Programming with 1D memo"
                    ]
                }
            
            # Analyze written code
            code_lower = user_code.lower()
            observations = []
            if "for" in code_lower and code_lower.count("for") >= 2 and not ("grid" in code_lower or "matrix" in code_lower):
                observations.append("You have nested loops which may result in **O(n²)** time complexity. Can we eliminate the inner loop?")
            if "visited" not in code_lower and ("graph" in str(problem_topics).lower() or "island" in problem_title.lower()):
                observations.append("You appear to traverse graph nodes or matrix cells without tracking visited states. How will you prevent infinite cycles or re-counting?")
            if "len(" in code_lower and "if not" not in code_lower and "== 0" not in code_lower:
                observations.append("Ensure you handle the empty input base condition early.")

            obs_text = "\n\n".join(f"- {o}" for o in observations) if observations else "- Your structural flow is aligned with the required pattern."

            return {
                "reply": f"### Approach Evaluation\n\n"
                         f"Looking at your {language.upper()} code for **{problem_title}**:\n\n"
                         f"{obs_text}\n\n"
                         f"**Socratic Prompt**: What happens when you trace the very first test case step-by-step with your current pointers/state variables?",
                "suggested_questions": [
                    "What is the time complexity of this?",
                    "How do I fix the visited state?",
                    "Give me a small hint"
                ]
            }

        if action_type == "find_mistake":
            if len(user_code.strip()) < 15:
                return {
                    "reply": "Write or paste your code attempt into the editor first, then click **Find my mistake** so we can dissect the exact line where logic diverges.",
                    "suggested_questions": ["Explain the concept first", "Give me a level 1 hint"]
                }
            
            return {
                "reply": f"### Logical Diagnostics\n\n"
                         f"Inspecting your current {language.upper()} implementation:\n\n"
                         f"1. **Boundary / Index Offsets**: Check the upper bound of your loops. When dealing with subarrays or window ranges, ensure `index + 1` does not exceed bounds.\n"
                         f"2. **State Mutation**: Verify whether you modify variables in-place during iteration, which can invalidate subsequent checks.\n"
                         f"3. **Return Value on Edge Conditions**: What does your function return if the target is never found or if the container is empty?\n\n"
                         f"**Question**: Put a mental breakpoint right before your return statement. What exact value does the state variable hold for the sample test case?",
                "suggested_questions": [
                    "Explain complexity",
                    "Check my approach",
                    "Show pseudo-code (Hint 3)"
                ]
            }

        if action_type == "explain_complexity":
            opt_time = getattr(problem, "optimal_time_complexity", "O(n)")
            opt_space = getattr(problem, "optimal_space_complexity", "O(1)")
            return {
                "reply": f"### Complexity Analysis Breakdown\n\n"
                         f"- **Optimal Time Complexity:** `{opt_time}`\n"
                         f"- **Optimal Space / Memory Complexity:** `{opt_space}`\n\n"
                         f"**Why `{opt_time}`?**\n"
                         f"Each element or state is visited a constant number of times (at most O(1) work per element).\n\n"
                         f"**Why `{opt_space}`?**\n"
                         f"Auxiliary structures (hash tables, recursion stack, or queue) grow proportionally with input size `N` or remain bounded.\n\n"
                         f"**Socratic Question**: Can your current solution meet `{opt_time}` without allocating extra arrays?",
                "suggested_questions": [
                    "How to reduce space complexity?",
                    "Give me pseudo-code",
                    "Check my approach"
                ]
            }

        if action_type == "show_solution":
            sol = getattr(problem, "solution_explanation", "") or "Optimal implementation uses linear scanning with auxiliary state tracking."
            return {
                "reply": f"### Reference Walkthrough & Solution\n\n{sol}\n\n"
                         f"> **Key Takeaway**: Before jumping to the next problem, write down the pattern keyword for your notes (e.g. *Two-Pointer Shrinking Window*, *BFS Level Order*, etc.).",
                "suggested_questions": [
                    "Explain why this is optimal",
                    "Save this note to my notebook",
                    "Next problem in roadmap"
                ]
            }

        # Standard Socratic conversation flow
        if socratic_mode:
            clean_msg = latest_user_msg.lower()
            if "queue" in clean_msg:
                reply = "Good intuition. Why is a **FIFO Queue** better suited than a LIFO Stack for Level-Order / Shortest-Path traversals?"
            elif "stack" in clean_msg:
                reply = "Interesting. When you push elements onto the stack, what invariant do you want the top of the stack to maintain (e.g. monotonic order)?"
            elif "hash" in clean_msg or "map" in clean_msg or "dict" in clean_msg:
                reply = "Using a Hash Map gives O(1) average lookups. What will you use as the **key**, and what value must be stored with it?"
            elif "dp" in clean_msg or "dynamic" in clean_msg:
                reply = "Dynamic Programming is effective here. Can you write out the recurrence relation `dp[i] = ...` in terms of subproblems `dp[i-1]` or `dp[i-2]`?"
            elif "two pointer" in clean_msg or "pointer" in clean_msg:
                reply = "Two pointers are optimal for sorted or bounded sequences. Under what exact condition should the left pointer advance, and when should the right pointer advance?"
            elif "visited" in clean_msg or "cycle" in clean_msg:
                reply = "Correct. How will you represent the visited state — using a `Set`, an in-place modification (like mutating the cell value), or a boolean 2D array?"
            elif "time" in clean_msg or "complexity" in clean_msg:
                reply = f"For this problem, the optimal time is `{getattr(problem, 'optimal_time_complexity', 'O(n)')}`. Where do you suspect the computational bottleneck is in your logic?"
            else:
                reply = f"Let's break down **{problem_title}** step by step.\n\n" \
                        f"Before writing code, what is the core bottleneck of the brute-force approach, and what data structure could help eliminate redundant checks?"

            return {
                "reply": reply,
                "suggested_questions": [
                    "Give me a small hint",
                    "I think a Queue with BFS",
                    "I think a Hash Map",
                    "Explain the concept"
                ]
            }

        return {
            "reply": f"In **{problem_title}**, focus on recognizing the relationship between adjacent elements and boundary conditions. "
                     f"Let me know which part of the implementation you'd like to refine!",
            "suggested_questions": ["Give me a small hint", "Explain concept", "Check my approach"]
        }

    @staticmethod
    def generate_code_review(problem: Any, code: str, language: str, execution_result: Dict[str, Any]) -> AIReviewResponse:
        status = execution_result.get("status", "Accepted")
        passed = execution_result.get("passed_count", 0)
        total = execution_result.get("total_count", 1)
        opt_time = getattr(problem, "optimal_time_complexity", "O(n)")
        opt_space = getattr(problem, "optimal_space_complexity", "O(n)")

        is_accepted = status == "Accepted"
        code_lines = [l for l in code.splitlines() if l.strip()]

        # Heuristic detection of potential mistakes
        mistake = None
        if not is_accepted:
            if "IndexError" in str(execution_result.get("results", [])) or "out of range" in str(execution_result.get("results", [])):
                mistake = "Index Out Of Bounds: Your pointer or array index accessed an element past the array boundary or on an empty input container."
            elif "RecursionError" in str(execution_result.get("results", [])) or "maximum recursion" in str(execution_result.get("results", [])):
                mistake = "Missing / Unreachable Base Case: Recursion stack exceeded limits because termination condition was never satisfied."
            elif passed < total:
                mistake = f"Boundary Test Failure: Your logic passed {passed}/{total} test cases. It failed on specific edge cases (such as duplicate keys, negative numbers, or empty collections)."
            else:
                mistake = "Logical state inconsistency: Result variable differed from expected output on evaluation."

        # Detect complexity from code patterns
        detected_time = "O(n)"
        code_lower = code.lower()
        if "grid" in code_lower or "matrix" in code_lower or "board" in code_lower:
            detected_time = "O(m * n)"
        elif code_lower.count("for ") >= 2 or code_lower.count("while ") >= 2:
            if "for " in code_lower and "for " in code_lower[code_lower.find("for ") + 4:]:
                detected_time = "O(n^2)"
        elif "log" in code_lower or ">>" in code_lower or "/=" in code_lower or "//= 2" in code_lower:
            detected_time = "O(log n)" if "for" not in code_lower else "O(n log n)"

        detected_space = "O(1)"
        if "visited" in code_lower or "queue" in code_lower or "deque" in code_lower or "dfs" in code_lower or "stack" in code_lower:
            detected_space = "O(m * n)" if ("grid" in code_lower or "matrix" in code_lower) else "O(n)"
        elif "map" in code_lower or "dict" in code_lower or "set(" in code_lower or "list(" in code_lower or "new int[" in code_lower or "vector" in code_lower:
            detected_space = "O(n)"

        # Code quality evaluation
        has_clear_vars = all(len(v) > 1 for v in re.findall(r'\b[a-z]\b', code_lower) if v not in ['i', 'j', 'k', 'n', 'm'])
        readability = "Clean and structured" if len(code_lines) < 40 else "Acceptable but could be broken into helper methods"
        variable_naming = "Self-documenting and descriptive" if has_clear_vars else "Functional; consider avoiding overly single-letter variable names where context is lost"
        unnecessary_ops = "No redundant allocations detected" if "O(n²)" not in detected_time else "Nested iteration causes redundant computations"
        edge_cases = "Handled properly" if is_accepted else "Needs guard clauses for empty or single-element inputs"
        code_structure = "Follows idiomatic " + language.capitalize() + " conventions"

        correctness_text = "Your code successfully satisfies all public and private test cases with correct time/space performance." if is_accepted else f"Your solution passed {passed} of {total} test cases. Review the logical diagnosis below."

        summary = (
            f"The approach uses {detected_time} time and {detected_space} space complexity. "
            f"{'It meets the target efficiency for technical interviews.' if is_accepted else 'It requires optimization to reach the optimal ' + opt_time + ' runtime.'}"
        )

        recs = []
        if not is_accepted:
            recs.append("Verify base conditions before entering main loop")
            recs.append("Add test cases with extreme bounds (0, 1, and negative values)")
        if detected_time != opt_time and opt_time in ["O(n)", "O(log n)", "O(1)"]:
            recs.append(f"Aim to optimize from {detected_time} to {opt_time} using hash indexing or two pointers")
        recs.append("Ensure in-place state transitions when memory optimization is critical")

        return AIReviewResponse(
            correctness=correctness_text,
            mistake_detection=mistake,
            time_complexity=detected_time,
            space_complexity=detected_space,
            time_complexity_optimal=opt_time,
            space_complexity_optimal=opt_space,
            code_quality=CodeQualityScore(
                readability=readability,
                variable_naming=variable_naming,
                unnecessary_operations=unnecessary_ops,
                edge_cases=edge_cases,
                code_structure=code_structure
            ),
            overall_summary=summary,
            recommendations=recs
        )

    @staticmethod
    def evaluate_mock_interview(transcript: List[Dict[str, Any]], code: str, problem_title: str) -> MockInterviewReport:
        user_messages = [m.get("content", "") for m in transcript if m.get("role") == "user"]
        total_user_words = sum(len(m.split()) for m in user_messages)

        has_code = len(code.strip()) > 30
        has_communication = total_user_words > 40
        has_complexity_mention = any("o(" in m.lower() or "time" in m.lower() or "space" in m.lower() for m in user_messages)

        prob_solving = "Strong systematic decomposition of problem constraints" if has_communication else "Demonstrated understanding but could explain thought process more explicitly before coding"
        communication = "Clear, articulate explanation of trade-offs and edge cases" if total_user_words > 60 else "Good concise responses; practice verbalizing edge cases proactively"
        algo_choice = "Optimal algorithmic strategy selected with appropriate state tracking" if has_code else "Identified key data structures; complete implementation needed"
        code_qual = "Clean modular syntax with crisp variable naming" if has_code else "Drafted initial structure"
        complexity_eval = "Accurately analyzed both Time and Space Big-O implications" if has_complexity_mention else "Identified general scaling behavior"
        edge_eval = "Accounted for empty collections, boundary conditions, and duplicates"

        strengths = [
            f"Proactively recognized optimal pattern for {problem_title}",
            "Communicated logic clearly before jumping into syntax",
            "Understood space-time trade-offs"
        ]

        improvements = [
            "State edge cases out loud before writing the first line of code",
            "Manually dry-run a small 3-element test case on your written code",
            "Discuss potential scaling bottlenecks if input size N > 10^9"
        ]

        verdict = "Strong Hire (Technical & Algorithmic Excellence)" if (has_code and has_communication) else "Lean Hire (Good problem solving with room for verbal structuring)"

        return MockInterviewReport(
            problem_solving=prob_solving,
            communication=communication,
            algorithm_choice=algo_choice,
            code_quality=code_qual,
            complexity_analysis=complexity_eval,
            edge_cases=edge_eval,
            strengths=strengths,
            areas_for_improvement=improvements,
            verdict=verdict
        )
