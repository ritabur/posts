import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { GetStaticProps, GetStaticPaths } from 'next';
import { gql } from '@apollo/client';
import xss from 'xss';
import client from 'apolloClient';
import React from 'react';

interface IParams extends ParsedUrlQuery {
  slug: string;
}

type Description = {
  html: string;
};

type ImageType = {
  url: string;
};

type Post = {
  image: ImageType;
  description: Description;
  title: string;
  slug: string;
};

export default function PostPage({ post }: { post: Post }) {
  return (
    <div data-test="post-page">
      <div className="font-semibold pb-1">{post.title}</div>
      <div className="w-[200px] h-[100px] relative">
        <Image
          src={post.image.url}
          layout="fill"
          objectFit="cover"
          alt={`${post.title} post image`}
        />
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: xss(post.description.html),
        }}
        className="pt-1"
      />
    </div>
  );
}

// for generating individual page urls
export const getStaticPaths: GetStaticPaths = async () => {
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
  const paths = posts.map((post: Post) => ({
    params: { slug: [post.slug] },
  }));
  return { paths, fallback: false };
};

// for getting info for the individual pages generated
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug: arr } = context.params as IParams;
  const slug = arr[0];
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
};
