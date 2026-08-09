export type MockParam = {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  example: string;
};

export type MockContract = {
  method: "GET" | "POST";
  path: string;
  description: string;
  params: MockParam[];
  responseTemplate: string;
};

type EvaluationResult =
  | { ok: true; body: unknown }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseContract(value: unknown): MockContract | null {
  if (!isRecord(value)) return null;
  if (value.method !== "GET" && value.method !== "POST") return null;
  if (typeof value.path !== "string" || !/^\/api\/mock\/[a-z0-9/_-]+$/i.test(value.path)) return null;
  if (typeof value.description !== "string" || value.description.length > 500) return null;
  if (typeof value.responseTemplate !== "string" || value.responseTemplate.length > 10_000) return null;
  if (!Array.isArray(value.params) || value.params.length > 20) return null;

  const names = new Set<string>();
  const params: MockParam[] = [];
  for (const param of value.params) {
    if (!isRecord(param)) return null;
    if (typeof param.name !== "string" || !/^[a-z_][a-z0-9_]*$/i.test(param.name)) return null;
    if (names.has(param.name)) return null;
    if (param.type !== "string" && param.type !== "number" && param.type !== "boolean") return null;
    if (typeof param.required !== "boolean" || typeof param.example !== "string") return null;

    names.add(param.name);
    params.push({
      name: param.name,
      type: param.type,
      required: param.required,
      example: param.example,
    });
  }

  return {
    method: value.method,
    path: value.path,
    description: value.description,
    params,
    responseTemplate: value.responseTemplate,
  };
}

export function evaluateContract(contractValue: unknown, valuesValue: unknown): EvaluationResult {
  const contract = parseContract(contractValue);
  if (!contract || !isRecord(valuesValue)) {
    return { ok: false, error: "Invalid contract" };
  }

  const values: Record<string, string> = {};
  for (const param of contract.params) {
    const value = valuesValue[param.name];
    if (value !== undefined && typeof value !== "string") {
      return { ok: false, error: `Invalid value for parameter: ${param.name}` };
    }
    if (param.required && !value) {
      return { ok: false, error: `Missing required parameter: ${param.name}` };
    }
    if (!value) continue;
    if (param.type === "number" && !Number.isFinite(Number(value))) {
      return { ok: false, error: `Parameter must be a number: ${param.name}` };
    }
    if (param.type === "boolean" && value !== "true" && value !== "false") {
      return { ok: false, error: `Parameter must be true or false: ${param.name}` };
    }
    values[param.name] = value;
  }

  let response = contract.responseTemplate;
  for (const [key, value] of Object.entries(values)) {
    response = response.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  response = response.replace(/\{\{[^}]+\}\}/g, "null");

  try {
    return { ok: true, body: JSON.parse(response) };
  } catch {
    return { ok: false, error: "Response template must produce valid JSON" };
  }
}
