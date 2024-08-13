# WW2

Vite and REACT app

```
npm install
npm run dev
```

This Github repository currently deploys automatically to netlify on every push to the master branch or whenever a new branch is created.

## Create and deploy static api resources

The `./scripts/prefetch.js` script in this repo collects resources from the [Miller API](https://github.com/C2DH/miller) in JSON format and stores them in the `./public/api` folder.
The script requests the API using the list of urls specified in `./scripts/urls.json`.

This is the format of the `urls.json` file:

```json
[
  {
    "url": "/api/story?filters={%22tags__slug%22:%22theme%22}",
    "description": "Get all stories with the tag 'theme'"
  },
  {
    "url": "/api/story?filters={%22tags__slug%22:%22level-1%22}",
    "description": "Get all stories with the tag 'level-1'"
  },
  {
    "url": "/api/story?filters={%22mentioned_to__slug%22:%22theme-02-reagir-a-lannexion%22}",
    "description": "Get all stories that mention the story with the slug 'theme-02-reagir-a-lannexion'"
  },
  {
    "url": "/api/story/theme-01-vivre-sous-lannexion",
    "description": "Get the story with the slug 'theme-01-vivre-sous-lannexion'"
  },
  {
    "url": "/api/story/theme-02-reagir-a-lannexion",
    "description": "Get the story with the slug 'theme-02-reagir-a-lannexion'"
  },
  {
    "url": "/api/story/note-01-entering-the-war",
    "description": "Get the story with the slug 'note-01-entering-the-war'"
  },
  {
    "url": "/api/story/note-02-la-formation-dun-consensus-memoriel",
    "description": "Get the story with the slug 'note-02-la-formation-dun-consensus-memoriel'"
  }
]
```

To run the script, you need to have **nodejs** installed v 22. Then, run:

```bash
cd ./scripts
npm installl
WW2_API_HOST=http://YOUR-MILLER_HOST npm run dev
```

This will fill the `./public/api` folder and the debugging will provide you with some guidance.
That is, commit your files and wait the publication process to be done, all files inside the public folder will be available through netlify

## Example of content

Level 1
in the forst level, namely "Journeys", you have a series of places (document of type place) geo-located on a map.
To be visible on "Journeys" level, each place must be attached to a story tagged with `level-1`. This api call will give you all the places attached to stories tagged with level-1:

```
GET /api/document/?filters={%22stories__tags__slug%22:%22level-1%22}&limit=100
```

Each document of type "place" has ageoJson in the coordinates property.
+---------------------------------------------+
|                "The St Joseph Clinic"       |
|---------------------------------------------|
| Tags: level-01                              |
| Cover: Video                                |
|---------------------------------------------|
| Geographical Place:                         |
|     St Joseph Klinic, Wilz, Luxembourg            |
|---------------------------------------------|
| Linked Stories:                             |
|     - Note 01                               |
|     - Note 02                               |
+---------------------------------------------+
