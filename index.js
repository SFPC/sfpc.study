const express = require("express")
const hbs = require("hbs")
const {getPage, getDatabaseEntries, getDatabaseEntry} = require('./lib/notion')
const classList = require("./lib/classNotionPageList")
const res = require("express/lib/response")
const { response } = require("express")
const app = express()
const PORT = process.env.PORT || 3000

console.log("starting up")
app.use(express.static("public"))
app.set('views', './public/templates')
app.set('view engine', 'hbs');
hbs.registerPartials("./public/templates/partials")
app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})

app.get("/name/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties.Name.title[0].plain_text)
})
app.get("/participate/spring-22", async (req, res) => {
  // TODO: load session page
  res.render("session")

})
app.get("/sessions/spring-22", (req,res) => {
  res.render("session")
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
app.get("/projects", async (req,res) => {
  const response = await getDatabaseEntries("713f24806a524c5e892971e4fbf5c9dd", [{property:"Release Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseNotionPage(project)
  })
  console.log(projectData)
  res.render("projectList", {projects: projectData})
})

app.get("/projects/:slug", async (req,res) => {
  //filter by slug here
  console.log(req.params.slug)
  const response = await getDatabaseEntry("713f24806a524c5e892971e4fbf5c9dd", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  console.log(response)
  if(response){
    const projectData = parseNotionPage(response)
    console.log(projectData)
    res.render("projectPage", projectData)
  }
})
app.get("/people", async (req,res) => {
  const response = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [{timestamp:"created_time", direction:"descending"}], {property:"Roles", "multi_select": {"contains":"Participant"}})
  const peopleData = response.map((person) => {
    console.log(person)
    return parseNotionPage(person)
  })
  console.log(peopleData)
  res.render("people", {people: peopleData})
})




// app.get("/sessions/:session/:slug", async (req, res) => {
//   console.log(req.params)
//   const pageId = classList[req.params.session][req.params.slug]
//   const classData = await getPage(pageId)
//   const response = parseClassData(classData)
//   res.render("class-concurrent", response)
// })
// app.get("/sessions/:session/:slug/test", async (req, res) => {
//   const pageId = classList[req.params.session][req.params.slug]
//   const pageInfo = await getPage(pageId)
//   console.log(pageInfo.properties)
//   res.render("class-concurrent", pageInfo.properties)
// })
// app.get("/sessions/:session", async (req, res) => {

//   const session = await getPage(classList.sessions[req.params.session])
//   const sessionInfo = session.properties
//   let response={
//     title: sessionInfo.Name.title[0].plain_text,
//     description: sessionInfo.Description.rich_text[0]?.plain_text,
//     organizers: parseRollup(sessionInfo["Organizer Names"]),
//     teachers: parseRollup(sessionInfo["Teacher Names"]),
//     startDate: sessionInfo["Dates"]?.date.start,
//     endDate: sessionInfo["Dates"]?.date.end,
//     location: sessionInfo.Location?.multi_select[0]?.name,
//     classes: []
//   }
//   const classes = classList[req.params.session]

//   for(let key in classes){
//     const pageId = classes[key]
//     const classData = await getPage(pageId)
//     response.classes.push(parseClassData(classData))
//   }
//   console.log(response)
//   res.render("session", {})
// })
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
    startDate: prettyDateString(classInfo["Date"]?.date?.start),
    endDate: prettyDateString(classInfo["Date"]?.date?.end),
    numberOfClasses: classInfo["Number of Classes"].number,
    time: classInfo["Time"].rich_text[0]?.plain_text,
    location: classInfo["Location"]?.select?.name,
    cost: classInfo["Cost"]?.number,
    applicationEndDate: prettyDateString(classInfo["Application End Date"]?.date?.start),
    applicationLink: classInfo["Application URL"]?.url,
    description: classInfo["Short Description"]?.rich_text[0]?.plain_text,
    active: classInfo["Active"]?.formula.boolean,
    url: classInfo["Webpage URL"]?.url,
    session: parseRollup(classInfo["Session Name"])[0]?.plain_text,
    notifyDate: prettyDateString(classInfo["Notification Date"]?.date?.start)

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

function prettyDateString(uglyDateString){
  if(!uglyDateString) return null
  let parts = uglyDateString.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]).toLocaleDateString("en-us", {month:'long', day:'numeric', year:'numeric'})
}
function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  let data = [];
  for(let i = 0; i<rollupArray.length; i++){
    data.push(parseNotionData(rollupArray[i]))
  }
  return data
}
function parseNotionPage(pageData){
  let data = pageData.properties
  let parsedData = {}
  for(let key in data){
    if(!data[key].relation) parsedData[key] = parseNotionData(data[key])
  }
  return parsedData

}

function parseNotionData(dataObj){
  if(dataObj.title)
    return dataObj?.title[0]?.plain_text
  else if (dataObj.rich_text)
    return dataObj?.rich_text[0]?.plain_text
  else if (dataObj.url)
    return dataObj.url
  else if (dataObj.files){
    if(dataObj?.files?.length >= 1) {
      let imageUrls = [];
      for(let i = 0; i < dataObj.files.length; i++){
        imageUrls.push(dataObj.files[i]?.file?.url)
      }
      return imageUrls
    }
    else return null
  }
  else if (dataObj.date)
    return {start: prettyDateString(dataObj.date.start), end: prettyDateString(dataObj.date.end)}
  else if (dataObj.multi_select){
    let ms = []
    for(let i = 0; i < dataObj.multi_select.length; i++){
      ms.push(dataObj.multi_select[i].name)
    }
    return ms
  }
  else if (dataObj.rollup)
    return parseRollup(dataObj)
  else
    return null
}
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc
