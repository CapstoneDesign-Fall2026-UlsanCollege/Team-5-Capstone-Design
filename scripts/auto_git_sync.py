#!/usr/bin/env python3
"""
Smart Study Companion — Automatic Git Sync Daemon
Monitors the workspace for any code changes.
When changes are detected:
1. Syncs `src/` to `public/src/`
2. Automatically commits with a timestamp
3. Pushes to GitHub automatically
"""

import os
import sys
import time
import shutil
import subprocess
from datetime import datetime

WORKSPACE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INTERVAL_SECONDS = 10

def run_cmd(cmd, cwd=WORKSPACE):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.returncode, res.stdout.strip(), res.stderr.strip()

def has_changes():
    # Ignore .env, .package, .vscode
    code, stdout, _ = run_cmd("git status --porcelain")
    if code != 0 or not stdout:
        return False
    lines = [
        line for line in stdout.splitlines()
        if not any(ign in line for ign in ['.env', '.package', '.vscode', 'package-lock.json'])
    ]
    return len(lines) > 0

def sync_src_to_public():
    src_dir = os.path.join(WORKSPACE, 'src')
    dest_dir = os.path.join(WORKSPACE, 'public', 'src')
    if os.path.exists(src_dir):
        os.makedirs(dest_dir, exist_ok=True)
        for item in os.listdir(src_dir):
            s = os.path.join(src_dir, item)
            d = os.path.join(dest_dir, item)
            if os.path.isdir(s):
                if os.path.exists(d):
                    shutil.rmtree(d)
                shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)

def auto_commit_and_push():
    sync_src_to_public()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Get active branch name
    _, branch, _ = run_cmd("git rev-parse --abbrev-ref HEAD")
    branch = branch or "supabase-auth"

    run_cmd("git add -A")
    commit_msg = f"auto: update {branch} ({now_str})"
    code, out, err = run_cmd(f'git commit -m "{commit_msg}"')
    if code != 0:
        return False

    print(f"[{now_str}] Changes committed: {commit_msg}")
    push_code, push_out, push_err = run_cmd(f"git push origin {branch}")
    if push_code == 0:
        print(f"[{now_str}] 🚀 Successfully pushed to GitHub on branch '{branch}'!")
        return True
    else:
        print(f"[{now_str}] Push warning: {push_err or push_out}")
        return False

def main():
    print(f"============================================================")
    print(f"  Smart Study Companion — Auto Git Sync Active")
    print(f"  Checking for changes every {INTERVAL_SECONDS} seconds...")
    print(f"============================================================")
    
    while True:
        try:
            if has_changes():
                print("\n[Auto-Sync] Detected file modifications...")
                # Wait 2 seconds for batch writes to settle
                time.sleep(2)
                auto_commit_and_push()
            time.sleep(INTERVAL_SECONDS)
        except KeyboardInterrupt:
            print("\n[Auto-Sync] Stopped by user.")
            sys.exit(0)
        except Exception as e:
            print(f"[Auto-Sync Error] {e}")
            time.sleep(INTERVAL_SECONDS)

if __name__ == '__main__':
    main()

