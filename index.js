const express = require("express")
const hbs = require("hbs")
const hbsHelpers = require('just-handlebars-helpers');
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
hbsHelpers.registerHelpers(hbs);
app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})


app.get("/pageContent/:id", async (req, res) => {
  const response = await getBlocks(req.params.id);
  console.log(response)
  res.json(response);
})

app.get("/participate/spring-22", async (req, res) => {
  // TODO: load session page
  res.render("session")

})

app.get("/classTest/:id", async (req, res) => {
  const fullPageContent = await getBlocks(req.params.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  const classData = await getPage(req.params.id)
  let response = parseClassData(classData)
  response.pageContent =  parsePageContent(webContent);
  console.log(response)
  res.render("class-concurrent", response);
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
app.get("/sessions/:session/:class", async(req,res) => {
  const classData = await getDatabaseEntry("57406c3b209e4bfba3953de6328086ac", {"and":[{property:"Website-Slug", "rich_text": {"equals":req.params.class}}, {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}}]})
  const fullPageContent = await getBlocks(classData.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  //const classData = await getPage(req.params.id)
  let response = parseClassData(classData)
  response.pageContent =  parsePageContent(webContent);
  console.log(response)
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
  console.log(classesInfo)
  res.render("peopleSession", {people: peopleData, classes:classesInfo})
})

app.listen(PORT, console.log(`server started on ${PORT}`))



// 
// Notion Parsing Functions Below 
// 

function parseClassData(apiResponse){
  const classInfo = apiResponse.properties;
  console.log("promo image", classInfo["Promo Image"])
  // console.log(classInfo)
  //this is the data that will be passes to the class template
  return {
    name: classInfo.Name.title[0].plain_text,
    teachers: parseTeachers(classInfo),
    promoImage: parseNotionData(classInfo["Promo Image"])[0],
    promoImages: parseNotionData(classInfo["Promo Image"]),
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
  console.log("Teacher Photos", )
  console.log(classInfo["Teacher Photos"].rollup.array[0].files)
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
      website: teacherWebsites[i],
      twitter: teacherTwitters[i],
      instagram: teacherInstas[i],
      pronouns: teacherPronouns[i],
    })
  }
  // console.log(teachers)
  return teachers;
}


function promoImgs(classInfo){
  const allImgs = classInfo["Promo Image"]?.files
  console.log('allImgs', allImgs)
  const imgs = [];
  for(let i = 0; i < allImgs.length; i++){
    imgs.push({
      image: allImgs[i]?.file?.url
    })
  }
  console.log("imgs", imgs)
  return imgs;
}

function prettyDateString(uglyDateString){
  if(!uglyDateString) return null
  let parts = uglyDateString.split('-');
  return new Date(parts[0], parts[1]-1, parts[2]).toLocaleDateString("en-us", {month:'long', day:'numeric', year:'numeric'})
}
function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  if(rollupArray[0].external) console.log("rollup array", rollupArray)
  if(rollupArray.length > 1){
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
        console.log("file", dataObj.files[i])
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
      contentObj[lastEntry] += `<img src=${block['image'].external.url} />`
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
      contentObj[lastEntry] += `<img src=${block['image'].external.url} />`
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
// getPage("c03e32537c054d7aa788a4c37b20695f")
//00184f83-7465-4e26-8cfc-9e03c009becc
