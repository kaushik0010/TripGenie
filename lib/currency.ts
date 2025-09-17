import axios from 'axios';

const countryToCurrencyMap: { [key: string]: string } = {
  'India': 'INR',
  'USA': 'USD',
  'United States': 'USD',
  'Sri Lanka': 'LKR',
  'Japan': 'JPY',
  'Italy': 'EUR',
  'France': 'EUR',
  'Germany': 'EUR'
};

export async function getDestinationCurrency(destination: string): Promise<string | null> {
  const country = destination.split(',').pop()?.trim();
  if (country && countryToCurrencyMap[country]) {
    return countryToCurrencyMap[country];
  }
  return null;
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number | null> {
  if (from === to) return amount;

  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}/${amount}`);
    if (response.data && response.data.result === 'success') {
      return Math.round(response.data.conversion_result);
    }
    return null;
  } catch (error) {
    console.error("Currency conversion failed:", error);
    return null;
  }
}