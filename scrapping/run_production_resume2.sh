#!/bin/bash
set -e
cd "/c/Trouve ta formation"
LOG=data/_run.log
echo "=== RESUME2 (step6 onward) started: $(date) ===" >> "$LOG"

echo "--- step6_qualify.py ---" >> "$LOG"
python -u step6_qualify.py >> "$LOG" 2>&1

echo "--- step4_build_csv.py ---" >> "$LOG"
python -u step4_build_csv.py >> "$LOG" 2>&1

echo "--- test_matching.py ---" >> "$LOG"
python -u test_matching.py >> "$LOG" 2>&1

echo "=== Production run finished: $(date) ===" >> "$LOG"
