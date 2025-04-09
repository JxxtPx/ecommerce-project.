import openai from "../utils/openai.js";

// POST /api/ai/compare
const compareProductsAI = async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "No products provided for comparison." });
  }

  const prompt = `Compare the following liquor products in terms of:
- Taste
- Alcohol percentage
- Ideal usage
- Price

Here are the products:

${products
  .map((p, i) => `${i + 1}. ${p.name} - ${p.description}`)
  .join("\n")}

Give a concise bullet-point comparison and recommend best use-case for each.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ result: aiResponse });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({ message: "AI comparison failed", error: error.message });
  }
};


const generateCocktail = async (req, res) => {
  let { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: "No ingredients provided" });
  }

  // Convert string to array if needed
  if (typeof ingredients === "string") {
    ingredients = ingredients.split(",").map((i) => i.trim());
  }

  const prompt = `Suggest a unique cocktail recipe using these ingredients: ${ingredients.join(
    ", "
  )}. The response should include the cocktail name, a list of ingredients with measurements, and clear step-by-step preparation instructions. Format it neatly for readability.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const cocktail = completion.choices[0].message.content;
    res.json({ cocktail });
  } catch (error) {
    console.error("Cocktail AI error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate cocktail", error: error.message });
  }
};





export { compareProductsAI, generateCocktail };
