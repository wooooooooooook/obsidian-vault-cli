#!/usr/bin/env python3
"""
Run obsidian-vault-cli command with proper credentials from config.
Usage: python3 run.py <command> [args...]
"""
import os, sys, json, subprocess

# Read config
config = json.load(open(os.path.expanduser("~/.config/obsidian-livesync/config.json")))

# Set environment
env = os.environ.copy()
env["COUCHDB_URL"] = config["dbUrl"]
env["COUCHDB_USER"] = config["dbUser"]
env["COUCHDB_PASSWORD"] = config["dbPass"]
env["DB_NAME"] = config["dbName"]
env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

# Run command
os.chdir(os.path.dirname(os.path.abspath(__file__)))
cmd = [
    "node",
    "--import", "./polyfill.mjs",
    "--import", "tsx/esm",
    "--import", 'data:text/javascript,import{register}from"node:module";import{pathToFileURL}from"node:url";register("./path-loader.mjs",pathToFileURL("./"));',
    "src/index.ts",
] + sys.argv[1:]

result = subprocess.run(cmd, env=env, capture_output=True, text=True, timeout=120)
# Print stderr warnings only, suppress node warnings
for line in result.stderr.splitlines():
    if "Warning" not in line and "Deprecation" not in line and "Experimental" not in line:
        print(line, file=sys.stderr)
sys.stdout.write(result.stdout)
sys.exit(result.returncode)
