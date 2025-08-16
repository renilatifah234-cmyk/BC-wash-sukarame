import bcrypt from "bcryptjs"

async function generateHashedPasswords() {
  const password = "password123"
  const saltRounds = 10

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    console.log("Password:", password)
    console.log("Hashed:", hashedPassword)

    // Verify the hash works
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log("Verification:", isValid ? "✓ Valid" : "✗ Invalid")
  } catch (error) {
    console.error("Error generating hash:", error)
  }
}

generateHashedPasswords()
