import json
from backend.runner import execute_code
from backend.seed_data import PROBLEMS_DATA

for p in PROBLEMS_DATA:
    slug = p["slug"]
    test_cases = json.loads(p["test_cases"])
    starter = json.loads(p["starter_code"])
    
    print(f"\n--- Testing Problem: {slug} ---")
    
    # Test starter C++ (Must NOT be Accepted - should be Wrong Answer / Compile Error)
    if "cpp" in starter:
        res_cpp_starter = execute_code("cpp", starter["cpp"], test_cases)
        print(f"  [C++ Starter] Status: {res_cpp_starter['status']} ({res_cpp_starter['passed_count']}/{res_cpp_starter['total_count']} passed)")
        assert res_cpp_starter['status'] in ["Wrong Answer", "Compile Error"]
        assert res_cpp_starter['status'] != "Accepted"
        assert res_cpp_starter['passed_count'] < len(test_cases)

    # Test starter Python (Must NOT be Accepted)
    if "python" in starter:
        res_py_starter = execute_code("python", starter["python"], test_cases)
        print(f"  [Python Starter] Status: {res_py_starter['status']} ({res_py_starter['passed_count']}/{res_py_starter['total_count']} passed)")
        assert res_py_starter['status'] in ["Wrong Answer", "Compile Error"]
        assert res_py_starter['status'] != "Accepted"
        assert res_py_starter['passed_count'] < len(test_cases)

    # Test complete Solution Python (Must PASS with Accepted)
    hints = json.loads(p["hints"])
    sol_hint = [h for h in hints if h["level"] == 5]
    if sol_hint:
        sol_code = sol_hint[0]["content"]
        res_py_sol = execute_code("python", sol_code, test_cases)
        print(f"  [Python Solution Hint] Status: {res_py_sol['status']} ({res_py_sol['passed_count']}/{res_py_sol['total_count']} passed)")
        assert res_py_sol['status'] == "Accepted"
        assert res_py_sol['passed_count'] == len(test_cases)

print("\n>>> ALL PROBLEMS VERIFIED! Real test cases are strictly evaluated without false approvals! <<<")
