import { Listing, Industry } from "../types";

export async function collectListings(industry?: Industry): Promise<Listing[]> {
  try {
    const response = await fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry })
    });
    
    if (!response.ok) throw new Error("Failed to collect");
    return await response.json();
  } catch (error) {
    console.error("Failed to collect listings:", error);
    return [];
  }
}

export async function getChatResponse(message: string, history: any[]): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });
    
    if (!response.ok) throw new Error("Chat failed");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting to the career scout engine right now.";
  }
}

export interface CompanyProfile {
  name: string;
  history: string;
  mission: string;
  focus: string;
}

export async function getFeaturedCompanies(): Promise<CompanyProfile[]> {
  try {
    const response = await fetch("/api/featured-companies");
    if (!response.ok) throw new Error("Failed to fetch featured companies");
    return await response.json();
  } catch (error) {
    console.error("Featured Companies Error:", error);
    return [];
  }
}

export interface ResearchData {
  news: string;
  interview: string;
  sentiment: string;
  prep: string;
}

export async function getResearchData(companyName: string, title: string): Promise<ResearchData | null> {
  try {
    const response = await fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, title })
    });
    
    if (!response.ok) throw new Error("Research failed");
    return await response.json();
  } catch (error) {
    console.error("Research Error:", error);
    return null;
  }
}
