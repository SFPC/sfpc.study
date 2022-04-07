const dotenv = require("dotenv").config()
const {Client} = require('@notionhq/client')

const notion = new Client({
  auth:process.env.NOTION_TOKEN
})

exports.getDatabaseEntries = async (databaseId, sorts=[], filter={}) => {
  let query = {database_id: databaseId}
  if(sorts.length !== 0) query.sorts = sorts;
  if(Object.keys(filter).length !== 0) query.filter = filter;
  console.log(query)
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
exports.getPage = async (pageId) => {
  console.log("Get Page Function", pageId)
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

exports.getBlocks = async (blockId) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  return response.results;
};

