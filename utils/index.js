import { history } from 'instantsearch.js/es/lib/routers'

// Returns a slug from the category name.
// Spaces are replaced by "+" to make
// the URL easier to read and other
// characters are encoded.
function getCategorySlug(name) {
  return name.split(' ').map(encodeURIComponent).join('+')
}

// Returns a name from the category slug.
// The "+" are replaced by spaces and other
// characters are decoded.
function getCategoryName(slug) {
  return slug.split('+').map(decodeURIComponent).join(' ')
}

export const routing = {
  router: history({
    windowTitle({ category, query }) {
      const queryTitle = query ? `Results for "${query}"` : 'Search'

      if (category) {
        return `${category} – ${queryTitle}`
      }

      return queryTitle
    },

    createURL({ qsModule, routeState, location }) {
      // console.log('routing > createURL > routeState', routeState)
      const urlParts = location.href.match(/^(.*?)\/search/)
      const baseUrl = `${urlParts ? urlParts[1] : ''}/`

      const categoryPath = routeState.category ? `${getCategorySlug(routeState.category)}/` : ''
      const queryParameters = {}

      if (routeState.query) {
        queryParameters.query = encodeURIComponent(routeState.query)
      }
      if (routeState.page !== 1) {
        queryParameters.page = routeState.page
      }
      if (routeState.brands) {
        queryParameters.brands = routeState.brands.map(encodeURIComponent)
      }

      const queryString = qsModule.stringify(queryParameters, {
        addQueryPrefix: true,
        arrayFormat: 'repeat',
      })

      let hierarchyPath = ''
      if (routeState.hierarchicalMenu) {
        hierarchyPath = routeState.hierarchicalMenu.reduce((prev, next) => {
          return (prev += `/${getCategorySlug(next)}`)
        })
      }

      console.log('path', hierarchyPath)

      return `${baseUrl}categories/${hierarchyPath}${queryString}`
    },

    parseURL({ qsModule, location }) {
      const pathnameMatches = location.pathname.match(/search\/(.*?)\/?$/)
      const category = getCategoryName(pathnameMatches?.[1] || '')
      const { query = '', page, brands = [] } = qsModule.parse(location.search.slice(1))
      // `qs` does not return an array when there's a single value.
      const allBrands = Array.isArray(brands) ? brands : [brands].filter(Boolean)

      return {
        query: decodeURIComponent(query),
        page,
        brands: allBrands.map(decodeURIComponent),
        category,
      }
    },
  }),

  stateMapping: {
    stateToRoute(uiState) {
      const indexUiState = uiState['instant_search'] || {}

      return {
        query: indexUiState.query,
        page: indexUiState.page,
        brands: indexUiState.refinementList?.brand,
        category: indexUiState.menu?.categories,
        hierarchicalMenu: indexUiState.hierarchicalMenu?.['hierarchicalCategories.lvl0'],
      }
    },

    routeToState(routeState) {
      return {
        instant_search: {
          query: routeState.query,
          page: routeState.page,
          menu: {
            categories: routeState.category,
          },
          refinementList: {
            brand: routeState.brands,
          },
        },
      }
    },
  },
}
