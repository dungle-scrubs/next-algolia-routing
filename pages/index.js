import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function HomePage({ serverState, url }) {
  return (
    <Layout>
      <Head>
        <title>Home page</title>
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
        <Link href="/categories/appliances">Link --> Category - appliances</Link>
      </div>
    </Layout>
  )
}
