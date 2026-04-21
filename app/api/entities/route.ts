import { NextRequest, NextResponse } from "next/server";
import { addEntity, readEntities } from "@/lib/store";
import type { EntityType, Region, RiskLevel, Sector } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const entities = readEntities();
  return NextResponse.json({ entities });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["name", "type", "sector", "region"];
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json(
          { error: `Missing required field: ${f}` },
          { status: 400 }
        );
      }
    }
    const entity = addEntity({
      name: String(body.name),
      type: body.type as EntityType,
      sector: body.sector as Sector,
      region: body.region as Region,
      budgetTzsB: Number(body.budgetTzsB) || 0,
      riskLevel: (body.riskLevel as RiskLevel) || "Moderate",
      riskScore: Number(body.riskScore) || 50,
      openRecommendations: 0,
      closedRecommendations: 0,
      reconciliationGapsTzsB: 0,
      lastAudit: new Date().toISOString().slice(0, 10),
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      dataConnections: Array.isArray(body.dataConnections)
        ? body.dataConnections
        : [],
    });
    return NextResponse.json({ entity }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
