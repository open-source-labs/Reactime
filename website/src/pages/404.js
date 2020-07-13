import React from "react"

import Splash from "../components/splash"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Splash>
    <SEO title="404: Not found" />
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Splash>
)

export default NotFoundPage
