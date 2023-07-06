const express = require("express")
const hbs = require("hbs")
const  bodyParser = require('body-parser')
const helpers = require('handlebars-helpers')();
const {getPage, getDatabaseEntries, getDatabaseEntry, getBlocks, createPage, getLastEntry} = require('./lib/notion')
const {getShopifyProduct, getShopifyProducts} = require("./lib/shopifyStorefront");
const classList = require("./lib/classNotionPageList")
const res = require("express/lib/response")
const { response } = require("express");
const { parse } = require("dotenv");
const app = express()
const PORT = process.env.PORT || 3000

const NOTION_FUNDRAISER_DATABASE_ID = "11ee959b7fdb4204a9ce46c9224b1818";
const NOTION_STORE_DATABASE_ID = "7c36ef34cebb48e097706442634abaaf";

console.log("starting up")
app.use(express.static("public"))
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', './public/templates')
app.set('view engine', 'hbs');
hbs.registerPartials("./public/templates/partials")
for (let helper in helpers) {
  hbs.registerHelper(helper, helpers[helper]);
}

app.post("/createPage/:databaseId", async (req,res) => {
  const response = await createPage(req.params.databaseId, req.body.title, req.body.message)
  console.log(response)
  res.json(response)
})
app.get("/page/:pageId", async (req,res) => {
  const pageInfo = await getPage(req.params.pageId)
  res.json(pageInfo.properties)
})


app.get("/pageContent/:id", async (req, res) => {
  const response = await getBlocks(req.params.id);
  res.json(response);
})


// app.get("/participate/winter-23", async (req, res) => {
//   // TODO: load session page
//   res.render("programs/sessions/winter-23/session")
// })


// app.get("/participate/spring-22", async (req, res) => {
//   // TODO: load session page
//   res.render("programs/sessions/spring-22/session")
// })

// app.get("/sessions/spring-22", (req,res) => {
//   res.render("programs/sessions/spring-22/session")
// })

//
// app.get("/participate/summer-22", async (req, res) => {
//   // TODO: load session page
//   res.render("programs/sessions/summer-22/session")
//
// })

//
// app.get("/participate/fall-22", async (req, res) => {
//   // TODO: load session page
//   res.render("programs/sessions/fall-22/session")
//
// })







