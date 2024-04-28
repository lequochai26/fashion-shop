I. **Setup project:**
1. Clone this project
2. In root directory, create `.env` file
3. Add this to created `.env` file:
```console
URL = mongodb://localhost:27017
DBNAME = FashionShop
```
4. Install project by running this command in command prompt located to project's directory: `npm install --force`
5. Run project by running this command in command prompt located to project's directory: `npm start`

II. **Initialize database:** (requires: MongoDB, MongoDBCompass)
1. Create database by running: `npm run builddb`
2. (for test) Use MongoDBCompass to import json files from data folder at project's root directory.
3. (for test) Copy 'assets' directory from '/data' to project's root directory (replace the current assets).