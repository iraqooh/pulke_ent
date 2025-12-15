import { Query } from '@tanstack/react-query';
import { Client, Account, Databases, ID } from 'appwrite';

export const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
export const LINKS_COLLECTION = 'download-links';
export const SUGGESTIONS_COLLECTION = 'link_suggestions';
export { ID };

export async function getLinks(imdbId) {
    const res = await databases.listDocuments(
        DB_ID,
        LINKS_COLLECTION,
        [Query.equal('imdbId', imdbId)]
    )
    return res.documents.filter(doc => doc.imdbId === imdbId);
}