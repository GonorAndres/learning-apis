type MockContract = {
  method: string;
  path: string;
  description: string;
  params: { name: string; type: string; required: boolean; example: string }[];
  responseTemplate: string;
};

const contracts = new Map<string, MockContract>();

export function registerContract(contract: MockContract) {
  const key = `${contract.method}:${contract.path}`;
  contracts.set(key, contract);
}

export function getContract(method: string, path: string): MockContract | undefined {
  return contracts.get(`${method}:${path}`);
}

export function generateResponse(
  contract: MockContract,
  params: Record<string, string>
): string {
  let response = contract.responseTemplate;
  for (const [key, value] of Object.entries(params)) {
    response = response.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, "g"),
      value
    );
  }
  response = response.replace(/\{\{[^}]+\}\}/g, "null");
  return response;
}
