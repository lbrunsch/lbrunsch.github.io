// src/types/openalex.ts
// Types for OpenAlex API responses conforming to the data structure returned by the API for my profile and papers.
export interface MetricsPerso {
    display_name: string;
    works_count: number;
    cited_by_count: number;
    summary_stats: {
        h_index: number;
        i10_index: number;
    };
    counts_by_year: Array<{
        year: number;
        works_count: number;
        cited_by_count: number;
    }>;
}

export interface Paper {
    id: string;
    title: string;
    publicationYear: number;
    doi: string;
    authors: Array<{
        id: string;
        name: string;
    }>;
}
