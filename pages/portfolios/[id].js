import React from 'react'

const PortfolioDetail = () => {
  return (
    <React.Fragment>
      <div className="portfolio-detail">
        <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
          <main role="main" className="inner page-cover">
            <React.Fragment>
              <h1 className="cover-heading">Amazing Experience</h1>
              <p className="lead dates">27/12/2009 - 31/04/2011</p>
              <p className="lead info mb-0">Developer | Eincode | New York</p>
              <p className="lead">Some description about the job</p>
              <p className="lead">
                <a href="#" target="_" className="btn btn-lg btn-secondary">Visit Company</a>
              </p>
            </React.Fragment>
          </main>
        </div>
      </div>
    </React.Fragment>
  )
}

export default PortfolioDetail
