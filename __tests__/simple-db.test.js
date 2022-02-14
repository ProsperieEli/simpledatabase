const fs = require('fs/promises');
const path = require('path');
const SimpleDb = require('../lib/simple-db');

const { CI, HOME } = process.env;
const BASE_DIR = CI ? HOME : __dirname;
const TEST_DIR = path.join(BASE_DIR, 'test-dir');

describe('simple database', () => {
  beforeEach(async () => {
    await fs.rm(TEST_DIR, { force: true, recursive: true });
    await fs.mkdir(TEST_DIR, { recursive: true });
  });

  it('should save to an object id', async () => {
    const saving = new SimpleDb(TEST_DIR);
    const file = { hello: 'world' };
    await saving.save(file);
    const saveFile = await saving.getById(file.id);
    expect(saveFile).toEqual(file);
  });

  it('get all', () => {
    const saving = new SimpleDb(TEST_DIR);
    const file1 = { hello: 'world' };
    const file2 = { goodbye: 'world' };

    return saving
      .save(file1)
      .then(() => saving.save(file2))
      .then(() => saving.getAll())
      .then((files) => expect(files).toEqual([file1, file2]));
  });

  it('get by ID', async () => {
    const saving = new SimpleDb(TEST_DIR);
    const file = { hello: 'hii', id: '2' };
    const srcPath = path.join(TEST_DIR, `${file.id}.json`);
    await fs.writeFile(srcPath, JSON.stringify(file));
    const saveFile = await saving.getById(file.id);
    expect(saveFile).toEqual(file);
  });
});
