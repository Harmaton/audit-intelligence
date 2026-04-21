import fs from "fs";
import path from "path";
import { seedEntities } from "./seed";
import type { Entity } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ENTITIES_FILE = path.join(DATA_DIR, "entities.json");

function ensureInitialised() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ENTITIES_FILE)) {
    fs.writeFileSync(
      ENTITIES_FILE,
      JSON.stringify(seedEntities, null, 2),
      "utf-8"
    );
  }
}

export function readEntities(): Entity[] {
  ensureInitialised();
  try {
    const raw = fs.readFileSync(ENTITIES_FILE, "utf-8");
    return JSON.parse(raw) as Entity[];
  } catch {
    return [...seedEntities];
  }
}

export function writeEntities(entities: Entity[]): void {
  ensureInitialised();
  fs.writeFileSync(ENTITIES_FILE, JSON.stringify(entities, null, 2), "utf-8");
}

export function addEntity(input: Omit<Entity, "id" | "createdAt">): Entity {
  const list = readEntities();
  const id = `ent-${(list.length + 1).toString().padStart(3, "0")}-${Date.now()
    .toString(36)
    .slice(-4)}`;
  const newEntity: Entity = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    onboardedViaPlatform: true,
  };
  writeEntities([...list, newEntity]);
  return newEntity;
}
