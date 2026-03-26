// src/lib/openalex.ts
// Functions to fetch academic profile and publications from OpenAlex API for my profile, using the OpenAlex ID and email for contact. The data is structured according to the MetricsPerso and Paper types defined in src/types/openalex.ts.

import type { MetricsPerso, Paper } from "@/types/metrics";
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const MY_ID = "a5007853822"; // OpenAlex ID for Léa Brunschwig
const EMAIL = "lea.brunschwig@univ-pau.fr" // Email for OpenAlex API contact

/**
 * Fetches the academic profile and publications for the author with the specified OpenAlex ID.
 * @returns An object containing the author's metrics and a list of their publications.
 */
export async function getAcademicProfile() {
    // Fetch author metrics
    const authorResponse = await fetch(`https://api.openalex.org/authors/${MY_ID}?mailto=${EMAIL}`);
    const authorData : MetricsPerso = await authorResponse.json();

    return {
        metrics: {
            hIndex: authorData.summary_stats.h_index,
            i10Index: authorData.summary_stats.i10_index,
            nbPapers: authorData.works_count,
            nbCitations: authorData.cited_by_count,
            yearlyStats: authorData.counts_by_year
        }
    };
}

async function fetchPublications() {

    try {
        // Fetch author's publications
        const papersResponse = await fetch(`https://api.openalex.org/works?filter=author.id:${MY_ID}&sort=publication_year:desc&mailto=${EMAIL}`);
        const papersData = await papersResponse.json();

        const mappedPapers: Paper[] = papersData.results.map((paper: any) => {

            const venue = paper.primary_location?.source?.display_name || paper.primary_location?.raw_source_name || paper.best_oa_location?.source?.display_name || "Unknown Venue";

            let venueType: Paper['type'] = 'Other';
            const rawType = (paper.primary_location?.raw_type || paper.type || '').toLowerCase();

            if (rawType.includes('proceedings') || rawType.includes('conference') || rawType.includes('symposium')) {
                venueType = 'Conference';
            } else if (rawType.includes('article') || rawType.includes('journal')) {
                venueType = 'Journal';
            } else if (rawType.includes('theses') || rawType.includes('text')) {
                venueType = 'Thesis';
            }

            
            return {
                id: paper.id,
                title: paper.display_name,
                year: paper.publication_year,
                doi: paper.primary_location?.landing_page_url || paper.best_oa_location?.landing_page_url || "",
                venue: venue,
                type: venueType,
                authors: paper.authorships.map((authorship: any) => ({
                    name: authorship.author.display_name,
                    isMe: authorship.author.display_name.includes("Léa Brunschwig")
                }))
            };
        });

        const outputPath = resolve('./src/data/publications.json');
        writeFileSync(outputPath, JSON.stringify(mappedPapers, null, 2));
        console.log(`Publications data saved to ${outputPath}`);
    } catch (error) {
        console.error("Error fetching publications:", error);
    }
}

// Run the fetch function to get publications and save them to a JSON file
fetchPublications();