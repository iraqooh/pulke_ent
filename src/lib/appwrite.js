import { Query } from '@tanstack/react-query';
import { Client, Account, Databases, TablesDB, ID } from 'appwrite';

export const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const tablesDB = new TablesDB(client)
export const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
export const LINKS_COLLECTION = 'download-links';
export const SUGGESTIONS_COLLECTION = 'link_suggestions';
export { ID }

export async function getLinks(imdbId) {
    const res = await tablesDB.listRows({
      databaseId:DB_ID,
      tableId: LINKS_COLLECTION,
      queries: [Query.equal('imdbId', imdbId)]
    })
    return res.rows.filter(row => row.imdbId === imdbId);
}