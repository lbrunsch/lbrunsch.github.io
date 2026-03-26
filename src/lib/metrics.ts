// src/lib/openalex.ts
// Functions to fetch academic profile and publications from OpenAlex API for my profile, using the OpenAlex ID and email for contact. The data is structured according to the MetricsPerso and Paper types defined in src/types/openalex.ts.

import type { MetricsPerso, Paper, ScopusMetrics, ScopusPublication } from "@/types/metrics";

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

    // Fetch author's publications
    const papersResponse = await fetch(`https://api.openalex.org/works?filter=author.id:${MY_ID}&sort=publication_year:desc&mailto=${EMAIL}`);
    const papersData = await papersResponse.json();
    const papers : Paper = papersData.results;

    return {
        metrics: {
            hIndex: authorData.summary_stats.h_index,
            i10Index: authorData.summary_stats.i10_index,
            nbPapers: authorData.works_count,
            nbCitations: authorData.cited_by_count,
            yearlyStats: authorData.counts_by_year
        },
        publications: papers
    };
}