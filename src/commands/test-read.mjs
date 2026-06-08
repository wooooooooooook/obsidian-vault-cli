import { createDFM, listFiles } from '../lib/connection.ts';

async function main() {
    const dfm = await createDFM(true);
    try {
        const files = await listFiles(dfm);
        const syncFile = files.find(f => f.path.includes('sync test') || f.path.includes('sync-test'));
        if (!syncFile) {
            console.error('File not found in list');
            return;
        }
        console.error('Found in list:', JSON.stringify(syncFile));

        // Try get() by path
        const doc = await dfm.get(syncFile.path);
        console.error('get() result:', doc ? 'found' : 'null');

        // Try getById()
        const docById = await dfm.getById(syncFile.id);
        console.error('getById() result:', docById ? JSON.stringify({path: docById.path, hasData: 'data' in docById, dataType: docById.data ? docById.data.constructor.name : 'N/A'}) : 'null');

        if (docById && 'data' in docById) {
            const content = Array.isArray(docById.data) ? docById.data.join('') : docById.data;
            process.stdout.write(content);
        } else {
            console.error('No data in docById');
        }
    } finally {
        await dfm.close();
    }
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });