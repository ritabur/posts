import Head from 'next/head';
import Link from 'next/link';
import { gql } from '@apollo/client';
import * as dayjs from 'dayjs';
import xss from 'xss';
import client from '../../apolloClient';

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Posts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ul>
          {posts.map((entry) => (
            <li key={entry.id}>
              <Link href={entry.slug}>{entry.title}</Link>
              <div className="text-lg font-semibold text-slate-500">
                {dayjs(entry.date).format('D MMM YYYY')}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: xss(entry.description.html),
                }}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query {
        posts {
          id
          title
          date
          slug
          description {
            html
          }
        }
      }
    `,
  });
  const { posts } = data;
  return {
    props: { posts },
  };
}
