const express = require("express")
const {getPage} = require('./lib/notion')
const classList = require("./lib/classNotionPageList")
const app = express()
const PORT = process.env.PORT || 3000

console.log("starting up")
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

app.get("/sessions/spring-22/:slug", async (req, res) => {
  console.log(req.params)
  try {
    const pageId = classList["spring-22"][req.params.slug]
    const classData = await getPage(pageId)
    const response = parseClassData(classData)
    res.render(`spring-22/${req.params.slug}`, response)
  } catch (err) {
    console.error(err)
  }

})

app.get("/sessions/:session/:slug", async (req, res) => {
  console.log(req.params)
  const pageId = classList[req.params.session][req.params.slug]
  const classData = await getPage(pageId)
  const response = parseClassData(classData)
  res.render("template-class-concurrent", response)
})
app.get("/sessions/:session/:slug/test", async (req, res) => {
  const pageId = classList[req.params.session][req.params.slug]
  const pageInfo = await getPage(pageId)
  console.log(pageInfo.properties)
  res.render("template-class-concurrent", pageInfo.properties)
})
app.get("/sessions/:session", async (req, res) => {

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
    response.classes.push(parseClassData(classData))
  }
  console.log(response)
  res.render("session", response)
})
app.listen(PORT, console.log(`server started on ${PORT}`))

function parseClassData(apiResponse){
  const classInfo = apiResponse.properties;
  console.log(classInfo)
  //this is the data that will be passes to the class template
  return {
    name: classInfo.Name.title[0].plain_text,
    teachers: parseTeachers(classInfo),
    promoImage: classInfo["Promo Image"]?.files[0]?.file?.url,
    promoImages: promoImgs(classInfo),
    startDate: classInfo["Date"]?.date?.start,
    endDate: classInfo["Date"]?.date?.end,
    numberOfClasses: classInfo["Number of Classes"].number,
    time: classInfo["Time"].rich_text[0]?.plain_text,
    location: classInfo["Location"]?.select?.name,
    cost: classInfo["Cost"]?.number,
    applicationEndDate: classInfo["Application End Date"]?.date?.start,
    applicationLink: classInfo["Application URL"]?.url,
    description: classInfo["Short Description"]?.rich_text[0]?.plain_text,
    active: classInfo["Active"]?.formula.boolean,
    url: classInfo["Webpage URL"]?.url,
    session: parseRollup(classInfo["Session Name"])[0]?.plain_text
    notifyDate: parseRollup(classInfo["Notification Date"])[0]?.date?.start

  }
}
function parseTeachers(classInfo){
  const teacherNames = parseRollup(classInfo["Teacher Names"])
  const teacherBios = parseRollup(classInfo["Teacher Bios"])
  const teacherPhotos = parseRollup(classInfo["Teacher Photos"])
  console.log(teacherPhotos)
  const teacherWebsites = parseRollup(classInfo["Teacher Websites"])
  const teacherTwitters = parseRollup(classInfo["Teacher Twitters"])
  const teacherInstas = parseRollup(classInfo["Teacher Instagrams"])
  const teacherPronouns = parseRollup(classInfo["Teacher Pronouns"])
  const teachers = [];
  for(let i = 0; i < teacherNames.length; i++){
    teachers.push({
      name: teacherNames[i],
      bio: teacherBios[i],
      image: teacherPhotos[i]?.files[i]?.file?.url,
      website: teacherWebsites[i],
      twitter: teacherTwitters[i],
      instagram: teacherInstas[i],
      pronouns: teacherPronouns[i],
    })
  }
  console.log(teachers)
  return teachers;
}


function promoImgs(classInfo){
  const allImgs = classInfo["Promo Image"]?.files
  const imgs = [];
  for(let i = 0; i < 1; i++){
    imgs.push({
      image: classInfo["Promo Image"]?.files[i]?.file?.url
    })
  }
  console.log(imgs)
  return imgs;
}


function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  let data = [];
  for(let i = 0; i<rollupArray.length; i++){
    if(rollupArray[i].title)
      data.push(rollupArray[i]?.title[0]?.plain_text)
    else if (rollupArray[i].rich_text)
      data.push(rollupArray[i]?.rich_text[0]?.plain_text)
    else if (rollupArray[i].url)
      data.push(rollupArray[i].url)
    else if (rollupArray[i].files)
      data.push(rollupArray[i].files[0]?.url)
  }
  return data
}
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc
