import {
  sanityClient,
  urlFor,
  usePreviewSubscription,
  PortableText,
} from "../../lib/sanity";
import { useState } from "react";

const recipeQuery = `*[_type == 'recipe' && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions,
    likes
}`;

const OneRecipe = ({ data, preview }) => {
  if (!data) {
    return <div>Loading...</div>;
  }
  const { recipe } = data;
  const [likes, setLikes] = useState(data?.recipe?.likes);

  const addLike = async () => {
    const res = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((err) => console.log(err));

    const data = await res.json();

    setLikes(data.likes);
  };

  return (
    <article className="recipe">
      <h1>{recipe.name}</h1>
      <button className="likeButton" onClick={() => addLike()}>
        {likes}❤️
      </button>
      <main className="content">
        <img src={urlFor(recipe.mainImage).url()} alt={recipe.name} />
        <div className="breakdown">
          <ul className="ingredients">
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key} className="ingredient">
                {ingredient?.wholeNumber} {ingredient?.fraction}{" "}
                {ingredient?.unit} <br /> {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <div className="instructions">
            <PortableText value={recipe?.instructions} />
          </div>
        </div>
      </main>
    </article>
  );
};

export const getStaticPaths = async () => {
  const paths = await sanityClient.fetch(
    `*[_type == 'recipe' && defined(slug.current)]{
        "params":{
            "slug":slug.current
        }
    }`
  );

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });

  return { props: { data: { recipe }, preview: true } };
};

export default OneRecipe;
