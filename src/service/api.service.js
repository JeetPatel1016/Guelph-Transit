const API_BASE_URL = import.meta.env.VITE_API_URL;

const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Returning the response data
  } catch (error) {
    throw new Error(error.message); // Throwing any errors encountered
  }
};

export const get = async (url) => {
  const data = await fetchAPI(url, {
    method: "GET",
  });
  return data;
};
