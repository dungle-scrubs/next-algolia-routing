import Link from 'next/link'

const Layout = (props) => {
  const { children } = props

  return (
    <div>
      <div
        style={{
          width: '100vw',
          height: '80px',
          background: 'lightblue',
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        <Link href="/">Home</Link>
      </div>
      {children}
    </div>
  )
}

export default Layout
