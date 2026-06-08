import { DirectFileManipulator } from './livesync-commonlib/src/API/DirectFileManipulator.ts';

const dfm = new DirectFileManipulator({
    database: 'obsidian-radiology',
    url: 'https://couchdb.home.kimyoung.uk',
    username: 'woooook',
    password: 'KzLPlsrHDY0vFG',
    passphrase: '',
    obfuscatePassphrase: '',
});

const id = await dfm.path2id('sync test.md');
console.log('Computed path2id:', id);
console.log('Expected DB ID:   f:912be0cba6e511e3dfa07c3062fa5b1d20357a9d6746540c08acf0aa81da645a');
await dfm.close();
