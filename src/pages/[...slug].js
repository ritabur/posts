import Image from 'next/image';
import { gql } from '@apollo/client';
import xss from 'xss';
import client from 'apolloClient';

export default function PostPage({ post }) {
  return (
    <div>
      <div className="font-semibold">{post.title}</div>
      <div className="w-[200px] h-[100px] relative">
        <Image
          src={post.image.url}
          layout="fill"
          objectFit="contain"
          alt={`${post.title} post image`}
        />
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: xss(post.description.html),
        }}
      />
    </div>
  );
}

// for generating individual page urls
export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query {
        posts {
          slug
        }
      }
    `,
  });
  const { posts } = data;
  const paths = posts.map((test) => ({
    params: { slug: [test.slug] },
  }));
  return { paths, fallback: false };
}

// for getting info for the individual pages generated
export async function getStaticProps({ params }) {
  const slug = params.slug[0];
  const { data } = await client.query({
    query: gql`
      query PostBySlug($slug: String!) {
        posts(where: { slug: $slug }) {
          id
          title
          slug
          description {
            html
          }
          image {
            url
          }
        }
      }
    `,
    variables: { slug },
  });
  const { posts } = data;
  const post = posts[0];
  return {
    props: { post },
  };
}
