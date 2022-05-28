import Head from "next/head";
import styles from "../styles/Home.module.css";
import { sanityClient, urlFor } from "../lib/sanity";
import Link from "next/link";

const recipesQuery = `*[_type == 'recipe']{
  name,
  _id,
  slug,
  mainImage
}`;

export default function Home({ recipes }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Next-Kitchen 🍍</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.io" />
      </Head>

      <h1>Welcome to the Next-Kitchen 🍍</h1>

      <ul className="recipes-list">
        {recipes?.length > 0 &&
          recipes.map((recipe) => (
            <li key={recipe._id} className="recipe-card">
              <Link href={`/recipes/${recipe.slug.current}`}>
                <a>
                  <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
                  <span>{recipe.name}</span>
                </a>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export const getStaticProps = async () => {
  const recipes = await sanityClient.fetch(recipesQuery);

  return { props: { recipes } };
};
