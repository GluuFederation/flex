function setTitle(title: string = 'Dashboard') {
  if (typeof window !== 'undefined') {
    const pageTitle = document.getElementById('page-title')
    const pageTitleNavbar = document.getElementById('page-title-navbar')

    if (pageTitle) {
      pageTitle.innerHTML = title
    }

    if (pageTitleNavbar) {
      pageTitleNavbar.innerHTML = title
    }
  }
}

export default setTitle
