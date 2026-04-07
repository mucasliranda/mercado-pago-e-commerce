import { spawnSync } from "node:child_process";

const PRODUCTION_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID_PRODUCTION || "psgffxtbccsnpuqkrbww";
const STAGING_PROJECT_ID = process.env.SUPABASE_PROJECT_ID_STAGING;
const command = process.argv[2];
const stagingBranchName = process.argv[3] || "staging";

function runSupabase(args) {
  const result = spawnSync("npx", ["supabase", ...args], {
    cwd: process.cwd(),
    env: process.env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function requireStagingProjectId() {
  if (STAGING_PROJECT_ID) {
    return;
  }

  console.error(
    "SUPABASE_PROJECT_ID_STAGING is not set. Create the persistent branch first and export its BRANCH PROJECT ID.",
  );
  process.exit(1);
}

switch (command) {
  case "list":
    runSupabase([
      "--experimental",
      "branches",
      "list",
      "--project-ref",
      PRODUCTION_PROJECT_ID,
    ]);
    break;
  case "create-staging":
    runSupabase([
      "--experimental",
      "branches",
      "create",
      stagingBranchName,
      "--persistent",
      "--project-ref",
      PRODUCTION_PROJECT_ID,
    ]);
    break;
  case "link-prod":
    runSupabase(["link", "--project-ref", PRODUCTION_PROJECT_ID]);
    break;
  case "link-staging":
    requireStagingProjectId();
    runSupabase(["link", "--project-ref", STAGING_PROJECT_ID]);
    break;
  case "push-config-prod":
    runSupabase(["config", "push", "--project-ref", PRODUCTION_PROJECT_ID]);
    break;
  case "push-config-staging":
    requireStagingProjectId();
    runSupabase(["config", "push", "--project-ref", STAGING_PROJECT_ID]);
    break;
  case "push-db-prod":
    runSupabase(["db", "push", "--project-ref", PRODUCTION_PROJECT_ID]);
    break;
  case "push-db-staging":
    requireStagingProjectId();
    runSupabase(["db", "push", "--project-ref", STAGING_PROJECT_ID]);
    break;
  default:
    console.error(
      [
        "Usage: node scripts/supabase-branching.mjs <command> [branch-name]",
        "",
        "Commands:",
        "  list",
        "  create-staging [branch-name]",
        "  link-prod",
        "  link-staging",
        "  push-config-prod",
        "  push-config-staging",
        "  push-db-prod",
        "  push-db-staging",
      ].join("\n"),
    );
    process.exit(1);
}
