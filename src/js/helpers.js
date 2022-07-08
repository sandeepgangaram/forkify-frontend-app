import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const corsHeaders = {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    };

    const res = await Promise.race([
      fetch(url, { headers: corsHeaders }),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} (status code : ${res.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPost = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPost, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`${data.message} (status code : ${res.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};
