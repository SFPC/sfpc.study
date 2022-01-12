

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
  $('[data-notion="title"]').text(data.Name.title[0].plain_text)
  $('[data-notion="cost"]').text(data.Cost.number)
  const teachers = [];
  data["Promo Image"].files.map((image) => {
    $('[data-notion="images"]').append(`<img style="width:400px" src="${image.file.url}" />`)
  })
  $('[data-notion="description]').text(data["Short Description"].rich_text[0].plain_text)
  data.Teachers.relation.map(async (teacher) => {
    const name = await getNameFromId(teacher.id)
    console.log(name)
    $('[data-notion="teachers"]').append(`<span class='teacher'>${name}, </span>`)
  })
}

addDataToDom("c03e32537c054d7aa788a4c37b20695f")