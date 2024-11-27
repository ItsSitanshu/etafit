import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'react-native-dotenv';

/**
 * Helper function to make API requests.
 * 
 * @param {string} route - The API route to fetch the resource from.
 * @param {string} method - The HTTP method to use (GET, POST, etc.).
 * @param {string} body - The body of the request (usually a JSON string).
 * @param {string} accessToken - The current access token.
 * @param {boolean} isRefreshAttempt - Flag to indicate if it's a retry after token refresh.
 * @returns {Promise<Response>} The response object.
 */
async function makeRequest(route: string, method: string, body: string, accessToken: string, isRefreshAttempt = false) {
  const API = API_URL;

  let options: any = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  if (method !== "GET") {
    options.body = body;
  } else {
    const url = new URL(`${API}/${route}`);
    const params = JSON.parse(body);  
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    return fetch(url, options);
  }

  return fetch(`${API}/${route}`, options);
}

/**
 * Fetches a protected resource with an optional refresh token mechanism.
 * 
 * @param {string} route - The API route to fetch the protected resource from (e.g., '/api/protected').
 * @param {string} method - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {string} body - The body of the request (usually a JSON string).
 * @returns {Promise<Object>} The data or error response from the API.
 */
async function fetchProtected(route: string, method: string, body: string) {
  const API = API_URL;
  try {
    let accessToken = await AsyncStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.error('Access token is missing');
      return { error: true, statusCode: 401, message: 'Access token is missing' };
    }

    let response = await makeRequest(route, method, body, accessToken);

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh token...');
      
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const refreshResponse = await fetch(`${API}/api/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken } = await refreshResponse.json();
        await AsyncStorage.setItem('accessToken', newAccessToken);  
        console.log('Access token refreshed');

        response = await makeRequest(route, method, body, newAccessToken, true);
      } else {
        console.error('Failed to refresh token');
        return {
          error: true,
          statusCode: 403,
          message: 'Failed to refresh token'
        };
      }
    }

    if (response.ok) {
      const data = await response.json();
      return { error: false, statusCode: 200, data: data };
    } else {
      return {
        error: true,
        statusCode: response.status,
        message: `Failed to fetch protected resource: ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error('Error fetching protected resource:', error);
    return { 
      error: true,
      statusCode: 500,
      message: 'Internal server error'
    };
  }
}

export { fetchProtected };