app.get("/sex-ed", async (req,res) => {
  const response = await getDatabaseEntries("eedc3ea6ba904a9fa8631e12b03a955d", [{property:"Publish-Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseNotionPage(project)
  })
  console.log(projectData)
  // let pageContent = getPageContent()
  res.render("projects/sex-ed/ask-sfpc-sex-ed", {projects: projectData})
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
  res.render("projects/sex-ed/about")
})

app.get("/sex-ed-people", async (req,res) => {
  res.render("projects/sex-ed/people")
})



app.get("/newsletter", async (req,res) => {
  res.render("newsletter")
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
    res.render("projects/sex-ed/question", projectData)
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

app.get("/classes", async (req,res) => {
  const response = await getDatabaseEntries("6d5585af2f544dd1bad9d24c5e177026", [{property:"Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseClassData(project)
  })
  console.log(projectData)
  // let pageContent = getPageContent()
  res.render("programs/classes", {projects: projectData})
})


app.get("/sessions", async (req,res) => {
  const response = await getDatabaseEntries("ce519f031eb340f58e3693cf4e041a67", [{property:"Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseSessionData(project)
  })
  console.log(projectData)
  // let pageContent = getPageContent()
  res.render("programs/sessions", {projects: projectData})
})



app.get("/events", async (req,res) => {
  const response = await getDatabaseEntries("10c62665c6ca4383bbdc12788c45df14", [{property:"Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseNotionPage(project)
  })
  console.log(projectData)
  // let pageContent = getPageContent()
  res.render("programs/events", {projects: projectData})
})

app.get("/events/:slug", async (req,res) => {
  //filter by slug here
  console.log(req.params.slug)
  const eventData = await getDatabaseEntry("10c62665c6ca4383bbdc12788c45df14", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  if(!eventData) return

  // console.log(response)

  const response = await prepareEventData(eventData, req.params.slug)

  res.render("programs/eventPage", response)

  //
  // if(eventData){
  //
  //   res.render("programs/eventPage", response)
  //
  // }
  //


})

app.get("/", async (req,res) => {
  const response = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
  // const testimonialData = response.map((testimonial) => {
  //   console.log(testimonial)
  //   return parseTestimonials(testimonial)
  // })
  // console.log(testimonialData)
  // // let pageContent = getPageContent()
  // res.render("index", {testimonials: testimonialData})
  res.render("index")
})


app.get("/about", async (req,res) => {
  const donorinfo = await getDatabaseEntries("f10d523dd9b24d44ae2d9a6c26b4f5ee", [{property:"Name", direction:"ascending"}], {property:"Public", "checkbox": {"equals": true}})
  const donorData = donorinfo.map((donor) => {
    console.log(donor)
    return parseDonors(donor)
  })
  console.log(donorData)

  const testimonialinfo = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
  const testimonialData = testimonialinfo.map((testimonial) => {
    console.log(testimonial)
    return parseTestimonials(testimonial)
  })
  console.log(testimonialData)


  const pressinfo = await getDatabaseEntries("c0fcb9243b7947afb35111753c7b24c4", [{property:"Date", direction:"descending"}])
  const pressData = pressinfo.map((press) => {
    console.log(press)
    return parseNotionPage(press)
  })

  console.log(pressData)



  res.render("about/about", {donors: donorData, testimonials: testimonialData, presses: pressData})
})

app.get("/about/space", async (req,res) => {
  res.render("about/space")
})


app.get("/about/participating", async (req,res) => {

  const testimonialinfo = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
  const testimonialData = testimonialinfo.map((testimonial) => {
    console.log(testimonial)
    return parseTestimonials(testimonial)
  })
  console.log(testimonialData)


  res.render("about/participating", {testimonials: testimonialData})
})

app.get("/about/scholarships", async (req,res) => {
  res.render("about/scholarships")
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
    res.render("projects/sex-ed/question", projectData)
  }
})


app.get("/links", async (req,res) => {
   const response = await getDatabaseEntries("f88fce775a7846be8296efe0ad43e84c", [{property:"Date", direction:"descending"}], {property:"Public", "checkbox": {"equals": true}})

  const linkData = response.map((link) => {
    console.log(link)
    return parseLinks(link)
  })
  console.log(linkData)
  res.render("about/links", {links: linkData})
})


app.get("/about/donors", async (req,res) => {
  const memberships = await getDatabaseEntries("8ae8edd523fc45eca1b6e6a16283032c", [{property:"Name", direction:"ascending"}]
  ,
  {
        "and": [
            {
                "property": "Public",
                "checkbox": {
                    "equals": true
                }
            }
            // ,
            // {
            //     "property": "Type",
            //     "multi_select": {
            //         "contains": "Individual"
            //     }
            // }
        ]
    }
)
  const membershipsDonorData = memberships.map((member) => {
    console.log(member)
    return parseDonors(member)
  })


  const organizations = await getDatabaseEntries("f10d523dd9b24d44ae2d9a6c26b4f5ee", [{property:"Name", direction:"ascending"}],
     {
           "and": [
               {
                   "property": "Public",
                   "checkbox": {
                       "equals": true
                   }
               }
               ,
               {
                   "property": "Type",
                   "multi_select": {
                       "contains": "Organization"
                   }
               }
           ]
       }
)
  const organizationsDonorData = organizations.map((organization) => {
    console.log(organization)
    return parseDonors(organization)
  })


  const individuals = await getDatabaseEntries("f10d523dd9b24d44ae2d9a6c26b4f5ee", [{property:"Name", direction:"ascending"}],
     {
           "and": [
               {
                   "property": "Public",
                   "checkbox": {
                       "equals": true
                   }
               }
               ,
               {
                   "property": "Type",
                   "multi_select": {
                       "contains": "Individual"
                   }
               }
           ]
       }
)
  const individualsDonorData = individuals.map((individual) => {
    console.log(individual)
    return parseDonors(individual)
  })




  const communityMembers = await getDatabaseEntries("f10d523dd9b24d44ae2d9a6c26b4f5ee", [{property:"Name", direction:"ascending"}],
     {
           "and": [
               {
                   "property": "Public",
                   "checkbox": {
                       "equals": true
                   }
               }
               ,
               {
                   "property": "Type",
                   "multi_select": {
                       "contains": "Community"
                   }
               }
               ,
               {
                   "property": "Frequency",
                   "multi_select": {
                       "contains": "One-Time"
                   }
               }
           ]
       }
)
  const communityDonorData = communityMembers.map((communityMember) => {
    console.log(communityMember)
    return parseDonors(communityMember)
  })



  console.log(membershipsDonorData)

  res.render("about/donors", {memberDonors: membershipsDonorData, individualDonors: individualsDonorData, organizationDonors: organizationsDonorData, communityDonors: communityDonorData})
})



// app.get("/fundraiser", async (req, res) => {
//
//   const responseTest = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
//   const testimonialData = responseTest.map((testimonial) => {
//     console.log(testimonial)
//     return parseTestimonials(testimonial)
//   })
//   console.log(testimonialData)
//
//   const response = await getDatabaseEntries(NOTION_STORE_DATABASE_ID, [
//     { property: "Name", direction: "descending" },
//   ]);
//   console.log(response);
//
//   const productsData = response.map((product) => {
//     return parseProductData(product);
//   });
//
//   const shopifyData = await getShopifyProducts();
//
//   for (const product of productsData) {
//     const shopifyId = product["Shopify ID"];
//
//     if (!shopifyId) {
//       continue;
//     }
//
//     const node = shopifyData[`gid://shopify/Product/${shopifyId}`];
//
//     if (node) {
//       product.availableForSale = node.availableForSale;
//       product.totalInventory = node.totalInventory;
//       product.availableInventory = node.variants.edges.reduce((accum, val) => {
//         return accum + val.node.quantityAvailable;
//       }, 0);
//     }
//   }
//
//   console.log(productsData);
//   res.render("fundraiser/storefront", { products: productsData, testimonials: testimonialData });
// });
//
// app.get("/fundraiser/:slug", async (req, res) => {
//   //filter by slug here
//   console.log(req.params.slug);
//   const response = await getDatabaseEntry(NOTION_STORE_DATABASE_ID, {
//     property: "Website-Slug",
//     rich_text: { equals: req.params.slug },
//   });
//   console.log(response);
//
//   if (response) {
//     const productData = parseProductData(response);
//     const shopifyId = productData["Shopify ID"];
//
//     if (shopifyId) {
//       try {
//         const shopifyData = await getShopifyProduct(shopifyId);
//
//         if (shopifyData) {
//           productData.availableForSale = shopifyData.availableForSale;
//           productData.totalInventory = shopifyData.totalInventory;
//           productData.availableInventory = shopifyData.variants.edges.reduce(
//             (accum, val) => {
//               return accum + val.node.quantityAvailable;
//             },
//             0
//           );
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     }
//
//     console.log(productData);
//     res.render("fundraiser/product", productData);
//   }
// });






// app.get("/fundraiser", async (req,res) => {
//
//
//   res.render("fundraiser/fundraiser")
// })
//
//






app.get("/store", async (req, res) => {



  const response = await getDatabaseEntries(NOTION_STORE_DATABASE_ID, [
    { property: "Name", direction: "descending" },
  ]);
  console.log(response);


    const merch = await getDatabaseEntries(NOTION_STORE_DATABASE_ID, [{property:"Name", direction:"ascending"}],
       {
             "and": [
                 {

                     "property": "Product-Type",
                     "multi_select": {
                         "contains": "Merch"
                     }
                 }
             ]
         }
  )


  const productsData = response.map((product) => {
    return parseProductData(product);
  });

  const merchData = merch.map((product) => {
    return parseProductData(product);
  });

  const shopifyData = await getShopifyProducts();

  for (const product of productsData) {
    const shopifyId = product["Shopify ID"];

    if (!shopifyId) {
      continue;
    }

    const node = shopifyData[`gid://shopify/Product/${shopifyId}`];

    if (node) {
      product.availableForSale = node.availableForSale;
      product.totalInventory = node.totalInventory;
      product.availableInventory = node.variants.edges.reduce((accum, val) => {
        return accum + val.node.quantityAvailable;
      }, 0);
    }
  }

  console.log(productsData);
  res.render("store/storefront", { products: productsData, merch: merchData });
});



app.get("/store/:slug", async (req, res) => {
  //filter by slug here
  console.log(req.params.slug);
  const response = await getDatabaseEntry(NOTION_STORE_DATABASE_ID, {
    property: "Website-Slug",
    rich_text: { equals: req.params.slug },
  });
  console.log(response);

  if (response) {
    const productData = parseProductData(response);
    const shopifyId = productData["Shopify ID"];

    if (shopifyId) {
      try {
        const shopifyData = await getShopifyProduct(shopifyId);

        if (shopifyData) {
          productData.availableForSale = shopifyData.availableForSale;
          productData.totalInventory = shopifyData.totalInventory;
          productData.availableInventory = shopifyData.variants.edges.reduce(
            (accum, val) => {
              return accum + val.node.quantityAvailable;
            },
            0
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    console.log(productData);
    res.render("store/product", productData);
  }
});




app.get("/fundraiser", async (req, res) => {

  const responseTest = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
  const testimonialData = responseTest.map((testimonial) => {
    console.log(testimonial)
    return parseTestimonials(testimonial)
  })
  console.log(testimonialData)

  const response = await getDatabaseEntries(NOTION_FUNDRAISER_DATABASE_ID, [
    { property: "Name", direction: "descending" },
  ]);
  console.log(response);

  const productsData = response.map((product) => {
    return parseProductData(product);
  });

  const shopifyData = await getShopifyProducts();

  for (const product of productsData) {
    const shopifyId = product["Shopify ID"];

    if (!shopifyId) {
      continue;
    }

    const node = shopifyData[`gid://shopify/Product/${shopifyId}`];

    if (node) {
      product.availableForSale = node.availableForSale;
      product.totalInventory = node.totalInventory;
      product.availableInventory = node.variants.edges.reduce((accum, val) => {
        return accum + val.node.quantityAvailable;
      }, 0);
    }
  }

  console.log(productsData);
  res.render("fundraiser/winter-23/storefront", { products: productsData, testimonials: testimonialData });
});



app.get("/fundraiser/:slug", async (req, res) => {
  //filter by slug here
  console.log(req.params.slug);
  const response = await getDatabaseEntry(NOTION_FUNDRAISER_DATABASE_ID, {
    property: "Website-Slug",
    rich_text: { equals: req.params.slug },
  });
  console.log(response);

  if (response) {
    const productData = parseProductData(response);
    const shopifyId = productData["Shopify ID"];

    if (shopifyId) {
      try {
        const shopifyData = await getShopifyProduct(shopifyId);

        if (shopifyData) {
          productData.availableForSale = shopifyData.availableForSale;
          productData.totalInventory = shopifyData.totalInventory;
          productData.availableInventory = shopifyData.variants.edges.reduce(
            (accum, val) => {
              return accum + val.node.quantityAvailable;
            },
            0
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    console.log(productData);
    res.render("fundraiser/winter-23/product", productData);
  }
});



app.get("/fundraiser/winter-23", async (req, res) => {

  const responseTest = await getDatabaseEntries("16ea90c83765437c86f87bd13a205ca6", [{property:"Date", direction:"descending"}])
  const testimonialData = responseTest.map((testimonial) => {
    console.log(testimonial)
    return parseTestimonials(testimonial)
  })
  console.log(testimonialData)

  const response = await getDatabaseEntries(NOTION_FUNDRAISER_DATABASE_ID, [
    { property: "Name", direction: "descending" },
  ]);
  console.log(response);

  const productsData = response.map((product) => {
    return parseProductData(product);
  });

  const shopifyData = await getShopifyProducts();

  for (const product of productsData) {
    const shopifyId = product["Shopify ID"];

    if (!shopifyId) {
      continue;
    }

    const node = shopifyData[`gid://shopify/Product/${shopifyId}`];

    if (node) {
      product.availableForSale = node.availableForSale;
      product.totalInventory = node.totalInventory;
      product.availableInventory = node.variants.edges.reduce((accum, val) => {
        return accum + val.node.quantityAvailable;
      }, 0);
    }
  }

  console.log(productsData);
  res.render("fundraiser/winter-23/storefront", { products: productsData, testimonials: testimonialData });
});

app.get("/fundraiser/winter-23/:slug", async (req, res) => {
  //filter by slug here
  console.log(req.params.slug);
  const response = await getDatabaseEntry(NOTION_FUNDRAISER_DATABASE_ID, {
    property: "Website-Slug",
    rich_text: { equals: req.params.slug },
  });
  console.log(response);

  if (response) {
    const productData = parseProductData(response);
    const shopifyId = productData["Shopify ID"];

    if (shopifyId) {
      try {
        const shopifyData = await getShopifyProduct(shopifyId);

        if (shopifyData) {
          productData.availableForSale = shopifyData.availableForSale;
          productData.totalInventory = shopifyData.totalInventory;
          productData.availableInventory = shopifyData.variants.edges.reduce(
            (accum, val) => {
              return accum + val.node.quantityAvailable;
            },
            0
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    console.log(productData);
    res.render("fundraiser/winter-23/product", productData);
  }
});









app.get("/participate", async (req,res) => {
  const sessions = await getDatabaseEntries("ba1f9876ad3e4810880d4802d3d70d6f", [{property:"Date", direction:"descending"}])
  const events = await getDatabaseEntries("10c62665c6ca4383bbdc12788c45df14", [{property:"Date", direction:"descending"}])

  const programData = sessions.map((program) => {
    console.log(program)
    return parsePrograms(program)
  })
  console.log(programData)
  // let pageContent = getPageContent()
  res.render("programs/participate", {programs: programData})
})




app.get("/sessions/:slug", async (req, res) => {
  const sessionData = await getDatabaseEntry("51d48d4644b2439cb64c2018ad05d2b1", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  const sessionType = sessionData.properties['Session Type']?.multi_select[0]?.name
  console.log(sessionType)

  if (sessionType == "Concurrent (External)" || sessionType == "Special (External)" || sessionType == "Intensive (External)"){
    const response = await prepareSessionData(sessionData, req.params.slug)
    console.log("External Session data", response)
    res.render("programs/embed", response)
  }else if(sessionType == "Special" && sessionType != "External"){
    const classData = await getDatabaseEntry("57406c3b209e4bfba3953de6328086ac", {"and":[{property:"Website-Slug", "rich_text": {"equals":req.params.slug}}, {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": req.params.slug } }}}]})
    if(!classData) return
    const response = await prepareClassData(classData, req.params.slug)
    console.log(response)
    res.render("programs/session-special", response)
    // res.render("class-concurrent", response);
  }
  else if(sessionType == "Intensive" && sessionType != "External"){
    const response = await prepareSessionData(sessionData, req.params.slug)
    console.log("Intensive Session data", response)
    res.render("programs/session-intensive", response)
  }
  else if(sessionType == "Concurrent" && sessionType != "External"){
    const response = await prepareSessionData(sessionData, req.params.slug)
    console.log("Concurrent Session data", response)
    // res.render("programs/sessions/"+req.params.slug+"/session", response)
    res.render("programs/session-concurrent", response)
  }

})




app.get("/sessions/:session/:class", async(req,res) => {
  const data = await getDatabaseEntry("57406c3b209e4bfba3953de6328086ac", {"and":[{property:"Website-Slug", "rich_text": {"equals":req.params.class}}, {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": req.params.session } }}}]})
  if(!data) return
  const response = await prepareClassData(data, req.params.class)
  res.render("programs/class-concurrent", response);

})


app.get("/projects", async (req,res) => {
  const response = await getDatabaseEntries("713f24806a524c5e892971e4fbf5c9dd", [{property:"Release Date", direction:"descending"}])
  const projectData = response.map((project) => {
    console.log(project)
    return parseNotionPage(project)
  })
  console.log(projectData)
  res.render("projects/projectList", {projects: projectData})
})

app.get("/projects/:slug", async (req,res) => {
  //filter by slug here
  console.log(req.params.slug)
  const response = await getDatabaseEntry("713f24806a524c5e892971e4fbf5c9dd", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  console.log(response)
  if(response){
    const projectData = parseProjectData(response)
    console.log(projectData)
    res.render("projects/projectPage", projectData)
  }
})

app.get("/yearbook", async (req,res) => {
  // const response = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [{timestamp:"created_time", direction:"descending"}], {
  const response = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [{property:"Name", direction:"ascending"}], {
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
  res.render("yearbook/yearbook", {people: peopleData})
})

app.get("/yearbook/:session", async (req,res) => {
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
  res.render("yearbook/peopleSession", {people: peopleData, classes:classesInfo})
})


app.get("/blog", async (req,res) => {
  const response = await getDatabaseEntries("5fb49fe53804424a89230294206fcaee", [{property:"Publish-Date", direction:"descending"}])
  const blogData = response.map((blog) => {
    console.log(blog)
    return parseBlog(blog)
  })
  console.log(blogData)
  res.render("blog/blog", {blog: blogData})

})







app.get("/blog/:slug", async (req,res) => {
  const response = await getDatabaseEntry("5fb49fe53804424a89230294206fcaee", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
  const parsedData = parseNotionPage(response)

  // const blogData = response.map((blog) => {
  //   console.log(blog)
  //   return parseNotionPage(blog)
  // })

  console.log(parsedData)
  const pageContent = await getBlocks(response.id)
  const postHTML = parsePageContentHTML(pageContent)
  res.render("blog/post", {title: parsedData.Name, postHTML:postHTML, ...parsedData})
})


// app.get("/ecpc", async (req,res) => {
//   const response = await getDatabaseEntries("2d4d8b47e32149b5bc8f40805246446d", [{property:"Date", direction:"ascending"}])
//
//
//
//   const postData = response.map((post) => {
//     return parseECPCData(post);
//   });
//
//
//   console.log(postData)
//   res.render("projects/ecpc/ecpc", {programs: postData})
//
// })








app.get("/ecpc", async (req,res) => {
  const response = await getDatabaseEntries("2d4d8b47e32149b5bc8f40805246446d", [{property:"Date", direction:"ascending"}])
 
    const happening = await getLastEntry("2d4d8b47e32149b5bc8f40805246446d", [{property:"Date", direction:"ascending"}]
    ,
    {
          "and": [
              {
                  "property": "Current",
                  "checkbox": {
                      "equals": true
                  }
              }
              // ,
              // {
              //     "property": "Type",
              //     "multi_select": {
              //         "contains": "Individual"
              //     }
              // }
          ]
      }
  )



  const guestbook = await getDatabaseEntries("42196bb86b734120aa62e52e6547b5a0", [{property:"Date", direction:"descending"}])



const library = await getDatabaseEntries("f11a196f3ad847949150fe74dc2eb9d2", [{property:"Title", direction:"ascending"}],
   {

     "and": [
         {
           "property": "Ownership",
           "multi_select": {
               "contains": "SFPC"
             }
         }
         ,
         {
           "property": "Collection",
           "multi_select": {
               "contains": "ECPC"
             }
         }
     ]



     }
)

const lended = await getDatabaseEntries("f11a196f3ad847949150fe74dc2eb9d2", [{property:"Title", direction:"ascending"}],
   {

     "and": [
         {
           "property": "Ownership",
           "multi_select": {
               "contains": "Lended"
             }
         }
         ,
         {
           "property": "Collection",
           "multi_select": {
               "contains": "ECPC"
             }
         }
     ]



     }
)


  const store = await getDatabaseEntries(NOTION_STORE_DATABASE_ID, [
    { property: "Name", direction: "ascending" },
  ]);


  const postData =  response.map( (post) => {
    return parseECPCData(post);
  })

  // const postData = await Promise.all(response.map(async (post) => {
  //   const teacherData = await parseRelation(post.properties.Teachers)
  //   const labTechData = await parseRelation(post.properties["Lab Technician"])
  //   const parsedPost = parseECPCData(post);
  //   parsedPost.Teachers = cleanPersonData(teacherData)
  //   parsedPost.LabTech = cleanPersonData(labTechData)
  //   return parsedPost;
  // }));

  const guestData = guestbook.map((post) => {
    return parseECPCData(post)
  })

  const libData = library.map((post) => {
    return parseECPCData(post)
  })

  const lendedlibData = lended.map((post) => {
    return parseECPCData(post)
  })


  const storeData = store.map((post) => {
    return parseECPCData(post)
  })

  // page_size: 1
  const happeningData = happening.map((post) => {
  return parseECPCData(post)
  })



  // console.log(postData[0].LabTech)
  // console.log(postData[1].Teachers)
  res.render("projects/ecpc/ecpc-launch", {happenings: happeningData, programs: postData, items: storeData, guests: guestData, books: libData, lendedbooks: lendedlibData})

})


app.get("/ecpc/login", async (req,res) => {
  res.render("projects/ecpc/login")

})



// app.get("/blog/:slug", async (req,res) => {
//   //filter by slug here
//   console.log(req.params.slug)
//   const response = await getDatabaseEntry("5fb49fe53804424a89230294206fcaee", {property:"Website-Slug", "rich_text": {"equals":req.params.slug}})
//   const parsedData = parseNotionPage(response)
//   console.log(response)
//   const pageContent = await getBlocks(response.id)
//   const postHTML = parsePageContentHTML(pageContent)
//   if(response){
//     const projectData = parseNotionPage(response)
//     console.log(projectData)
//     res.render("blog/post", {title: parsedData.Name, postHTML:postHTML})
//   }
// })


app.listen(PORT, console.log(`server started on ${PORT}`))

//
// Rendering functions
//







async function prepareEventData(eventData, eventSlug){


  const fullPageContent = await getBlocks(eventData.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  let response = parseEventData(eventData)
  response.pageContent =  parsePageContentIntoKeyedObject(webContent);

  return response
}




function parseEventData(apiResponse){
  const eventInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);

  return returnObj
}



function parseProjectData(apiResponse){
  const projectInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);


  returnObj.sessionslug=parseRollup(projectInfo["Session-Slug"])
  returnObj.classslug=parseRollup(projectInfo["Class-Slug"])
  returnObj.classtype=parseRollup(projectInfo["Class-Type"])

  return returnObj
}





async function prepareClassData(classData, classSlug){
  const fullPageContent = await getBlocks(classData.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];
  let response = parseClassData(classData)
  console.log(response["Teacher Names"])
  response.pageContent =  parsePageContentIntoKeyedObject(webContent);
  let peopleQuery = []
  response["Teacher Names"]?.forEach((personName)=> peopleQuery.push({property:"Name", "title": { "contains": personName } }))
  response["Guest Teacher Names"]?.forEach((personName)=> peopleQuery.push({property:"Name", "title": { "contains": personName } }))
  response["Session Organizers"]?.forEach((personName)=> peopleQuery.push({property:"Name", "title": { "contains": personName } }))
  const people = await getDatabaseEntries("ea99608272e446cd880cbcb8d2ee1e13", [], {
      "or": peopleQuery,
  })
  console.log(people[0].properties.Name)
  let organizers = []
  let teachers = []
  let guests = []
  let organizerTeachers = []
  let justTeachers = []
  let justOrganizers = []
  let hasOrganizerTeachers

  people.map((person) => {
    const personData = parseNotionPage(person)
    if(typeof personData["Classes-Teacher"]  == 'string') personData["Classes-Teacher"] = [personData["Classes-Teacher"]]
      if(personData["Classes-Teacher"] && personData["Classes-Teacher"].includes(classSlug)){
        if(personData["Classes-Organizer"] && personData["Classes-Organizer"].includes(classSlug)) {
          personData.role = "organizer and teacher"
          hasOrganizerTeachers = true
          organizerTeachers.unshift(personData)
        } else {
          personData.role = "teacher"
          justTeachers.unshift(personData)
        }
        teachers.unshift(personData)
      }
      if(personData["Classes-Guest"] && personData["Classes-Guest"].includes(classSlug)){
        personData.role = "guest"
        guests.unshift(personData)
      }
      if(personData["Classes-Organizer"] && personData["Classes-Organizer"].includes(classSlug)){
        if(personData["Classes-Teacher"] && personData["Classes-Teacher"].includes(classSlug)) {
          personData.role = "organizer and teacher"
        } else {
          personData.role = "organizer"
          justOrganizers.unshift(personData)
        }
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
  response.organizerTeachers = cleanPersonData(organizerTeachers);
  response.justTeachers = cleanPersonData(justTeachers);
  response.justOrganizers = cleanPersonData(justOrganizers);
  return response
}

async function prepareSessionData(sessionData, session){
  const fullPageContent = await getBlocks(sessionData.id);
  const contentBlockId = fullPageContent.find(block => block.type == "toggle" && block.toggle.text[0].plain_text.toLowerCase() == "web content")?.id
  const webContent = contentBlockId ? await getBlocks(contentBlockId) : [];


  // let response = parseNotionPage(sessionData)

  let response = parseSessionData(sessionData)
  response.pageContent =  parsePageContentIntoKeyedObject(webContent);


  const classData = await getDatabaseEntries("57406c3b209e4bfba3953de6328086ac", [], {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": session } }}})
  response.classes = parseNotionPageArray(classData);

  const publicData = await getDatabaseEntries("ba1f9876ad3e4810880d4802d3d70d6f", [], {property:"Session Slug", "rollup": { "any": { "rich_text": { "equals": session } }}})
  response.public = parseNotionPageArray(publicData);


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
    if(personData["Sessions-Organizer"] && personData["Sessions-Organizer"].includes(session)){
      personData.role = "organizer"
      organizers.unshift(personData)
    }
    if(personData["Sessions-Guest"] && personData["Sessions-Guest"].includes(session)){
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
  return parsePageContentIntoKeyedObject(webContent);
}
  //
// Notion Parsing Functions Below
//



function parseECPCData(apiResponse){
  const ecpcInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);
  //this is the data that will be passes to the class template

  returnObj.publish=ecpcInfo["Publish"]?.checkbox
  returnObj.unpublish=ecpcInfo["Unpublish"]?.checkbox
  returnObj.date=prettyDateString(ecpcInfo["Date"]?.created_time?.start)
  returnObj.RSVPdate=prettyDateString(ecpcInfo["RSVP-Date"]?.date?.start)
  // returnObj.cover=ecpcInfo["Cover Photo"]?.[0]


  return returnObj

}



function parseProductData(apiResponse){
  const productInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);
  //this is the data that will be passes to the class template

  returnObj.cost=productInfo["Cost"]?.number
  returnObj.tags=productInfo["Tags"]?.multi_select[0]?.name
  returnObj.type=productInfo["Product-Type"]?.multi_select[0]?.name
  returnObj.selltype=productInfo["Sell-Type"]?.multi_select[0]?.name
  returnObj.goodstype=productInfo["Goods-Type"]?.multi_select[0]?.name
  returnObj.publish=productInfo["Publish"]?.checkbox
  returnObj.pinned=productInfo["Publish"]?.checkbox
  returnObj.store=productInfo["Store?"]?.checkbox
  returnObj.moreImages=parseNotionData(productInfo["More-Image-URLs"])


  return returnObj

}





function parseSessionData(apiResponse){
  const sessionInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);
  //this is the data that will be passes to the class template


  returnObj.classBlock=parseClassBlock(sessionInfo)
  returnObj.cost=sessionInfo["Cost"]?.number
  returnObj.startDate=prettyDateString(sessionInfo["Date"]?.date?.start)
  returnObj.endDate=prettyDateString(sessionInfo["Date"]?.date?.end)
  let today = new Date()
  today.setTime(today.getTime() - 600 * 60 * 1000)
  today = new Date(prettyDateString(today.toISOString().slice(0, 10)))
  returnObj.comingSoon = today <= new Date(returnObj.launchDate)
  returnObj.applicationEndDate=prettyDateString(sessionInfo["Application End Date"]?.date?.start)
  returnObj.notifyDate=prettyDateString(sessionInfo["Notification Date"]?.date?.start)
  returnObj.launchDate=prettyDateString(sessionInfo["Launch Date"]?.date?.start)
  returnObj.applicationsOpen = today <= new Date(returnObj.applicationEndDate)
  // returnObj.registrationDone = today >= new Date(returnObj.notifyDate)
  returnObj.registrationDone = today >= new Date(returnObj.endDate)
  returnObj.sessionEnded = today >= new Date(returnObj.endDate)
  returnObj.live = today >= new Date(returnObj.launchDate)
  returnObj.classCount=sessionInfo["Number-Classes"].number
  returnObj.appStatus=sessionInfo["Application Status"]?.multi_select[0]?.name
  returnObj.publish=sessionInfo["Publish"]?.checkbox

  return returnObj
}



function parseTestimonials(apiResponse){
  const testimonialInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);

  returnObj.type=testimonialInfo["Type of Feedback"]?.multi_select[0]?.name
  returnObj.publish=testimonialInfo["Publish"]?.checkbox

  return returnObj
}


function parsePrograms(apiResponse){
  const programInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);


  // returnObj.name=programInfo.Name.title[0].plain_text

  returnObj.type=programInfo["Program-Type"]?.multi_select[0]?.name
  returnObj.publish=programInfo["Public"]?.checkbox

  returnObj.startDate=prettyDateString(programInfo["Date"]?.date?.start)



    returnObj.eventImage=parseRollup(programInfo["Event-Promo-Image"]?.[0])
    returnObj.sesssionImage=parseRollup(programInfo["Session-Promo-Image"]?.[0])


    returnObj.image=programInfo["Promo Image"]?.formula.string

    returnObj.location=programInfo["Location"]?.formula.string

    returnObj.classcount=programInfo["Class Count"]?.formula.string

    // returnObj.classcount=parseRollup(programInfo["Number-of-Classes"]?.[0])

    // returnObj.year=programInfo["Year"]?.formula.string

    const prettyDate = prettyDateString(programInfo["Date"]?.date?.start)
    const getYear = prettyDate.substring(prettyDate.length - 4);


    returnObj.year=getYear

    returnObj.dateim=programInfo["Date Import"]?.formula.date


    returnObj.public=programInfo["Public"]?.checkbox

    // returnObj.classcount=parseRollup(programInfo["Number-of-Classes"]?.number)

    const hasDateImport = programInfo["Date Import"]?.formula.date

    if (hasDateImport) {
        returnObj.startDate=prettyDateString(hasDateImport)
    }


    const hasEventImg = parseRollup(programInfo["Event-Promo-Image"])



        returnObj.eventThumb = hasEventImg




    //
    // const hasClasses = parseRollup(programInfo["Number-of-Classes"])
    //
    // if (hasClasses) {
    //   returnObj.classcount=parseRollup(programInfo["Number-of-Classes"])[0]?.number
    // }



    // returnObj.session=parseRollup(classInfo["Session Name"])[0]?.plain_text





    //
    // const eventImg = programInfo["Event-Promo-Image"]?.[0]
    // const sessionImg = programInfo["Session-Promo-Image"]?.[0]

    // if(eventImg) {
      // returnObj.eventImage=parseNotionData(programInfo["Event-Promo-Image"])?.[0]


    // } else if(sessionImg) {
      // returnObj.sesssionImage=parseNotionData(programInfo["Session-Promo-Image"])?.[0]
    // }



      // returnObj.thumbnailthum=parseNotionData(programInfo["Event-Promo-Image"])?.[0]

    //
    // const eventDate = programInfo["Event-Date"]?.date?.start
    // const sessionDate = programInfo["Session-Date"]?.date?.start


    // if(eventDate) {
    //   returnObj.startDate=prettyDateString(eventDate)
    // } else if(sessionDate) {
    //   returnObj.startDate=prettyDateString(sessionDate)
    // }




  return returnObj
}


function parseLinks(apiResponse){
  const linkInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);


  returnObj.type=linkInfo["Tag"]?.multi_select[0]?.name
  returnObj.public=linkInfo["Public"]?.checkbox

  return returnObj
}




function parseDonors(apiResponse){
  const donorInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);


  returnObj.name=donorInfo.Name.title[0].plain_text

  returnObj.type=donorInfo["Type"]?.multi_select[0]?.name
  returnObj.detail=donorInfo["Detail"]?.multi_select[0]?.name
  returnObj.publish=donorInfo["Public"]?.checkbox

  returnObj.membershipstatus=donorInfo["Membership Status"]?.multi_select[0]?.name

  return returnObj
}



function parseBlog(apiResponse){
  const blogInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);


  returnObj.status=blogInfo["Status"]?.multi_select[0]?.name

  return returnObj
}







function parseClassData(apiResponse){
  const classInfo = apiResponse.properties;
  let returnObj = parseNotionPage(apiResponse);
  //this is the data that will be passes to the class template

  let hasShowcase;
  const projectNames = parseRollup(classInfo["Project Names"])
  const blogNames = parseRollup(classInfo["Blog Names"])
  const eventNames = parseRollup(classInfo["Event Names"])

  let numberProjects
  let numberEvents
  let numberBlogs

  if (projectNames || blogNames || eventNames ) {
    hasShowcase = true;

    if (projectNames) {
      numberProjects = projectNames.length
    } else {
      numberProjects = " "
    }

    if (eventNames) {
      numberEvents = eventNames.length
    } else {
      numberEvents = " "
    }

    if (blogNames) {
      numberBlogs = blogNames.length
    } else {
      numberBlogs = " "
    }

  }

  returnObj.showcase = hasShowcase
  returnObj.name=classInfo.Name.title[0].plain_text
  returnObj.subtitle=classInfo["Subtitle"].rich_text[0]?.plain_text
  returnObj.teachers=parseTeachers(classInfo)
  returnObj.classBlog=parseClassBlog(classInfo)
  returnObj.classProjects=parseClassProjects(classInfo)
  returnObj.classEvents=parseClassEvents(classInfo)
  returnObj.blogCount = numberBlogs
  returnObj.eventCount = numberEvents
  returnObj.projectCount = numberProjects
  returnObj.thumbnailImage=parseNotionData(classInfo["Thumbnail Image"])?.[0]
  returnObj.bannerImage=parseNotionData(classInfo["Banner Image"])?.[0]
  returnObj.promoImage=parseNotionData(classInfo["Promo Images"])?.[0]
  returnObj.promoGraphic=parseNotionData(classInfo["Promo Graphic"])?.[0]
  returnObj.promoImages=parseNotionData(classInfo["Promo Images"])
  returnObj.sessionImage=parseNotionData(classInfo["Session Images"])?.[0]
  returnObj.sessionImages=parseNotionData(classInfo["Session Images"])
  returnObj.startDate=prettyDateString(classInfo["Date"]?.date?.start)
  returnObj.endDate=prettyDateString(classInfo["Date"]?.date?.end)
  returnObj.startDate2=prettyDateString(classInfo["Date 2"]?.date?.start)
  returnObj.endDate2=prettyDateString(classInfo["Date 2"]?.date?.end)
  returnObj.numberOfClasses=classInfo["Number of Classes"].number
  returnObj.time=classInfo["Time"].rich_text[0]?.plain_text
  returnObj.appQuestion=classInfo["Application Question"].rich_text[0]?.plain_text
  returnObj.location=classInfo["Location"].rich_text[0]?.plain_text
  returnObj.cost=classInfo["Cost"]?.number
  returnObj.fee=classInfo["Processing Fee"].rich_text[0]?.plain_text
  let today = new Date()
  today.setTime(today.getTime() - 600 * 60 * 1000)
  today = new Date(prettyDateString(today.toISOString().slice(0, 10)))
  returnObj.comingSoon = today <= new Date(returnObj.launchDate)
  returnObj.applicationEndDate=prettyDateString(classInfo["Application End Date"]?.date?.start)
  returnObj.notifyDate=prettyDateString(classInfo["Notification Date"]?.date?.start)
  returnObj.launchDate=prettyDateString(classInfo["Launch Date"]?.date?.start)
  returnObj.applicationsOpen = today <= new Date(returnObj.applicationEndDate)
  returnObj.registrationDone = today >= new Date(returnObj.notifyDate)
  returnObj.sessionEnded = today >= new Date(returnObj.endDate)
  returnObj.live = today >= new Date(returnObj.launchDate)
  returnObj.applicationLink=classInfo["Application URL"]?.url
  returnObj.description=classInfo["Description"]?.rich_text[0]?.plain_text
  returnObj.endDescription=classInfo["Session End Description"]?.rich_text[0]?.plain_text
  returnObj.active=classInfo["Active"]?.formula.boolean
  returnObj.url=classInfo["Webpage URL"]?.url
  returnObj.publish=classInfo["Publish"]?.checkbox
  returnObj.session=parseRollup(classInfo["Session Name"])[0]?.plain_text
  returnObj.notifyDate=prettyDateString(classInfo["Notification Date"]?.date?.start)

  return returnObj
}




// function parseEvents(programInfo){
//   const eventName = parseRollup(programInfo["Teacher Names"])
//   const eventDate = parseRollup(programInfo["Teacher Bios"])
//   const eventTime = parseRollup(programInfo["Teacher Bios"])
//   const eventLocation = parseRollup(programInfo["Teacher Bios"])
//   const eventImage = parseRollup(programInfo["Event-Promo-Image"])
//   const events = [];
//
//   if (eventName) {
//
//
//   for(let i = 0; i < eventName.length; i++){
//     events.push({
//       name: eventName[i],
//       date: eventDate[i],
//       time: eventTime[i],
//       location: eventLocation[i],
//       image: eventImage[i]
//     })
//   }
//
//   }
//   return events;
// }






function parseTeachers(classInfo){
  const teacherNames = parseRollup(classInfo["Teacher Names"])
  const teacherBios = parseRollup(classInfo["Teacher Bios"])
  const teacherPhotos = parseRollup(classInfo["Teacher Photos"])
  const teacherWebsites = parseRollup(classInfo["Teacher Websites"])
  const teacherTwitters = parseRollup(classInfo["Teacher Twitters"])
  const teacherInstas = parseRollup(classInfo["Teacher Instagrams"])
  const teacherPronouns = parseRollup(classInfo["Teacher Pronouns"])
  const teachers = [];

  if (teacherNames) {


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

  }
  // console.log(teachers)
  return teachers;
}
function parseClassProjects(classInfo){
  const projectNames = parseRollup(classInfo["Project Names"])
  const projectSlugs = parseRollup(classInfo["Project Slugs"])
  const projectThumb = parseRollup(classInfo["Project Thumbnails"])
  const projectDate = parseRollup(classInfo["Project Dates"])
  const classProjects = [];

  if(projectNames) {
    hasShowcase = true;
      for(let i = 0; i < projectNames.length; i++){
        classProjects.push({
          name: projectNames[i],
          slug: projectSlugs[i],
          image: projectThumb[i],
          date: projectDate[i],
        })
      }
  }

  return classProjects
}




function parseClassBlog(classInfo){
  const blogNames = parseRollup(classInfo["Blog Names"])
  const blogSlugs = parseRollup(classInfo["Blog Slugs"])
  const blogThumb = parseRollup(classInfo["Blog Thumbnails"])
  const blogStatus = parseRollup(classInfo["Blog Statuses"])
  const blogDate = parseRollup(classInfo["Blog Dates"])
  const classBlog = [];

  if(blogNames) {
    hasShowcase = true;
      for(let i = 0; i < blogNames.length; i++){
        classBlog.push({
          name: blogNames[i],
          slug: blogSlugs[i],
          image: blogThumb[i],
          status: blogStatus[i],
          date: blogDate[i],
        })
      }
  }

  return classBlog
}


function parseClassEvents(classInfo){
  const eventNames = parseRollup(classInfo["Event Names"])
  const eventSlugs = parseRollup(classInfo["Event Slugs"])
  const eventThumb = parseRollup(classInfo["Event Thumbnails"])
  const eventDate = parseRollup(classInfo["Event Dates"])
  const classEvents = [];

  if(eventNames) {
    hasShowcase = true;
      for(let i = 0; i < eventNames.length; i++){
        classEvents.push({
          name: eventNames[i],
          slug: eventSlugs[i],
          image: eventThumb[i],
          date: eventDate[i],
        })
      }
  }

  return classEvents
}



function parseClassBlock(classInfo){
  const classNames = parseRollup(classInfo["Website-Classes"])
  const classSlugs = parseRollup(classInfo["Class-Slugs"])
  const classThumb = parseRollup(classInfo["Class-Thumbnails"])
  const classLocation = parseRollup(classInfo["Class-Locations"])
  const classDates = parseRollup(classInfo["Class-Dates"])
  const classTeachers = parseRollup(classInfo["Class-Teachers"])

  const classBlock = [];

  if(classNames) {
      for(let i = 0; i < classNames.length; i++){
        classBlock.push({
          name: classNames[i],
          slug: classSlugs[i],
          image: classThumb[i],
          location: classLocation[i],
          date: classDates[i],
          teachers: classTeachers[i],
        })
      }
  }

  return classBlock
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
async function parseRelation(relationObject){
  const relationData = await Promise.all(relationObject.relation.map(async (data) => {
    const fetchedData = await getPage(data.id);
    const parsedData = parseNotionPage(fetchedData);
    return parsedData
  }));
  return relationData
}

function parseRollup(rollupData){
  const rollupArray = rollupData?.rollup.array
  if(!rollupArray?.length) return null
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
  else if (dataObj.created_time)
    return new Date(dataObj.created_time).toLocaleString("en-us")
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
function parsePageContentIntoKeyedObject(data) {
  let pageContent = {}
  for (let i = 0; i < data.length; i++) {
    parseBlockIntoKeyedObject(data[i], pageContent)
  }
  return pageContent
}

function parseBlockIntoKeyedObject(block, contentObj) {
  const lastEntry = Object.keys(contentObj).pop();
  if (!lastEntry && block.type !== 'heading_2') return
  switch (block.type) {
    case 'heading_2':
      // For a heading
      contentObj[block['heading_2'].text[0].plain_text] = "";
      break;
    case 'heading_3':
      // For a heading
      // contentObj[block['heading_3'].text[0].plain_text] = "";
      let h3Text = formatRichText(block['heading_3'].text)
      contentObj[lastEntry] += `<h6>${h3Text}</h6>`
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
    case 'numbered_list_item':
      // For an unordered list
      let numberedText = formatRichText(block['numbered_list_item'].text)
      contentObj[lastEntry] += `<ol><li>${numberedText}</li></ol >`
      break;
    case 'paragraph':
      // For a paragraph
      let pText = formatRichText(block['paragraph'].text)
      contentObj[lastEntry] += `<p>${pText}</p>`
      break;
    case 'audio':
      // For an image
      if(block['audio']?.external?.url)
        contentObj[lastEntry] += `
        <audio controls><source src=${block['audio'].external.url}></audio>`
      else if(block['audio']?.file?.url)
        contentObj[lastEntry] += `<audio controls><source src=${block['audio'].file.url}></audio>`
      break;
    default:
      // For an extra type
      return
  }
}
function parsePageContentHTML(data) {
  let pageHTML = ""
  let prevType = ""
  console.log("parsing")
  for (let i = 0; i < data.length; i++) {
    pageHTML = parseBlockHTML(data[i], pageHTML, prevType)
    prevType = data[i].type
  }
  return pageHTML
}

function parseBlockHTML(block, pageHTML, prevType) {

  switch (block.type) {
    case 'heading_1':
      // For a heading
      let h1Text = formatRichText(block['heading_1'].text)
      console.log(h1Text)
      return pageHTML += `<h2>${h1Text}</h2>`
    case 'heading_2':
      // For a heading
      let h2Text = formatRichText(block['heading_2'].text)
      return pageHTML += `<h2>${h2Text}</h2>`
    case 'heading_3':
      // For a heading
      let h3Text = formatRichText(block['heading_3'].text)
      return pageHTML += `<h6>${h3Text}</h6>`
    case 'image':
      // For an image
      if(block['image']?.external?.url)
        return pageHTML += `<img src=${block['image'].external.url} />`
      else if(block['image']?.file?.url)
        return pageHTML += `<img src=${block['image'].file.url} />`
      break;
    case 'bulleted_list_item':
      console.log(block.bulleted_list_item.text)
      // For an unordered list
      let bulletText = formatRichText(block['bulleted_list_item'].text)
      if(prevType == "bulleted_list_item"){
        pageHTML = pageHTML.slice(0,-5) + `<li>${bulletText}</li></ul>`
        return pageHTML
      }
      else
        return pageHTML += `<ul><li>${bulletText}</li></ul>`
    case 'numbered_list_item':
      // For a numbered list
      let numberedText = formatRichText(block['numbered_list_item'].text)
      if(prevType == "numbered_list_item"){
        pageHTML = pageHTML.slice(0,-5) + `<li>${numberedText}</li></ol>`
        return pageHTML
      }
      else
        return pageHTML += `<ol><li>${numberedText}</li></ol>`
    case 'paragraph':
      // For a paragraph
      if(block['paragraph'].text.length <=0)
        return pageHTML += "<br />"
      let pText = formatRichText(block['paragraph'].text)
      return pageHTML += `<p>${pText}</p>`
    case 'quote':
      // For a caption
      let quoteText = formatRichText(block['quote'].text)
      return pageHTML += `<em>${quoteText}</em>`
    case 'audio':
      // For an image
      if(block['audio']?.external?.url)
        return pageHTML += `
        <audio controls><source src=${block['audio'].external.url}></audio>`
      else if(block['audio']?.file?.url)
        return pageHTML += `<audio controls><source src=${block['audio'].file.url}></audio>`
      break;
    case 'video':
      // For a video
      if(block['video']?.external?.url)
        return pageHTML += `
        <video controls><source src=${block['video'].external.url}></video>
         `
      else if(block['video']?.file?.url)
        return pageHTML += `<video controls><source src=${block['video'].file.url} /></video>`
      break;
    case 'divider':
      return pageHTML += "<hr />"
    default:
      // For an extra type
      console.log(block.type)
      return pageHTML  += `<div class="break-endpage"></div>`
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
      tempText = `<i>${tempText}</i>`
    if (textArray[i].annotations.underline)
      tempText = `<span style="text-decoration:underline">${tempText}</span>`
    if (textArray[i].href)
      tempText = `<a href="${textArray[i].href}">${tempText}</a>`
    formattedText += tempText
  }
  return formattedText
}
