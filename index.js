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

app.get("/sessions/:session/:slug", async (req, res) => {
  console.log(req.params)
  const pageId = classList[req.params.session][req.params.slug]
  const pageInfo = await getPage(pageId)
  console.log(pageInfo.properties)
  res.render("template-class-concurrent", pageInfo.properties)
})
app.get("/sessions/:session/:slug/test", async (req, res) => {
  console.log(req.params)
  const pageId = classList[req.params.session][req.params.slug]
  const pageInfo = await getPage(pageId)
  console.log(pageInfo.properties)
  res.render("test", pageInfo.properties)
})
app.get("/sessions/:session", async (req, res) => {
  console.log(req.params)
  
  const session = await getPage(classList.sessions[req.params.session])
  const sessionInfo = session.properties
  let response={
    title: sessionInfo.Name.title[0].plain_text,
    description: sessionInfo.Description.rich_text[0]?.plain_text,
    organizers: parseRollup(sessionInfo["Organizer Names"]),
    teachers: parseRollup(sessionInfo["Teacher Names"]),
    startDate: sessionInfo["Dates"]?.date.start,
    endDate: sessionInfo["Dates"]?.date.end,
    location: sessionInfo.Location?.multi_select[0]?.name,
    classes: []
  }
  const classes = classList[req.params.session]

  for(let key in classes){
    const pageId = classes[key]
    const classData = await getPage(pageId)
    const classInfo = classData.properties
    response.classes.push({
      name: classInfo.Name.title[0].plain_text,
      teachers: parseRollup(classInfo["Teacher Names"]),
      promoImage: classInfo["Promo Image"]?.files[0].file.url,
      startDate: classInfo["Date"]?.date.start,
      endDate: classInfo["Date"]?.date.end,
      applicationEndDate: classInfo["Application End Date"]?.date.start
    })

  }
  console.log(response)
  res.render("session", response)
})
app.listen(PORT, console.log(`server started on ${PORT}`))


function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  let data = [];
  for(let i = 0; i<rollupArray.length; i++){
    data.push(rollupArray[i].title[0].plain_text)
  } 
  return data
}
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc