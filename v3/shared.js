var SITE = {
  nav: function(active) {
    var links = [
      { href: 'index.html', id: 'news', label: 'News' },
      { href: 'firms.html', id: 'firms', label: 'Firm Profiles' },
      { href: 'compare.html', id: 'compare', label: 'Compare' },
      { href: 'deadlines.html', id: 'deadlines', label: 'TC Deadlines' },
      { href: 'salaries.html', id: 'salaries', label: 'Salaries' },
      { href: 'interview.html', id: 'interview', label: 'Interview Prep' }
    ];
    var html = '<nav class="nav"><div class="nav-inner"><a href="index.html" class="nav-logo">Magic<span>Circle</span>Hub</a><div class="nav-links">';
    links.forEach(function(l) {
      html += '<a href="' + l.href + '" class="nav-link' + (active === l.id ? ' active' : '') + '">' + l.label + '</a>';
    });
    html += '</div><a href="match.html" class="nav-cta">&#x26A1; Find My Firm</a></div></nav>';
    return html;
  },
  footer: function() {
    return '<footer class="footer"><div class="footer-inner"><div class="footer-logo">Magic<span>Circle</span>Hub</div><p class="footer-tagline">The daily intelligence platform for Magic Circle law firm applicants.</p><div class="footer-grid"><div><div class="footer-col-title">Navigate</div><a href="index.html" class="footer-link">News</a><a href="firms.html" class="footer-link">Firm Profiles</a><a href="compare.html" class="footer-link">Compare Firms</a><a href="match.html" class="footer-link">Find My Firm</a></div><div><div class="footer-col-title">Resources</div><a href="deadlines.html" class="footer-link">TC Deadlines</a><a href="salaries.html" class="footer-link">Salary Guide</a><a href="interview.html" class="footer-link">Interview Prep</a></div><div><div class="footer-col-title">Firms</div><a href="firms.html#ao" class="footer-link">A&O Shearman</a><a href="firms.html#cc" class="footer-link">Clifford Chance</a><a href="firms.html#fresh" class="footer-link">Freshfields</a><a href="firms.html#link" class="footer-link">Linklaters</a><a href="firms.html#slaughter" class="footer-link">Slaughter and May</a></div><div><div class="footer-col-title">About</div><p style="font-size:13px;color:#6b7280;line-height:1.6;">Built for law students navigating Magic Circle applications. Updated weekly.</p></div></div><div class="footer-bottom"><span>&copy; 2026 MagicCircleHub &mdash; For educational purposes only.</span></div></div></footer>';
  }
};
