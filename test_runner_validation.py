import json
from backend.runner import execute_code

two_sum_tests = [
    {"input": json.dumps([[2, 7, 11, 15], 9]), "expected_output": "[0, 1]", "is_hidden": False},
    {"input": json.dumps([[3, 2, 4], 6]), "expected_output": "[1, 2]", "is_hidden": False},
    {"input": json.dumps([[3, 3], 6]), "expected_output": "[0, 1]", "is_hidden": False}
]

# 1. C++ WRONG STARTER CODE (Should FAIL: 0/3 passed, status: Wrong Answer)
cpp_starter = """
#include <vector>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return {};
    }
};
"""
res1 = execute_code("cpp", cpp_starter, two_sum_tests)
print("1. C++ Starter Code:", res1["status"], f"({res1['passed_count']}/{res1['total_count']} passed)")
assert res1["status"] == "Wrong Answer"
assert res1["passed_count"] == 0

# 2. C++ SYNTAX ERROR (Should FAIL: Compile Error)
cpp_broken = """
#include <vector>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        return 123
    }
};
"""
res2 = execute_code("cpp", cpp_broken, two_sum_tests)
print("2. C++ Broken Code:", res2["status"])
assert res2["status"] == "Compile Error"

# 3. C++ CORRECT SOLUTION (Should PASS: 3/3 passed, status: Accepted)
cpp_correct = """
#include <vector>
#include <unordered_map>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            int comp = target - nums[i];
            if (seen.count(comp)) {
                return {seen[comp], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};
"""
res3 = execute_code("cpp", cpp_correct, two_sum_tests)
print("3. C++ Correct Code:", res3["status"], f"({res3['passed_count']}/{res3['total_count']} passed)")
assert res3["status"] == "Accepted"
assert res3["passed_count"] == 3

# 4. PYTHON WRONG STARTER CODE
py_starter = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        return []
"""
res4 = execute_code("python", py_starter, two_sum_tests)
print("4. Python Starter Code:", res4["status"], f"({res4['passed_count']}/{res4['total_count']} passed)")
assert res4["status"] == "Wrong Answer"
assert res4["passed_count"] == 0

# 5. PYTHON CORRECT CODE
py_correct = """
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            diff = target - num
            if diff in seen:
                return [seen[diff], i]
            seen[num] = i
        return []
"""
res5 = execute_code("python", py_correct, two_sum_tests)
print("5. Python Correct Code:", res5["status"], f"({res5['passed_count']}/{res5['total_count']} passed)")
assert res5["status"] == "Accepted"
assert res5["passed_count"] == 3

# 6. JS WRONG STARTER CODE
js_starter = """
var twoSum = function(nums, target) {
    return [];
};
"""
res6 = execute_code("javascript", js_starter, two_sum_tests)
print("6. JS Starter Code:", res6["status"], f"({res6['passed_count']}/{res6['total_count']} passed)")
assert res6["status"] == "Wrong Answer"
assert res6["passed_count"] == 0

# 7. JS CORRECT CODE
js_correct = """
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) return [map.get(comp), i];
        map.set(nums[i], i);
    }
    return [];
};
"""
res7 = execute_code("javascript", js_correct, two_sum_tests)
print("7. JS Correct Code:", res7["status"], f"({res7['passed_count']}/{res7['total_count']} passed)")
assert res7["status"] == "Accepted"
assert res7["passed_count"] == 3

print("\nALL 7 TESTS PASSED ACCURATELY! NO FALSE APPROVALS!")
