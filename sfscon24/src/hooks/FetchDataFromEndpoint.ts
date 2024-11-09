
const baseUrl = "http://localhost:9000";

export async function fetchDataFromEndpoint(
    fun: string,
    params: Record<string, string>
  ) {
    try {
      const url = new URL(baseUrl + "/" + fun);
      
      // Add parameters to URL if they exist
      if (Object.keys(params).length > 0) {
        Object.entries(params).forEach(([key, value]) =>
          url.searchParams.append(key, value)
        );
      }
  
      console.log("Complete URL:", url.toString());
  
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Request error: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Received data:", data);
      return data;
  
    } catch (error) {
      console.error("Error during request:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }