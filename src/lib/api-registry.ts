export type ApiParam = {
  name: string;
  type: "string" | "date" | "enum";
  required: boolean;
  default?: string;
  values?: string[];
  description: string;
};

export type ApiEndpoint = {
  path: string;
  description: string;
  params: ApiParam[];
};

export type QuickFill = {
  label: string;
  description: string;
  values: Record<string, string>;
};

export type ApiDefinition = {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  proxyPath: string;
  color: string;
  endpoints: ApiEndpoint[];
  quickFills: QuickFill[];
};

export const API_REGISTRY: ApiDefinition[] = [
  {
    id: "fred",
    name: "FRED",
    description: "Federal Reserve Economic Data",
    baseUrl: "https://api.stlouisfed.org/fred",
    proxyPath: "/api/proxy/fred",
    color: "blue",
    endpoints: [
      {
        path: "/series/observations",
        description: "Get observations for an economic data series",
        params: [
          {
            name: "series_id",
            type: "string",
            required: true,
            default: "DGS10",
            description: "Series identifier (e.g. DGS10, FEDFUNDS, CPIAUCSL)",
          },
          {
            name: "observation_start",
            type: "date",
            required: false,
            default: "2020-01-01",
            description: "Start date (YYYY-MM-DD)",
          },
          {
            name: "observation_end",
            type: "date",
            required: false,
            description: "End date (YYYY-MM-DD)",
          },
          {
            name: "frequency",
            type: "enum",
            required: false,
            values: ["d", "w", "m", "q", "a"],
            default: "m",
            description: "Frequency: daily, weekly, monthly, quarterly, annual",
          },
        ],
      },
    ],
    quickFills: [
      {
        label: "10-Year Treasury",
        description: "US Treasury yield, monthly since 2020",
        values: { series_id: "DGS10", observation_start: "2020-01-01", frequency: "m" },
      },
      {
        label: "Federal Funds Rate",
        description: "Fed interest rate, quarterly since 2000",
        values: { series_id: "FEDFUNDS", observation_start: "2000-01-01", frequency: "q" },
      },
      {
        label: "US Inflation (CPI)",
        description: "Consumer Price Index, annual since 1990",
        values: { series_id: "CPIAUCSL", observation_start: "1990-01-01", frequency: "a" },
      },
    ],
  },
  {
    id: "banxico",
    name: "Banxico",
    description: "Banco de Mexico SIE API",
    baseUrl: "https://www.banxico.org.mx/SieAPIRest/service/v1",
    proxyPath: "/api/proxy/banxico",
    color: "emerald",
    endpoints: [
      {
        path: "/series/{series}/datos/{startDate}/{endDate}",
        description: "Get time series data for Mexican economic indicators",
        params: [
          {
            name: "series",
            type: "string",
            required: true,
            default: "SF43718",
            description: "Series ID (SF43718 = USD/MXN exchange rate)",
          },
          {
            name: "startDate",
            type: "date",
            required: true,
            default: "2020-01-01",
            description: "Start date (YYYY-MM-DD)",
          },
          {
            name: "endDate",
            type: "date",
            required: true,
            default: "2024-12-31",
            description: "End date (YYYY-MM-DD)",
          },
        ],
      },
    ],
    quickFills: [
      {
        label: "USD/MXN Exchange Rate",
        description: "Dollar to peso, 2020 to 2024",
        values: { series: "SF43718", startDate: "2020-01-01", endDate: "2024-12-31" },
      },
      {
        label: "TIIE 28 Days",
        description: "Interbank interest rate, 2020 to 2024",
        values: { series: "SF283", startDate: "2020-01-01", endDate: "2024-12-31" },
      },
      {
        label: "Inflation Rate",
        description: "Mexican CPI, 2015 to 2024",
        values: { series: "SP74660", startDate: "2015-01-01", endDate: "2024-12-31" },
      },
    ],
  },
  {
    id: "worldbank",
    name: "World Bank",
    description: "World Development Indicators",
    baseUrl: "https://api.worldbank.org/v2",
    proxyPath: "/api/proxy/worldbank",
    color: "amber",
    endpoints: [
      {
        path: "/country/{country}/indicator/{indicator}",
        description: "Get development indicator data by country",
        params: [
          {
            name: "country",
            type: "string",
            required: true,
            default: "MEX",
            description: "Country code (MEX, USA, BRA, etc.)",
          },
          {
            name: "indicator",
            type: "string",
            required: true,
            default: "SP.DYN.CDRT.IN",
            description:
              "Indicator code (SP.DYN.CDRT.IN = death rate, SP.DYN.LE00.IN = life expectancy)",
          },
          {
            name: "date",
            type: "string",
            required: false,
            default: "2000:2023",
            description: "Year range (e.g. 2000:2023)",
          },
        ],
      },
    ],
    quickFills: [
      {
        label: "Mexico Death Rate",
        description: "Crude death rate per 1,000 people",
        values: { country: "MEX", indicator: "SP.DYN.CDRT.IN", date: "2000:2023" },
      },
      {
        label: "Mexico Life Expectancy",
        description: "Life expectancy at birth",
        values: { country: "MEX", indicator: "SP.DYN.LE00.IN", date: "1990:2023" },
      },
      {
        label: "USA vs Mexico GDP",
        description: "GDP per capita (current US$)",
        values: { country: "USA", indicator: "NY.GDP.PCAP.CD", date: "2000:2023" },
      },
    ],
  },
  {
    id: "custom",
    name: "Your API",
    description: "Custom Mortality Table",
    baseUrl: "/api/mortality",
    proxyPath: "/api/mortality",
    color: "indigo",
    endpoints: [
      {
        path: "",
        description: "Query a custom-built mortality table API (built in this project)",
        params: [
          {
            name: "age",
            type: "string",
            required: false,
            default: "45",
            description: "Age to query (0-100). Omit for usage docs.",
          },
          {
            name: "format",
            type: "enum",
            required: false,
            values: ["single", "table"],
            default: "single",
            description: "Response format: single age or full table",
          },
        ],
      },
    ],
    quickFills: [
      {
        label: "Age 45",
        description: "Mortality rate at age 45",
        values: { age: "45", format: "single" },
      },
      {
        label: "Age 65 (Retirement)",
        description: "Mortality at typical retirement age",
        values: { age: "65", format: "single" },
      },
      {
        label: "Full Life Table",
        description: "Complete abridged mortality table",
        values: { format: "table" },
      },
    ],
  },
];
