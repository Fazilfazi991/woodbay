import type { ProductDetail } from "../types";
import { divisionSlugForCategory } from "./taxonomy";

export type ProductContent = {
  family: string;
  overview: string;
  benefits: string[];
  applications: string[];
  features: string[];
  designNote: string;
  planningNote: string | null;
};

type Template = Omit<ProductContent, "overview"> & {
  overview: (name: string) => string;
};

const storageTemplate = (kind: string): Template => ({
  family: kind,
  overview: (name) =>
    `${name} is conceived as an integrated storage solution for contemporary cabinetry. Its purpose is to make stored items easier to see, reach and organise while keeping the surrounding kitchen or wardrobe visually composed. The system works as part of the cabinet rather than as a separate accessory, supporting a clean interior arrangement and a more considered daily routine. Available product data and model options should be reviewed against the intended cabinet before selection.`,
  benefits: [
    "Improves access to stored items",
    "Supports orderly cabinet interiors",
    "Makes considered use of available storage",
    "Integrates cleanly with contemporary cabinetry",
  ],
  applications: [
    "Kitchen cabinetry",
    "Pantry storage",
    "Modular kitchens",
    "Apartments and villas",
    "Interior storage projects",
  ],
  features: [
    "Cabinet-integrated storage concept",
    "Accessible organisation",
    "Space-conscious arrangement",
    "Designed for coordinated interiors",
  ],
  designNote:
    "The strongest storage hardware is visually quiet. By keeping organisation within the cabinetry, this solution supports an interior that feels composed while remaining practical in everyday use.",
  planningNote:
    "Compatibility depends on cabinet dimensions, opening configuration and the selected model. Confirm the cabinetry and available product option with WoodBay or an authorised dealer before finalising installation.",
});

const templates: Record<string, Template> = {
  pantry: storageTemplate("Pantry systems"),
  pullout: storageTemplate("Pull-out storage"),
  corner: {
    ...storageTemplate("Corner storage"),
    overview: (name) =>
      `${name} is designed to make corner cabinetry more useful and easier to navigate. Rather than leaving deep cabinet space difficult to reach, the solution brings organised storage into a more accessible working zone. It is suited to kitchens where efficient planning matters and where hardware should remain visually integrated with the surrounding cabinetry. Selection should be based on the actual cabinet arrangement and any model information supplied with the product.`,
  },
  wardrobe: {
    ...storageTemplate("Wardrobe accessories"),
    applications: [
      "Wardrobes",
      "Dressing rooms",
      "Bedroom storage",
      "Apartments and villas",
      "Bespoke furniture",
    ],
  },
  sink: {
    family: "Kitchen sinks",
    overview: (name) =>
      `${name} brings preparation, rinsing and cleaning functions into a coordinated kitchen work zone. It is intended for contemporary kitchens where the sink is expected to support several everyday tasks while maintaining a composed visual presence. The product should be considered together with the worktop, cabinet, plumbing and any options recorded in the catalogue. Exact compatibility must be confirmed from the available product data before installation.`,
    benefits: [
      "Creates a coordinated preparation area",
      "Supports everyday kitchen workflows",
      "Keeps utility functions visually contained",
      "Fits contemporary kitchen planning",
    ],
    applications: [
      "Residential kitchens",
      "Kitchen islands",
      "Apartments and villas",
      "Show kitchens",
      "Interior fit-outs",
    ],
    features: [
      "Integrated kitchen work-zone concept",
      "Contemporary visual treatment",
      "Designed around daily preparation",
      "Suitable for coordinated cabinetry",
    ],
    designNote:
      "A sink occupies a central place in the kitchen workflow. A considered selection balances daily utility with the lines, finishes and proportions of the surrounding worktop and cabinetry.",
    planningNote:
      "Confirm worktop cut-out, cabinet space, plumbing position and the selected model with WoodBay or an authorised dealer before fabrication or installation.",
  },
  hinge: {
    family: "Cabinet hinges",
    overview: (name) =>
      `${name} is intended for the controlled movement and alignment of cabinet doors in everyday furniture applications. As concealed working hardware, a hinge contributes to how a cabinet feels in use without competing visually with the finished door and interior. The correct selection depends on the door, cabinet construction and opening requirement, so the recorded product model and any genuine catalogue specifications should guide final compatibility.`,
    benefits: [
      "Supports controlled cabinet-door movement",
      "Maintains a clean furniture appearance",
      "Suited to contemporary cabinet construction",
      "Designed for practical everyday operation",
    ],
    applications: [
      "Kitchen cabinets",
      "Wardrobes",
      "Storage units",
      "Residential furniture",
      "Commercial cabinetry",
    ],
    features: [
      "Concealed hardware format",
      "Cabinet-door movement support",
      "Furniture-integrated installation",
      "Designed for repeat daily use",
    ],
    designNote:
      "Good furniture hardware should support the experience of the cabinet without drawing attention away from it. Correct hinge selection helps preserve clean door lines and dependable movement.",
    planningNote:
      "Hinge compatibility depends on door construction, overlay, opening configuration and cabinet geometry. Confirm the correct model with WoodBay or an authorised dealer before drilling or production.",
  },
  mechanism: {
    family: "Furniture mechanisms",
    overview: (name) =>
      `${name} is a functional furniture component intended to support movement, access or organisation within cabinetry. It is best considered early in the furniture design process so the cabinet, front and internal arrangement can be coordinated around the selected product. The result is a cleaner and more purposeful interaction, with working hardware integrated into the overall furniture composition rather than added as an afterthought.`,
    benefits: [
      "Supports purposeful furniture movement",
      "Integrates within cabinetry",
      "Keeps the finished design visually composed",
      "Helps coordinate access and storage",
    ],
    applications: [
      "Kitchen cabinetry",
      "Wardrobes",
      "Storage furniture",
      "Residential interiors",
      "Commercial fit-outs",
    ],
    features: [
      "Furniture-integrated mechanism",
      "Space-conscious operation",
      "Designed for coordinated cabinet planning",
      "Practical everyday access",
    ],
    designNote:
      "Movement hardware shapes the way furniture is experienced. Planning it alongside the cabinet allows practical operation to sit comfortably within the architectural language of the interior.",
    planningNote:
      "Compatibility depends on cabinet dimensions, door or front configuration and the selected model. Confirm all relevant product data before manufacturing the surrounding furniture.",
  },
  profile: {
    family: "Aluminium profiles",
    overview: (name) =>
      `${name} is an architectural furniture detail used to define edges, openings or functional junctions with a clean, linear expression. Profiles can help organise the relationship between panels, doors and surrounding surfaces while contributing to the visual rhythm of the finished cabinetry. Selection should follow the actual application, compatible components and any dimensions or finish information already recorded for the product.`,
    benefits: [
      "Creates clean linear detailing",
      "Supports coordinated furniture junctions",
      "Complements contemporary cabinetry",
      "Helps maintain a precise visual finish",
    ],
    applications: [
      "Kitchen cabinetry",
      "Wardrobes",
      "Display furniture",
      "Residential interiors",
      "Commercial fit-outs",
    ],
    features: [
      "Linear architectural format",
      "Furniture-integrated detailing",
      "Suitable for contemporary interiors",
      "Designed for coordinated component selection",
    ],
    designNote:
      "Profiles are small elements with a strong effect on the finished composition. Used consistently, they can bring order to edges, openings and repeated lines across a furniture scheme.",
    planningNote:
      "Confirm profile dimensions, compatible accessories, junction details and the recorded finish before cutting or fabrication. Consult WoodBay for model selection where needed.",
  },
  hardware: {
    family: "Furniture hardware",
    overview: (name) =>
      `${name} is a practical furniture component intended to support the construction, movement or everyday use of cabinetry and interior furniture. Its role is functional, but the correct selection also helps the finished piece remain visually resolved. Use the product’s genuine catalogue data, model information and available options to coordinate it with the relevant panel, cabinet or furniture application.`,
    benefits: [
      "Supports practical furniture construction",
      "Coordinates with contemporary cabinetry",
      "Keeps functional details considered",
      "Suitable for residential and commercial interiors",
    ],
    applications: [
      "Cabinetry",
      "Storage furniture",
      "Residential interiors",
      "Commercial furniture",
      "Interior fit-outs",
    ],
    features: [
      "Furniture-focused component",
      "Application-led selection",
      "Designed for integrated use",
      "Suitable for considered interior detailing",
    ],
    designNote:
      "Even modest hardware affects how furniture performs and reads as a whole. Selecting it in context helps maintain both practical function and a coherent finished appearance.",
    planningNote:
      "Confirm compatibility, fixing conditions and any recorded model information before production or installation. Seek product guidance where the application is uncertain.",
  },
  smart: {
    family: "Smart furniture",
    overview: (name) =>
      `${name} combines a familiar furniture format with integrated everyday technology. The intention is to add convenience without allowing devices, cables or controls to dominate the room. It is suited to contemporary living where furniture may need to perform more than one role, especially in compact or flexible spaces. Any included functions must be confirmed from the actual product record and available model information.`,
    benefits: [
      "Combines furniture with everyday technology",
      "Helps reduce visible device clutter",
      "Supports flexible contemporary living",
      "Keeps convenience integrated into the interior",
    ],
    applications: [
      "Living rooms",
      "Bedrooms",
      "Home offices",
      "Apartments",
      "Hospitality interiors",
    ],
    features: [
      "Technology-integrated furniture concept",
      "Space-conscious functionality",
      "Contemporary furniture form",
      "Designed for everyday convenience",
    ],
    designNote:
      "Technology feels most natural when it supports the room quietly. Smart furniture can provide useful functions while retaining the proportions and presence of a considered interior piece.",
    planningNote: null,
  },
  decor: {
    family: "Interior finishes",
    overview: (name) =>
      `${name} is a decorative interior product intended to shape atmosphere, visual texture and the character of a space. It can be used as a focused feature or coordinated across a broader material palette, depending on the room and design direction. Colour, pattern and finish should be reviewed in relation to lighting, adjacent surfaces and the intended scale of application. Only options shown in the actual product record should be treated as available.`,
    benefits: [
      "Adds visual character to interiors",
      "Supports coordinated material palettes",
      "Works across focused or broader applications",
      "Offers flexibility for residential and commercial design",
    ],
    applications: [
      "Living areas",
      "Bedrooms",
      "Feature surfaces",
      "Hospitality interiors",
      "Commercial spaces",
    ],
    features: [
      "Decorative surface concept",
      "Suitable for material-led interiors",
      "Adaptable visual application",
      "Designed to contribute texture and atmosphere",
    ],
    designNote:
      "Decorative finishes work best when considered with light, scale and neighbouring materials. A measured application can give a room identity without overwhelming its architectural structure.",
    planningNote:
      "Review the actual sample, substrate condition and installation method before final selection. Confirm any application requirements with WoodBay or the appointed installer.",
  },
};

function familyKey(product: ProductDetail) {
  const text =
    `${product.slug} ${product.name} ${product.category?.slug ?? ""} ${product.category?.name ?? ""}`.toLowerCase();
  if (
    /wallpaper|panel|mosaic|marble|louver|painting|blind|garden|fountain|light|mattress|decor/.test(
      text,
    )
  )
    return "decor";
  if (/sink/.test(text)) return "sink";
  if (
    /smart|wifi|desk|table|recliner|sofa/.test(text) ||
    divisionSlugForCategory(product.category?.slug) === "smart-furniture"
  )
    return "smart";
  if (/hinge/.test(text)) return "hinge";
  if (/profile|gola|aluminium frame/.test(text)) return "profile";
  if (/pantry/.test(text)) return "pantry";
  if (/corner/.test(text)) return "corner";
  if (/pullout|pull-out|bottle|basket|dish rack|wicker/.test(text))
    return "pullout";
  if (/wardrobe|trouser|hanger/.test(text)) return "wardrobe";
  if (/lift|tandem|shutter|pulldown|mechanism/.test(text)) return "mechanism";
  return "hardware";
}

export function getProductContent(product: ProductDetail): ProductContent {
  const template = templates[familyKey(product)];
  const realOverview = product.description?.trim();
  return {
    ...template,
    overview:
      realOverview && realOverview.length >= 120
        ? realOverview
        : [realOverview, template.overview(product.name)]
            .filter(Boolean)
            .join(" "),
    features: product.features.length ? product.features : template.features,
  };
}
