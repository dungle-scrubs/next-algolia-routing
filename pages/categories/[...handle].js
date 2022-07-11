import Head from 'next/head'
import { GetServerSideProps } from 'next'
import algoliasearch from 'algoliasearch/lite'
import { Hit as AlgoliaHit } from 'instantsearch.js'
import {
  DynamicWidgets,
  InstantSearch,
  Hits,
  Highlight,
  RefinementList,
  SearchBox,
  InstantSearchServerState,
  InstantSearchSSRProvider,
  useInstantSearch,
  HierarchicalMenu,
} from 'react-instantsearch-hooks-web'
// import { getServerState } from 'react-instantsearch-hooks-server'
import { history } from 'instantsearch.js/es/lib/routers/index.js'
import { routing } from '../../utils'
import Layout from '../../components/Layout'

const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')

function Stats() {
  const { indexUiState } = useInstantSearch()

  console.log(`👾 Stats > indexUiState`, indexUiState)
  return null
}

function Hit({ hit }) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  )
}

export default function CategoryPage(props) {
  console.log('CategoryPage > props', props)
  const {
    params,
    apiResponse,
    // serverState,
    // url
  } = props

  return (
    <Layout>
      {/* <InstantSearchSSRProvider {...serverState}> */}
      <Head>
        <title>React InstantSearch Hooks - Next.js</title>
      </Head>

      <div
        style={{
          width: 'clamp(16rem, 90vw, 70rem)',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        <h1>{apiResponse}</h1>
        <InstantSearch
          searchClient={client}
          indexName="instant_search"
          routing={routing}
          // routing={{
          //   router: history({
          //     getLocation: () => (typeof window === 'undefined' ? new URL(url) : window.location),
          //   }),
          // }}
        >
          <Stats />
          <div
            className="Container"
            style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gridGap: '2rem' }}
          >
            <div>
              <HierarchicalMenu
                attributes={[
                  'hierarchicalCategories.lvl0',
                  'hierarchicalCategories.lvl1',
                  'hierarchicalCategories.lvl2',
                  'hierarchicalCategories.lvl3',
                ]}
              />
            </div>
            <div>
              <SearchBox />
              <Hits hitComponent={Hit} />
            </div>
          </div>
        </InstantSearch>
      </div>
      {/* </InstantSearchSSRProvider> */}
    </Layout>
  )
}

/**
 * Can't use Algolia with SSR - bug
 * https://issuehint.com/issue/algolia/react-instantsearch/3530
 */
export const getServerSideProps = async function getServerSideProps({ params }) {
  const { handle } = params
  // const protocol = req.headers.referer?.split('://')[0] || 'https'
  // const url = `${protocol}://${req.headers.host}${req.url}`
  // const serverState = await getServerState(<HomePage url={url} />)
  // console.log('serverState', serverState)

  const apiResponse =
    handle[0] === 'appliances'
      ? 'This string comes from a separate mock API using the chosen Algolia (hierarchical) category'
      : handle[0] === 'asdf'
      ? 'asdf'
      : null

  console.log('Category Page:getServerSideProps > params', params)
  console.log('Category Page:getServerSideProps > handle', handle)
  console.log('Category Page:getServerSideProps > apiResponse', apiResponse)
  return {
    props: {
      params,
      apiResponse,
    },
  }
}
