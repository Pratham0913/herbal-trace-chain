interface LocationIQResponse {
  display_name: string;
  address: {
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressData {
  fullAddress: string;
  village?: string;
  town?: string;
  city?: string;
  district?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<AddressData> => {
  const API_KEY = 'pk.370fb8d2116b016a7f4cea8283d900ac';
  const url = `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.status}`);
    }

    const data: LocationIQResponse = await response.json();
    
    return {
      fullAddress: data.display_name,
      village: data.address.village,
      town: data.address.town,
      city: data.address.city,
      district: data.address.county,
      state: data.address.state,
      postcode: data.address.postcode,
      country: data.address.country
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    throw new Error('Failed to get address from coordinates');
  }
};