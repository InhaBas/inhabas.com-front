export interface changesInterface {
    year: number | null;
    contents: {
        date: string;
        content: string;
    }[];
}