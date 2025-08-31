const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

const PORT = 5000;
const CORETECH_URL = "https://coretechio.com/";

// API Endpoint: Fetch company data dynamically
app.get("/api/coretech", async (req, res) => {
  try {
    const { data } = await axios.get(CORETECH_URL, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    // Example selectors (adjust based on site structure)
    const company = $("meta[property='og:site_name']").attr("content") || "CoreTech Innovations";
    const tagline = $("meta[name='description']").attr("content") || "Transforming Vision into Reality";

    // Extract intro, mission, vision dynamically
    const intro = $("#about-section p").first().text().trim() || "Company introduction not found";
    const mission = $(".mv-container").first().text().trim() || "Mission not found";
    const vision = $(".mv-card").first().text().trim() || "Vision not found";
    const values = $(".mv-card").first().text().trim() || "Values not found";


    

    // Services
    const services = [];

    // Select each service card
    $("#services .container .services-grid .service-card").each((i, el) => {
      const name = $(el).find("h3").text().trim() || "Service name not found";
      const description = $(el).find("p").first().text().trim() || "No description";
      const iconTag = $(el).find(".service-icon img");
      const icon = iconTag.attr("src")
        ? iconTag.attr("src").startsWith("http")
          ? iconTag.attr("src")
          : `${CORETECH_URL}${iconTag.attr("src")}`
        : null;

      // Features list
      const features = [];
      $(el).find(".service-features li").each((i, li) => {
        features.push($(li).text().trim());
      });

      // Icon (Image or FontAwesome)
      let icons = null;
      const imgTag = $(el).find(".service-icon img");
      const iTag = $(el).find(".service-icon i");

      if (imgTag.length > 0 && imgTag.attr("src")) {
        icons = imgTag.attr("src").startsWith("http")
            ? imgTag.attr("src")
            : `${CORETECH_URL}${imgTag.attr("src")}`;
      } else if (iTag.length > 0 && iTag.attr("class")) {
        icons = iTag.attr("class"); // FontAwesome class e.g., "fas fa-code"
      }
      

      // Link
      const linkAttr = $(el).find(".service-link").attr("href") || "#";
      const link = linkAttr.startsWith("http") ? linkAttr : `${CORETECH_URL}${linkAttr}`;

      services.push({ name, description, icon, features, link });
    });



    // Portfolio
    const portfolio = [];
    $(".portfolio-item").each((i, el) => {
      portfolio.push({
        title: $(el).find("h4").text().trim(),
        image: $(el).find("img").attr("src") ? `${CORETECH_URL}${$(el).find("img").attr("src")}` : null,
      });
    });



     



// Team Members

const team = [];
$("#team .container .team-grid .team-member").each((i, el) => {
  // Name is inside h3
  const name =
    $(el).find(".team-info h3").text().trim() ||
    $(el).find(".team-info h4").text().trim() ||
    $(el).find(".team-info .member-name").text().trim() ||
    "Name not found";

  // Role is inside p
  const role =
    $(el).find(".team-info p").text().trim() ||
    $(el).find(".team-info span").text().trim() ||
    "Role not found";

  // Image
  const imgTag = $(el).find(".team-image img");
  const image = imgTag.attr("src")
    ? imgTag.attr("src").startsWith("http")
      ? imgTag.attr("src")
      : `${CORETECH_URL}${imgTag.attr("src")}`
    : null;

  // Social Media Links (optional)
  const socials = [];
  $(el)
    .find(".team-info .team-social a")
    .each((i, link) => {
      socials.push($(link).attr("href"));
    });

  team.push({
    name,
    role,
    image,
    socials,
  });
});







    // Contact Info
    const contact = {};

    $(".contact-container .contact-info .contact-item").each((i, el) => {
      // Title like Location, Phone, Email
      const title = $(el).find("h3").text().trim().toLowerCase();
  
      // Value, replacing <br> with comma
      const value = $(el).find("p").html() // get inner HTML
        ? $(el).find("p").html().replace(/<br\s*\/?>/gi, ", ").trim()
        : "";
  

        // Extraa code 
      $(".contact-container .contact-info .contact-item").each((i, el) => {
      const title = $(el).find("h3").text().trim().toLowerCase();

      // Extract inner text only, ignoring HTML tags
      let value = $(el).find("p").text().trim(); // .text() removes all HTML tags

      // Optional: replace multiple spaces/newlines
      value = value.replace(/\s+/g, ' ').trim();

  if (title.includes("location")) contact.address = value;
  else if (title.includes("phone")) contact.phone = value;
  else if (title.includes("email")) contact.email = value;
});


      // Save to contact object
      if (title.includes("location")) contact.address = value;
      else if (title.includes("phone")) contact.phone = value;
      else if (title.includes("email")) contact.email = value;
    });

    res.json({
      company,
      tagline,
      intro,
      mission,
      vision,
      services,
      portfolio,
      team,
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
