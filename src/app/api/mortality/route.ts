import { NextRequest, NextResponse } from "next/server";

const MORTALITY_TABLE: Record<number, { qx: number; lx: number; ex: number }> = {
  0:  { qx: 0.00566, lx: 100000, ex: 75.1 },
  1:  { qx: 0.00041, lx: 99434,  ex: 74.5 },
  5:  { qx: 0.00015, lx: 99271,  ex: 70.6 },
  10: { qx: 0.00012, lx: 99197,  ex: 65.7 },
  15: { qx: 0.00052, lx: 99138,  ex: 60.7 },
  20: { qx: 0.00098, lx: 98880,  ex: 55.9 },
  25: { qx: 0.00101, lx: 98397,  ex: 51.1 },
  30: { qx: 0.00112, lx: 97901,  ex: 46.3 },
  35: { qx: 0.00145, lx: 97354,  ex: 41.5 },
  40: { qx: 0.00210, lx: 96649,  ex: 36.8 },
  45: { qx: 0.00354, lx: 95635,  ex: 32.1 },
  50: { qx: 0.00569, lx: 93941,  ex: 27.6 },
  55: { qx: 0.00904, lx: 91268,  ex: 23.3 },
  60: { qx: 0.01426, lx: 87151,  ex: 19.2 },
  65: { qx: 0.02199, lx: 80932,  ex: 15.5 },
  70: { qx: 0.03498, lx: 72039,  ex: 12.1 },
  75: { qx: 0.05578, lx: 59449,  ex: 9.1  },
  80: { qx: 0.09021, lx: 43333,  ex: 6.6  },
  85: { qx: 0.14680, lx: 26393,  ex: 4.7  },
  90: { qx: 0.23150, lx: 12527,  ex: 3.3  },
  95: { qx: 0.34510, lx: 4136,   ex: 2.3  },
  100:{ qx: 0.50000, lx: 873,    ex: 1.5  },
};

const AGES = Object.keys(MORTALITY_TABLE).map(Number).sort((a, b) => a - b);

function interpolate(age: number) {
  if (MORTALITY_TABLE[age]) return MORTALITY_TABLE[age];

  const lower = AGES.filter((a) => a <= age).pop()!;
  const upper = AGES.find((a) => a > age)!;

  if (lower === undefined || upper === undefined) {
    return MORTALITY_TABLE[AGES[AGES.length - 1]];
  }

  const t = (age - lower) / (upper - lower);
  const lo = MORTALITY_TABLE[lower];
  const hi = MORTALITY_TABLE[upper];

  return {
    qx: parseFloat((lo.qx + t * (hi.qx - lo.qx)).toFixed(5)),
    lx: Math.round(lo.lx + t * (hi.lx - lo.lx)),
    ex: parseFloat((lo.ex + t * (hi.ex - lo.ex)).toFixed(1)),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ageParam = searchParams.get("age");
  const format = searchParams.get("format") || "single";

  if (format === "table") {
    const rows = AGES.map((age) => ({
      age,
      ...MORTALITY_TABLE[age],
    }));
    return NextResponse.json({
      source: "Custom API / teaching-apis",
      description: "Mexican abridged life table (simplified, illustrative)",
      table: rows,
    });
  }

  if (!ageParam) {
    return NextResponse.json({
      error: "Missing required parameter: age",
      usage: {
        single: "GET /api/mortality?age=45",
        table: "GET /api/mortality?format=table",
        description: "Returns mortality rate (qx), survivors (lx), and life expectancy (ex) for a given age",
      },
      example_response: {
        age: 45,
        qx: 0.00354,
        lx: 95635,
        ex: 32.1,
      },
    }, { status: 400 });
  }

  const age = parseInt(ageParam);
  if (isNaN(age) || age < 0 || age > 100) {
    return NextResponse.json(
      { error: "Age must be a number between 0 and 100" },
      { status: 400 }
    );
  }

  const data = interpolate(age);

  return NextResponse.json({
    age,
    qx: data.qx,
    lx: data.lx,
    ex: data.ex,
    source: "Custom API / teaching-apis",
    description: `Mortality data for age ${age}`,
  });
}
