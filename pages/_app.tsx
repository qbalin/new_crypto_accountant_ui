import { AppProps } from 'next/app'
import Head from 'next/head'
import { Navbar, Container, Nav } from 'react-bootstrap';
import NextLink from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

const Link = ({children, href}) =>
  <NextLink href={href}>
    <a className="nav-link" rel="noopener noreferrer">
    {children}
    </a>
  </NextLink>;

export default function App({ Component, pageProps } : AppProps) {
  return (
      <div>
        <Head>
          <title>New Crypto Accountant</title>
        </Head>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="#home">New Crypto Accountant</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link href='/'>Home</Link>
                <Link href='/accounts'>Accounts</Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Component {...pageProps} />
        </Container>
      </div>
    );
}
