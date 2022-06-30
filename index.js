const express = require("express")
const hbs = require("hbs")
const helpers = require('handlebars-helpers')();
const {getPage, getDatabaseEntries, getDatabaseEntry, getBlocks} = require('./lib/notion')
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
for (let helper in helpers) {
  hbs.registerHelper(helper, helpers[helper]);
}
app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})


app.get("/pageContent/:id", async (req, res) => {
  const response = await getBlocks(req.params.id);
  res.json(response);
})

app.get("/participate/spring-22", async (req, res) => {
  // TODO: load session page
  res.render("spring-22/session")

})


app.get("/sessions/spring-22", (req,res) => {
  res.render("spring-22/session")
})



app.get("/participate/summer-22", async (req, res) => {
  // TODO: load session page
  res.render("summer-22/session")

})


//
// app.get("/sex-ed", (req,res) => {
//   res.render("sex-ed/ask-sfpc-sex-ed")
// })




// app.get("/sessions/summer-22", (req,res) => {
//   res.render("summer-22/session")
// })

// app.get("/sessions/sex-ed", (req,res) => {
//   res.render("get-notified-sexed")
// })
// app.get("/sex-ed", (req,res) => {
//   res.render("sex-ed/advice-column")
// })
// app.get("/sex-ed/:slug", (req,res) => {
//   res.render("sex-ed/"+req.params.slug)
// })

// app.get("/sex-ed-about", (req,res) => {
//   res.render("sex-ed/about")
// })


