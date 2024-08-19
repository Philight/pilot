/**
 * Transforming / Injecting JSON of "Home" page components and Data
 */

import { deepMerge } from "~/lib/object";

// --------------------------------------------------------------------

const MODIFICATIONS = [
  // Slideshow
  {
    findBy: (item: any) =>
      item.type === "slideshow-slide" &&
      item.data.backgroundImage.width === 776,
    replaceWith: {
      data: {
        backgroundImage: {
          url: "https://ecdn.speedsize.com/96646a73-11d1-4ec5-a14d-66bc51e8738d/https://www.stellarequipment.com/wp-content/uploads/2022/10/INTERSTELLAR_MEGA_IMAGE_00200_KORUA_Japan-2019_HighRes_DESKTOP_2000x1190.jpg?speedsize=w_2000,h_1190",
          width: 2000,
          height: 1190,
        },
      },
    },
    children: {
      "1": {
        replaceWith: {
          data: {
            content: "The minimalist choice",
          },
        },
      },
      "2": {
        replaceWith: {
          data: {
            content:
              "<p>Two signature models for any situation, any weather. Get your signature for the upcoming winter.</p>",
          },
        },
      },
      "3": {
        replaceWith: {
          data: {
            link: "/collections/frontpage",
          },
        },
      },
    },
  },
  {
    findBy: (item: any) =>
      item.type === "slideshow-slide" &&
      item.data.backgroundImage.width === 3384,
    replaceWith: {
      data: {
        backgroundImage: {
          url: "https://www.switchbacktravel.com/sites/default/files/images/articles/Burton%20ak%20Embark%20Gore-Tex%20women%27s%20snowboard%20jacket%20%28carving%29.jpg",
          width: 1200,
          height: 800,
        },
      },
    },
    children: {
      "1": {
        replaceWith: {
          data: {
            content: "Shopify curated snowboards",
          },
        },
      },
      "2": {
        replaceWith: {
          data: {
            content:
              "<p>Dozen of models from the original Shopify collection. Custom logos to show off your vibes</p>",
          },
        },
      },
      "3": {
        replaceWith: {
          data: {
            link: "/collections/automated-collection",
          },
        },
      },
    },
  },
  // Featured products - 1
  {
    findBy: (item: any) =>
      item.type === "featured-products" &&
      item.handle !== "automated-collection",
    replaceWith: {
      heading: "Home page",
    },
    children: {},
  },
  // Video hero
  {
    findBy: (item: any) => item.type === "hero-video",
    replaceWith: {
      data: {
        videoURL:
          "https://www.youtube.com/watch?v=kh29_SERH0Y&start=20&end=120",
      },
    },
    children: {},
  },
  {
    findBy: (item: any) =>
      item.type === "featured-collections" &&
      item.data.collections[0].handle === "women",
    replaceWith: {
      data: {
        gap: 32,
        width: "stretch",
        collections: [
          {
            // id: 463018295618,
            id: "gid://shopify/Collection/463018295618",
            handle: "frontpage",
          },
          {
            // id: 463018328386,
            id: "gid://shopify/Collection/463018328386",
            handle: "automated-collection",
          },
        ],
      },
    },
    children: {
      "0": {
        replaceWith: {
          data: {
            content: "Featured Collections",
          },
        },
      },
      // "1": {
      //   replaceWith: {
      //     data: {
      //       gridSize: "2",
      //     },
      //   },
      // },
    },
  },
];

// --------------------------------------------------------------------

const findSectionIndex = (sections: any, rule: any): number =>
  sections.findIndex((section: any) => rule.findBy(section));

const copySections = (sections: any) => {
  const sectionIndexFeatured = findSectionIndex(sections, {
    findBy: (item: any) => item.type === "featured-products",
  });
  const sectionIndexGallery = findSectionIndex(sections, {
    findBy: (item: any) => item.type === "image-gallery",
  });

  if (sectionIndexFeatured < 0 || sectionIndexGallery < 0) return sections;

  const { id, loaderData, ...restAttr } = sections[sectionIndexFeatured];
  const { data, ...restGallery } = sections[sectionIndexGallery];

  // Replace Gallery items with Featured items

  sections[sectionIndexGallery] = deepMerge(restGallery, {
    ...restAttr,
    type: "featured-products",
    heading: "Automated Collection",
    data: {
      handle: "automated-collection",
    },
  });

  // Filter products in Featured 1

  const minimalBoard = loaderData.products.nodes.filter(
    (p: any) => p.handle === "the-minimal-snowboard"
  )[0];

  minimalBoard.variants.nodes[0].image = {
    url: "https://pacificboarder.com/cdn/shop/files/210000076376-Ride-Men_s-Peace-Seeker-Snowboard-2024_2048x.png?v=1695849568",
    altText:
      "The top and bottom view of a snowboard. The top has view is white and black with graphics of\n        trees. The bottom view is turquoise with the word hydrogen written in cursive.",
    width: 1500,
    height: 1500,
  };

  sections[sectionIndexFeatured] = {
    ...sections[sectionIndexFeatured],
    loaderData: {
      products: {
        nodes: [minimalBoard],
      },
    },
  };

  // Filter products in Featured 2

  sections[sectionIndexGallery] = {
    ...sections[sectionIndexGallery],
    loaderData: {
      products: {
        nodes: loaderData.products.nodes.filter(
          (p: any) => p.handle !== "the-minimal-snowboard"
        ),
      },
    },
  };

  return sections;
};

export const transformWithMageXo = async (data: any) => {
  const modifiedData = data;

  let pageSections = modifiedData.page.items;

  pageSections = copySections(pageSections);

  // Modify by one section

  for (const rule of MODIFICATIONS) {
    // Find sectionItem
    const sectionIndex = findSectionIndex(pageSections, rule);

    if (sectionIndex < 0) continue;

    // Modify attributes
    pageSections[sectionIndex] = deepMerge(
      pageSections[sectionIndex],
      rule.replaceWith
    );

    // Modify children sections
    if (
      pageSections[sectionIndex].children.length &&
      Object.keys(rule.children).length
    ) {
      for (const index in rule.children) {
        // Find child sectionItem
        const childSectionId = pageSections[sectionIndex].children[index].id;

        const childSectionIndex = pageSections.findIndex(
          (section: any) => section.id === childSectionId
        );

        // Modify attributes
        pageSections[childSectionIndex] = deepMerge(
          pageSections[childSectionIndex],
          rule.children[index].replaceWith
        );
      }
    }
  }

  // Replace section items

  modifiedData.page.items = pageSections;

  return modifiedData;
};
