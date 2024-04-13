import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className='scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-primary-100 scrollbar-thumb-rounded scrollbar-track-rounded hover:scrollbar-thumb-primary-300 overflow-y-auto'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
