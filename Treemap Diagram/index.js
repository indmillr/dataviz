const tooltip = document.getElementById("tooltip");

async function run() {
   const kickRes = await fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
   );
   const kickstarter = await kickRes.json();

   const width = 960;
   const height = 600;

   const color = d3.scaleOrdinal(d3.schemeCategory10);

   const svg = d3.select("#container").append("svg");.attr('width', width).attr('height', height);

   const treemap = d3.treemap().size([width, height]).padding(1)

   const root = d3.hierarchy(kickstarter).sum(d => d.value)

   treemap(root);

   const cell = svg.selectAll('g').data(root.leaves()).enter().append('g').attr('transform', d =>`translate(${d,x0}, ${d,y0})`);

   const tile = cell.append('rect').attr('class', 'tile').attr('data-name', d => d.data.name).attr('data-category', d => d.data.category)
}
