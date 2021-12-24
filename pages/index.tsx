import Head from 'next/head'
import {Button} from 'react-bootstrap'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Vectigalia</title>
      </Head>

      <main>
        <Button>Clik</Button>
      </main>

      <style jsx>{`
      `}</style>
    </div>
  )
}
