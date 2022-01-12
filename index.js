const express = require("express")
const {getPage} = require('./lib/notion')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static("public"))

app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})

app.get("/name/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties.Name.title[0].plain_text)
})

app.listen(PORT, console.log(`server started on ${PORT}`))
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc