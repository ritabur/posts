import Image from 'next/image';
import { gql } from '@apollo/client';
import client from '../../apolloClient';

export default function PostPage({post}) {
  return (
    <div>
      <div>{post.title}</div>
      <Image src={post.image.url} alt={`${post.title} post image`} width={300} height={200} />
      <div dangerouslySetInnerHTML={{__html: post.description.html}} />
    </div>
  )
}

// for generating individual page urls
export async function getStaticPaths() {
  const {data} = await client.query({
    query: gql`
    query {
      posts {
        slug
      }
    }
  `})
  const {posts} = data;
  const paths = posts.map(test => ({
    params: {slug: [test.slug]}
  }))
  return {paths, fallback: false}
}

// for getting info for the individual pages generated
export async function getStaticProps({params}) {
  const slug = params.slug[0];
  const {data} = await client.query({
    query: gql`
    query PostBySlug($slug: String!){
      posts (where: {slug: $slug}) {
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
  `, variables: {slug}})
  const {posts} = data;
  const post = posts[0];
  return {
    props: {post}
  }
}