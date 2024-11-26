import AsyncStorage from '@react-native-async-storage/async-storage';

async function fetchProtected() {
  try {
    let accessToken = await AsyncStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.error('Access token is missing');
      return;
    }

    let response = await fetch('/api/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      console.log('Access token expired. Trying to refresh token...');
      
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const refreshResponse = await fetch('/api/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken } = await refreshResponse.json();
        await AsyncStorage.setItem('accessToken', newAccessToken);  
        console.log('Access token refreshed');
        
        response = await fetch('/api/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newAccessToken}`,
          },
        });
      } else {
        console.error('Failed to refresh token');
        return;
      }
    }

    if (response.ok) {
      const data = await response.json();
      console.log('Protected data:', data);
    } else {
      console.error('Failed to fetch protected resource');
    }
  } catch (error) {
    console.error('Error fetching protected resource:', error);
  }
}

export { fetchProtected };