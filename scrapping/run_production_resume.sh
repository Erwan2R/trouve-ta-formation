#!/bin/bash
set -e
cd "/c/Trouve ta formation"
LOG=data/_run.log
echo "=== RESUME (step5 onward) started: $(date) ===" >> "$LOG"

echo "--- step5_discover_maps.py ---" >> "$LOG"
python -u step5_discover_maps.py >> "$LOG" 2>&1

echo "--- step6_qualify.py ---" >> "$LOG"
python -u step6_qualify.py >> "$LOG" 2>&1

echo "--- step4_build_csv.py ---" >> "$LOG"
python -u step4_build_csv.py >> "$LOG" 2>&1

echo "--- test_matching.py ---" >> "$LOG"
python -u test_matching.py >> "$LOG" 2>&1

echo "=== Production run finished: $(date) ===" >> "$LOG"