app.get("/sex-ed", async (req,res) => {
  const response = await getDatabaseEntries("eedc3ea6ba904a9fa8631e12b03a955d", [{property:"Publish-Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseNotionPage(project)
  })
  console.log(projectData)
  // let pageContent = getPageContent()
  res.render("sex-ed/ask-sfpc-sex-ed", {projects: projectData})
})

// app.get("/sex-ed/:slug", async (req,res) => {
//   //filter by slug here
//   console.log(req.params.slug)
//   const response = await getDatabaseEntry("eedc3ea6ba904a9fa8631e12b03a955d", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
//   console.log(response)
//   if(response){
//     const projectData = parseNotionPage(response)
//     console.log(projectData)
//     res.render("projectPage", projectData)
//   }
// })

// app.get("/sex-ed/:slug", (req,res) => {
//   res.render("sex-ed/"+req.params.slug)
// })

app.get("/sex-ed-about", async (req,res) => {
  res.render("sex-ed/about")
})

app.get("/sex-ed-people", async (req,res) => {
  res.render("sex-ed/people")
})





app.get("/sex-ed/:slug", async (req,res) => {
  //filter by slug here
  console.log(req.params.slug)
  const response = await getDatabaseEntry("eedc3ea6ba904a9fa8631e12b03a955d", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  console.log(response)
  if(response){
    const projectData = parseNotionPage(response)
    console.log(response.id)
    const responses = await getPageContent(response.id, "published responses")
    projectData.responses = responses
    console.log(projectData)
    res.render("sex-ed/question", projectData)
  }
})





// app.get("/sex-ed/:slug", async (req,res) => {
//   console.log(req.params.slug)
//   const response = await getDatabaseEntry("eedc3ea6ba904a9fa8631e12b03a955d", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
//   console.log(response)
//
//   const projectData = response.map((project) => {
//     console.log(project)
//     return parseNotionPage(project)
//   })
//
//   if(response){
//     const projectData = parseNotionPage(response)
//     console.log(projectData)
//     res.render("sex-ed/question", projectData)
//   }
//
// })
//

// app.get("/sex-ed/:slug", async (req,res) => {
//   console.log(req.params.slug)
//   const response = await getDatabaseEntry("eedc3ea6ba904a9fa8631e12b03a955d", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
//   console.log(response)
//   if(response){
//     const projectData = parseNotionPage(response)
//     console.log(projectData)
//     res.render("sex-ed/question", projectData)
//   }
// })





// app.get("/sessions/networked-performance", (req,res) => {
//   res.render("networked-performance/session")
// })



app.get("/sessions/:slug", async (req, res) => {
  const sessionData = await getDatabaseEntry("51d48d4644b2439cb64c2018ad05d2b1", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  const sessionType = sessionData.properties['Session Type']?.multi_select[0]?.name
  console.log(sessionType)
  if(sessionType == "Special"){
    const classData = await getDatabaseEntry("57406c3b209e4bfba3953de6328086ac", {"and":[{property:"Website-Slug", "rich_text": {"equals":req.params.slug}}, {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": req.params.slug } }}}]})
    if(!classData) return
    const response = await prepareClassData(classData, req.params.slug)
    console.log(response)
    res.render(req.params.slug+"/session", response)
    // res.render("class-concurrent", response);
  }
  else if(sessionType == "Intensive"){

  }
  else if(sessionType == "Concurrent"){
    const response = await prepareSessionData(sessionData, req.params.slug)
    console.log("Concurrent Session data", response)
    res.render(req.params.slug+"/session", response)
  }

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
app.get("/sessions/:session/:class", async(req,res) => {
  const data = await getDatabaseEntry("57406c3b209e4bfba3953de6328086ac", {"and":[{property:"Website-Slug", "rich_text": {"equals":req.params.class}}, {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}}]})
  if(!data) return
  const response = await prepareClassData(data, req.params.class)
  res.render("class-concurrent", response);

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
  const response = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [{timestamp:"created_time", direction:"descending"}], {
    "or":[
      {property:"Roles", "multi_select": {"contains":"Participant"}},
      {property:"Roles", "multi_select": {"contains":"Organizer"}},
      {property:"Roles", "multi_select": {"contains":"Teacher"}},
      {property:"Roles", "multi_select": {"contains":"Guest Teacher"}},
      {property:"Roles", "multi_select": {"contains":"Accountability Steward"}},
      {property:"Roles", "multi_select": {"contains":"Co-Director"}}
    ]})
  const peopleData = response.map((person) => {
    console.log(person)
    return parseNotionPage(person)
  })
  console.log(peopleData)
  res.render("people", {people: peopleData})
})

app.get("/people/:session", async (req,res) => {
  const response = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [], {
    "or":[
      {property:"Sessions-Organizer", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}},
      {property:"Sessions-Teacher", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}},
      {property:"Sessions-Participant", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}},
      {property:"Sessions-Guest", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}}
    ]
  })
  const peopleData = response.map((person) => {
    return parseNotionPage(person)
  })
  const sessionInfo =  await getDatabaseEntry("ce519f031eb340f58e3693cf4e041a67", {property:"Website-Slug", "rich_text": {"equals":req.params.session}})
  const classesInfo = parseNotionData(sessionInfo.properties["Website-Classes"])
  res.render("peopleSession", {people: peopleData, classes:classesInfo})
})

app.listen(PORT, console.log(`server started on ${PORT}`))

//
// Rendering functions
//
async function prepareClassData(classData, classSlug){
  const fullPageContent = await getBlocks(classData.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  let response = parseClassData(classData)
  response.pageContent =  parsePageContent(webContent);
  const people = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [], {
    "or":[
      {property:"Classes-Teacher", "rollup": { "any": { "rich_text": { "equals": classSlug } }}},
      {property:"Classes-Guest", "rollup": { "any": { "rich_text": { "equals": classSlug } }}},
      {property:"Classes-Organizer", "rollup": { "any": { "rich_text": { "equals": classSlug } }}}
    ]
  })
  let organizers = []
  let teachers = []
  let guests = []
  people.map((person) => {
    const personData = parseNotionPage(person)
    if(typeof personData["Classes-Teacher"]  == 'string') personData["Classes-Teacher"] = [personData["Classes-Teacher"]]
    if(personData["Classes-Teacher"] && personData["Classes-Teacher"].includes(classSlug)){
      if(personData["Classes-Organizer"] && personData["Classes-Organizer"].includes(classSlug))
        personData.role = "organizer and teacher"
      else
        personData.role = "teacher"
      teachers.unshift(personData)
    }
    else if(personData["Classes-Guest"] && personData["Classes-Guest"].includes(classSlug)){
      personData.role = "guest teacher"
      guests.unshift(personData)
    }
    else if(personData["Classes-Organizer"] && personData["Classes-Organizer"].includes(classSlug)){
      personData.role = "organizer"
      organizers.unshift(personData)
    }
  })
  //list main teacher first
  const foundIdx = teachers.findIndex(el => el.Name == response['Teacher Names'][0])
  const foundItem = teachers[foundIdx]
  teachers.splice(foundIdx, 1)
  teachers.unshift(foundItem)
  response.guests = cleanPersonData(guests);
  response.teachers = cleanPersonData(teachers);
  response.organizers = cleanPersonData(organizers);
  return response
}

async function prepareSessionData(sessionData, session){
  let response = parseNotionPage(sessionData)
  const classData = await getDatabaseEntries("57406c3b209e4bfba3953de6328086ac", [], {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": session } }}})
  response.classes = parseNotionPageArray(classData);
  const people = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [], {
  "or":[
    {property:"Sessions-Organizer", "rollup": { "any": { "rich_text": { "equals": session } }}},
    {property:"Sessions-Teacher", "rollup": { "any": { "rich_text": { "equals": session } }}},
    {property:"Sessions-Guest", "rollup": { "any": { "rich_text": { "equals": session } }}},
  ]
  })
  let teachers = []
  let organizers = []
  let guests = []
  people.map((person) => {
    const personData = parseNotionPage(person)
    if(typeof personData["Sessions-Teacher"]  == 'string') personData["Sessions-Teacher"] = [personData["Sessions-Teacher"]]
    if(personData["Sessions-Teacher"] && personData["Sessions-Teacher"].includes(session)){
      personData.role = "teacher"
      teachers.unshift(personData)
    }
    else if(personData["Sessions-Organizer"] && personData["Sessions-Organizer"].includes(session)){
      personData.role = "organizer"
      organizers.unshift(personData)
    }
    else if(personData["Sessions-Guest"] && personData["Sessions-Guest"].includes(session)){
      personData.role = "guest teacher"
      guests.unshift(personData)
    }
  })
  response.guests = cleanPersonData(guests);
  response.organizers = cleanPersonData(organizers);
  response.teachers = cleanPersonData(teachers);
  return response
}
async function getPageContent(notionId, contentToggleName="web content"){
  const fullPageContent = await getBlocks(notionId);
  console.log(contentToggleName)
  console.log(contentToggleName.toLowerCase())
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase().trim() == contentToggleName.toLowerCase().trim())?.id
  console.log(contentBlockId)
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  console.log(webContent)
  return parsePageContent(webContent);
}
  //
// Notion Parsing Functions Below
//

function parseClassData(apiResponse){
  const classInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);
  //this is the data that will be passes to the class template

  returnObj.name=classInfo.Name.title[0].plain_text,
  returnObj.teachers=parseTeachers(classInfo),
  returnObj.promoImage=parseNotionData(classInfo["Promo Image"])?.[0],
  returnObj.bannerImage=parseNotionData(classInfo["Banner Image"])?.[0],
  returnObj.promoImages=parseNotionData(classInfo["Promo Image"]),
  returnObj.startDate=prettyDateString(classInfo["Date"]?.date?.start),
  returnObj.endDate=prettyDateString(classInfo["Date"]?.date?.end),
  returnObj.numberOfClasses=classInfo["Number of Classes"].number,
  returnObj.time=classInfo["Time"].rich_text[0]?.plain_text,
  returnObj.location=classInfo["Location"]?.select?.name,
  returnObj.cost=classInfo["Cost"]?.number,
  returnObj.applicationEndDate=prettyDateString(classInfo["Application End Date"]?.date?.start),
  returnObj.applicationsOpen = new Date() <= new Date(returnObj?.applicationEndDate)
  returnObj.applicationLink=classInfo["Application URL"]?.url,
  returnObj.description=classInfo["Short Description"]?.rich_text[0]?.plain_text,
  returnObj.active=classInfo["Active"]?.formula.boolean,
  returnObj.url=classInfo["Webpage URL"]?.url,
  returnObj.session=parseRollup(classInfo["Session Name"])[0]?.plain_text,
  returnObj.notifyDate=prettyDateString(classInfo["Notification Date"]?.date?.start)
  return returnObj
}
function parseTeachers(classInfo){
  const teacherNames = parseRollup(classInfo["Teacher Names"])
  const teacherBios = parseRollup(classInfo["Teacher Bios"])
  const teacherPhotos = parseRollup(classInfo["Teacher Photos"])
  const teacherWebsites = parseRollup(classInfo["Teacher Websites"])
  const teacherTwitters = parseRollup(classInfo["Teacher Twitters"])
  const teacherInstas = parseRollup(classInfo["Teacher Instagrams"])
  const teacherPronouns = parseRollup(classInfo["Teacher Pronouns"])
  const teachers = [];
  for(let i = 0; i < teacherNames.length; i++){
    teachers.push({
      name: teacherNames[i],
      bio: teacherBios[i],
      image: teacherPhotos[i],
      website: teacherWebsites[i] && teacherWebsites[i].indexOf("http") > 0 ? teacherWebsites[i] : "http://"+teacherWebsites[i],
      twitter: teacherTwitters[i] && teacherTwitters[i][0] == "@" ? teacherTwitters[i].slice(1) : teacherTwitters[i],
      instagram: teacherInstas[i] && teacherInstas[i][0] == "@" ? teacherInstas[i].slice(1) : teacherInstas[i],
      pronouns: teacherPronouns[i],
    })
  }
  // console.log(teachers)
  return teachers;
}

function cleanPersonData(personArray){
  for(let i = 0; i < personArray.length; i++){
    personArray[i].Website = personArray[i].Website && personArray[i].Website.indexOf("http") < 0 ?  "http://"+personArray[i].Website : personArray[i].Website
    personArray[i].Twitter = personArray[i].Twitter && personArray[i].Twitter[0] == "@" ? personArray[i].Twitter.slice(1) : personArray[i].Twitter
    personArray[i].Instagram = personArray[i].Instagram && personArray[i].Instagram[0] == "@" ? personArray[i].Instagram.slice(1) : personArray[i].Instagram
  }
  return personArray
}

function prettyDateString(uglyDateString){
  if(!uglyDateString) return null
  let parts = uglyDateString.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]).toLocaleDateString("en-us", {month:'long', day:'numeric', year:'numeric'})
}
function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  if(rollupArray.length > 0){
    return parseArray(rollupArray)
  }
  else if(rollupArray[0])
    return parseNotionData(rollupArray[0])
  else
    return null
}
function parseArray(arr){
  let data = [];
  for(let i = 0; i<arr.length; i++){
    data.push(parseNotionData(arr[i]))
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
function parseNotionPageArray(pageDataArray){
  return pageDataArray.map(item => parseNotionPage(item))
}

function parseNotionData(dataObj){
  if(dataObj.title){
    if(dataObj.title.length > 1){
      let returnData = []
      for(let i = 0; i < dataObj.title.length; i++){
        returnData.push(dataObj.title[i]?.plain_text)
      }
      return returnData
    } else
      return dataObj?.title[0]?.plain_text
  }
  else if (dataObj.rich_text){
    if(dataObj.rich_text.length > 1){
      let returnData = []
      for(let i = 0; i < dataObj.rich_text.length; i++){
        returnData.push(dataObj.rich_text[i]?.plain_text)
      }
      return returnData
    } else
      return dataObj?.rich_text[0]?.plain_text
  }
  else if (dataObj.url)
    return dataObj.url
  else if (dataObj.files){
    if(dataObj?.files?.length >= 1) {
      let imageUrls = [];
      for(let i = 0; i < dataObj.files.length; i++){
        imageUrls.push(dataObj.files[i].file ? dataObj.files[i]?.file?.url : dataObj.files[i]?.external?.url)
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
function parsePageContent(data) {
  let pageContent = {}
  for (let i = 0; i < data.length; i++) {
    parseBlock(data[i], pageContent)
  }
  return pageContent
}

function parseBlock(block, contentObj) {
  const lastEntry = Object.keys(contentObj).pop();
  if (!lastEntry && block.type !== 'heading_2') return
  switch (block.type) {
    case 'heading_2':
      // For a heading
      contentObj[block['heading_2'].text[0].plain_text] = "";
      break;
    case 'image':
      // For an image
      if(block['image']?.external?.url)
        contentObj[lastEntry] += `<img src=${block['image'].external.url} />`
      else if(block['image']?.file?.url)
        contentObj[lastEntry] += `<img src=${block['image'].file.url} />`
      break;
    case 'bulleted_list_item':
      // For an unordered list
      let bulletText = formatRichText(block['bulleted_list_item'].text)

      contentObj[lastEntry] += `<ul><li>${bulletText}</li></ul >`
      break;
    case 'paragraph':
      // For a paragraph
      let pText = formatRichText(block['paragraph'].text)
      contentObj[lastEntry] += `<p>${pText}</p>`
      break;
    default:
      // For an extra type
      return
  }
}
function formatRichText(textArray) {
  if(textArray.length == 0) return ""
  let formattedText = ""
  for (let i = 0; i < textArray.length; i++) {
    let tempText = textArray[i].plain_text
    if (textArray[i].annotations.bold)
      tempText = `<b>${tempText}</b>`
    if (textArray[i].annotations.italic)
      tempText = `<em>${tempText}</em>`
    formattedText += tempText
  }
  return formattedText
}
