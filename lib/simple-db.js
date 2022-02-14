const { writeFile, readFile, readdir } = require('fs/promises');
const path = require('path');
const shortid = require('shortid');

class SimpleDb {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  save(obj) {
    const id = shortid.generate();
    obj['id'] = id;
    const objid = JSON.stringify(obj);
    return writeFile(path.join(this.rootDir, `${id}.JSON`), objid);
  }

  getById(id) {
    return readFile(path.join(this.rootDir, `${id}.JSON`), 'utf8')
      .then((objContents) => JSON.parse(objContents))
      .catch((error) => {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      });
  }

  async getAll() {
    const getTotals = await readdir(this.rootDir);

    const fullList = await Promise.all(
      getTotals.map((total) => {
        return readFile(`${this.rootDir}/${total}`, 'utf8')
          .then((objContents) => JSON.parse(objContents))
          .catch((error) => {
            if (error.code === 'ENOENT') {
              return null;
            }
            throw error;
          });
      })
    );
    return fullList;
  }
}

module.exports = SimpleDb;
