import { Client, Databases, Query, ID } from "appwrite"

const database_Id = import.meta.env.VITE_APPWRITE_DATABASE_ID
const collection_Id = import.meta.env.VITE_APPWIRTE_COLLECTION_ID 
const project_Id = import.meta.env.VITE_APPWRITE_PROJECT_ID

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(project_Id )

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie ) => {
    
    try {
        const result = await database.listDocuments(database_Id, collection_Id, [
            Query.equal('searchTerm', searchTerm)
        ])

        if(result.documents.length > 0) {
            const doc = result.documents[0]

            await database.updateDocument(database_Id, collection_Id, doc.$id, {
                count: doc.count + 1
            })
        } else {
             await database.createDocument(database_Id, collection_Id, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
             })
        }

    } catch (error) {
        console.log(error)
    }
}