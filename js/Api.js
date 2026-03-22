

var allJobs = [];

var searchInput = document.querySelector('#search-input');
var typeFilter = document.querySelector('#type-filter');
var resetBtn = document.querySelector('#reset-btn');
var retryBtn = document.querySelector('#retry-btn');
var jobsContainer = document.querySelector('#jobs-container');
var loadingEl = document.querySelector('#loading');
var errorBox = document.querySelector('#error-box');
var noResults = document.querySelector('#no-results');
var resultsCount = document.querySelector('#results-count');

// ----------------------------------------
// Fetch jobs from the Rise API
// ----------------------------------------
async function fetchJobs() {
  showState('loading');

  try {
    var response = await fetch('https://api.joinrise.io/api/v1/jobs/public?page=1&limit=20');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    var data = await response.json();
    allJobs = data.result.jobs;
    renderJobs();

  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    showState('error');
  }
}

// ----------------------------------------
// Filter jobs based on search and dropdown
// ----------------------------------------
function getFilteredJobs() {
  var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
  var type = typeFilter ? typeFilter.value : '';

  return allJobs.filter(function (job) {
    // Check keyword against title and company name
    if (keyword) {
      var title = (job.title || '').toLowerCase();
      var company = (job.owner && job.owner.companyName ? job.owner.companyName : '').toLowerCase();
      if (!title.includes(keyword) && !company.includes(keyword)) {
        return false;
      }
    }

    // Check job type
    if (type) {
      var jobType = (job.type || '').toLowerCase();
      if (!jobType.includes(type.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

// ----------------------------------------
// Build and display job cards
// ----------------------------------------
function renderJobs() {
  var filtered = getFilteredJobs();

  if (resultsCount) {
    resultsCount.textContent = 'Showing ' + filtered.length + ' job(s)';
  }

  if (filtered.length === 0) {
    showState('noresults');
    return;
  }

  showState('results');

  jobsContainer.innerHTML = filtered.map(function (job) {
    var title = job.title || 'Untitled Role';
    var company = (job.owner && job.owner.companyName) ? job.owner.companyName : 'Unknown Company';
    var location = job.locationAddress || job.location || 'Location not specified';
    var type = job.type || '';
    var summary = (job.descriptionBreakdown && job.descriptionBreakdown.oneSentenceJobSummary)
      ? job.descriptionBreakdown.oneSentenceJobSummary
      : '';
    var url = job.url || '#';

    return '<article class="job-card">' +
      '<h2>' + title + '</h2>' +
      '<p class="job-company">' + company + '</p>' +
      '<div class="job-meta">' +
        '<span>📍 ' + location + '</span>' +
        (type ? '<span class="job-type">' + type + '</span>' : '') +
      '</div>' +
      (summary ? '<p class="job-summary">' + summary + '</p>' : '') +
      '<a href="' + url + '" class="job-apply" target="_blank" rel="noopener">Apply on Rise →</a>' +
    '</article>';
  }).join('');
}

// ----------------------------------------
// Show one UI state at a time
// ----------------------------------------
function showState(state) {
  if (loadingEl)     loadingEl.hidden = true;
  if (errorBox)      errorBox.hidden = true;
  if (noResults)     noResults.hidden = true;
  if (jobsContainer) jobsContainer.hidden = true;

  if (state === 'loading' && loadingEl)     loadingEl.hidden = false;
  if (state === 'error' && errorBox)        errorBox.hidden = false;
  if (state === 'noresults' && noResults)   noResults.hidden = false;
  if (state === 'results' && jobsContainer) jobsContainer.hidden = false;
}

// ----------------------------------------
// Event listeners
// ----------------------------------------
if (searchInput) {
  searchInput.addEventListener('input', renderJobs);
}

if (typeFilter) {
  typeFilter.addEventListener('change', renderJobs);
}

if (resetBtn) {
  resetBtn.addEventListener('click', function () {
    if (searchInput) searchInput.value = '';
    if (typeFilter) typeFilter.value = '';
    renderJobs();
  });
}

if (retryBtn) {
  retryBtn.addEventListener('click', fetchJobs);
}

// ----------------------------------------
// Start: fetch jobs when page loads
// ----------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  if (jobsContainer) {
    fetchJobs();
  }
});