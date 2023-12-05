import {UsageError} from 'clipanion';

export async function fetchUrl(url: string, options: RequestInit = {}) {
  if (process.env.COREPACK_ENABLE_NETWORK === `0`)
    throw new UsageError(`Network access disabled by the environment; can't reach ${url}`);

  try {
    const response = await fetch(url, options);
    const statusCode = response.status;
    if (statusCode != null && statusCode >= 200 && statusCode < 300)
      return response;

    throw new Error(`Server answered with HTTP ${statusCode} when performing the request to ${url}; for troubleshooting help, see https://github.com/nodejs/corepack#troubleshooting`);
  } catch (err) {
    throw new Error(`Error when performing the request to ${url}; for troubleshooting help, see https://github.com/nodejs/corepack#troubleshooting`, {
      cause: err,
    });
  }
}

export async function fetchUrlStream(url: string, options: RequestInit = {}) {
  const response = await fetchUrl(url, options);

  if (response.body)
    return response.body;

  throw new Error(`Response has no body`);
}

export async function fetchAsBuffer(url: string, options?: RequestInit) {
  const response = await fetchUrl(url, options);
  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

export async function fetchAsJson(url: string, options?: RequestInit) {
  const response = await fetchUrl(url, options);
  const asText = await response.text();

  try {
    return JSON.parse(asText);
  } catch (error) {
    const truncated = asText.length > 30
      ? `${asText.slice(0, 30)}...`
      : asText;

    throw new Error(`Couldn't parse JSON data: ${JSON.stringify(truncated)}`);
  }
}
