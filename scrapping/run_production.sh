#!/bin/bash
set -e
cd "/c/Trouve ta formation"
LOG=data/_run.log
echo "=== Production run started: $(date) ===" >> "$LOG"

echo "--- step1_discover.py ---" >> "$LOG"
python step1_discover.py >> "$LOG" 2>&1

echo "--- step2_enrich_sirene.py ---" >> "$LOG"
python step2_enrich_sirene.py >> "$LOG" 2>&1

echo "--- step3_enrich_web.py ---" >> "$LOG"
python step3_enrich_web.py >> "$LOG" 2>&1

echo "--- step5_discover_maps.py ---" >> "$LOG"
python step5_discover_maps.py >> "$LOG" 2>&1

echo "--- step6_qualify.py ---" >> "$LOG"
python step6_qualify.py >> "$LOG" 2>&1

echo "--- step4_build_csv.py ---" >> "$LOG"
python step4_build_csv.py >> "$LOG" 2>&1

echo "--- test_matching.py ---" >> "$LOG"
python test_matching.py >> "$LOG" 2>&1

echo "=== Production run finished: $(date) ===" >> "$LOG"
