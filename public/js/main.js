

const getPageInfoFromBackend = async(pageId) => {
  const res = await fetch("http://localhost:3000/page/"+pageId)
  const data = await res.json()
  return data
}
const getNameFromId = async(id) => {
  const res = await fetch("http://localhost:3000/name/"+id)
  const data = await res.json()
  return data
}

const addDataToDom = async (pageId) => {
  const data = await getPageInfoFromBackend(pageId);
  console.log(data)
  $('#title').text(data.Name.title[0].plain_text)
  $('#cost').text(data.Cost.number)
  const teachers = [];
  data["Promo Image"].files.map((image) => {
    $('#images').append(`<img style="width:400px" src="${image.file.url}" />`)
  })
  $('#description').text(data["Short Description"].rich_text[0].plain_text)
  data.Teachers.relation.map(async (teacher) => {
    const name = await getNameFromId(teacher.id)
    console.log(name)
    $('#teachers').append(`<span class='teacher'>${name}, </span>`)
  })
}

addDataToDom("c03e32537c054d7aa788a4c37b20695f")