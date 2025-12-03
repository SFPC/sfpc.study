const dotenv = require("dotenv").config()
const {Client} = require('@notionhq/client')

const notion = new Client({
  auth:process.env.NOTION_TOKEN
})

exports.getDatabaseEntries = async (databaseId, sorts=[], filter={}) => {
  let query = {database_id: databaseId}
  if(sorts.length !== 0) query.sorts = sorts;
  if(Object.keys(filter).length !== 0) query.filter = filter;
  const response = await notion.databases.query(query);
  return response.results
}
exports.getDatabaseEntry = async (databaseId, filter) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter
  });
  return response.results[0]
}

exports.getLastEntry = async (databaseId, sorts=[], filter={}) => {
  let query = {database_id: databaseId, page_size: 1}
  // let size = {page_size: 1}
  if(sorts.length !== 0) query.sorts = sorts;
  if(Object.keys(filter).length !== 0) query.filter = filter;
  const response = await notion.databases.query(query);
  return response.results
}

exports.getPage = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

exports.getBlocks = async (blockId) => {
  let allBlocks = []
  let cursor = undefined;

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    allBlocks = allBlocks.concat(response.results);

    if (!response.has_more) {
      break; // No more pages
    }

    cursor = response.next_cursor;
  }


  return allBlocks;
};

exports.createPage = async (database_id, title, message="") => {
  const response = await notion.pages.create({

    "parent": {
          "type": "database_id",
          "database_id": database_id
    },
      "properties": {
          "Name": {
              "title": [
                  {
                      "text": {
                          "content": title,
                      }
                  }
              ]
          },
          "Message": {
              "rich_text": [
                  {
                      "text": {
                          "content": message,
                      }
                  }
              ]
          }
      }
  });
  return response;
}
