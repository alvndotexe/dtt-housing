export type Success<D> = {
  type: "Success";
  data: D;
};

export type ErrorType<D, M extends string> = {
  type: "Error";
  data: D;
  message: M;
};

type HttpConfig = {
  method?: "GET" | "POST" | "DELETE";
  headers?: { "X-API-KEY": "nZ9CatLOv48wohJTdgyAk0pSQic52IEz" };
  body?: any;
};

export class NetworkError extends Error {
  response: Response;
  status: number;
  statusText: string;

  constructor(response: Response) {
    super("Network Error occured");
    this.response = response;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

export function notFetch(path: string, config: Omit<HttpConfig, "headers">) {
  const actualConfig = {
    ...config,
    headers: { "X-API-KEY": "nZ9CatLOv48wohJTdgyAk0pSQic52IEz" },
  };
  return fetch(`https://api.intern.d-tt.nl/api/${path}`, actualConfig)
    .then((result) => {
      if (!result.ok) throw new NetworkError(result);
      return result;
    })
    .catch((error) => error as NetworkError);
}

export function handleNetworkError(
  e: NetworkError
): ErrorType<NetworkError, string> {
  return {
    type: "Error",
    data: e,
    message: e.message,
  };
}
