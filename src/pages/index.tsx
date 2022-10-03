import Link from 'next/link';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import xss from 'xss';
import client from 'apolloClient';

type Description = {
  html: string;
};

type Post = {
  id: number;
  slug: string;
  title: string;
  date: string;
  description: Description;
};

type Posts = {
  posts: Post[];
};

export default function Home({ posts }: Posts) {
  return (
    <ul>
      {posts.map((entry: Post) => (
        <li key={entry.id} className="mb-2">
          <Link href={entry.slug} passHref>
            <a href="replace" className="font-semibold text-blue-800 underline">
              {entry.title}
            </a>
          </Link>
          <div className="text-gray-500 text-sm py-1">
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
