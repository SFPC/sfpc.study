const express = require("express")
const {getPage} = require('./lib/notion')
const classList = require("./lib/classNotionPageList")
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static("public"))
app.set('views', './public/templates')
app.set('view engine', 'hbs');
app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})

app.get("/name/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties.Name.title[0].plain_text)
})
app.get("/participate/:session", async (req, res) => {
  // TODO: load session page
  
})

app.get("/participate/:session/:slug", async (req, res) => {
  console.log(req.params)
  const pageId = classList[req.params.session][req.params.slug]
  const pageInfo = await getPage(pageId)
  console.log(pageInfo.properties)
  res.render("template-class-concurrent", pageInfo.properties)
})
app.get("/participate/:session/:slug/test", async (req, res) => {
  console.log(req.params)
  const pageId = classList[req.params.session][req.params.slug]
  const pageInfo = await getPage(pageId)
  console.log(pageInfo.properties)
  res.render("test", pageInfo.properties)
})

app.listen(PORT, console.log(`server started on ${PORT}`))
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc