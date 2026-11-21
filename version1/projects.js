const filters = document.querySelector('.project-filters');
const filterButtons = filters.querySelectorAll('button');
const projects = document.querySelectorAll('#project-list .project');
const filterStatus = document.querySelector('#filter-status');

filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;

  const topic = button.dataset.filter;
  let visibleCount = 0;

  for (const project of projects) {
    const matches = topic === 'all' || project.dataset.topic.split(' ').includes(topic);
    project.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  for (const filterButton of filterButtons) {
    filterButton.setAttribute('aria-pressed', String(filterButton === button));
  }

  filterStatus.textContent = `${button.textContent}: ${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown.`;
});

filters.hidden = false;
