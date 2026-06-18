const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");

function killPort(port) {
  if (process.platform !== "win32") return;

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    const pids = new Set();
    for (const line of output.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") {
        pids.add(pid);
      }
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Stopped process ${pid} on port ${port}`);
      } catch {
        // already exited
      }
    }
  } catch {
    // port not in use
  }
}

for (const port of [3000, 3001]) {
  killPort(port);
}

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Removed .next cache");
}
