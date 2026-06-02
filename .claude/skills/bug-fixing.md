# Bug Fix Workflow
1. Reproduce: identify the exact symptom and which file the user pointed to.
2. Trace from symptom backward through the call stack — do NOT start in data/CSV files.
3. Check for animation event bubbling if UI/animation related.
4. After fixing the reported case, audit ALL sibling handlers/cases for the same bug.
5. Run the validator and report what was changed.
