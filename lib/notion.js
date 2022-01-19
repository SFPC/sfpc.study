const dotenv = require("dotenv").config()
const {Client} = require('@notionhq/client')

const notion = new Client({
  auth:process.env.NOTION_TOKEN
})

exports.listDatabases = async () => {
  const res = await notion.databases.list()
  console.log(res)
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

